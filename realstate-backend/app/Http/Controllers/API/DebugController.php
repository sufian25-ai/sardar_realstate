<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DebugController extends Controller
{
    public function testPaymentProgress()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'Not authenticated'], 401);
            }

            // Get user's payments
            $payments = Payment::with('property:pid,title,price,stype')
                ->where('user_id', $user->id)
                ->get();

            $debugData = [];
            
            foreach ($payments as $payment) {
                $paymentDebug = [
                    'payment_id' => $payment->id,
                    'amount_paid' => $payment->amount_paid,
                    'status' => $payment->status,
                    'property' => $payment->property ? [
                        'pid' => $payment->property->pid,
                        'title' => $payment->property->title,
                        'price' => $payment->property->price,
                        'stype' => $payment->property->stype
                    ] : null,
                    'payment_details' => null
                ];

                if ($payment->property && $payment->property->stype === 'sale') {
                    // Calculate payment details
                    $allPayments = Payment::where('property_id', $payment->property->pid)
                        ->where('user_id', $user->id)
                        ->get();

                    $totalPaid = $allPayments->where('status', 'completed')->sum('amount_paid');
                    $remainingAmount = max(0, $payment->property->price - $totalPaid);
                    $paymentProgress = $payment->property->price > 0 ? ($totalPaid / $payment->property->price) * 100 : 0;

                    $paymentDebug['payment_details'] = [
                        'payment_type' => 'sale',
                        'total_property_price' => $payment->property->price,
                        'total_paid' => $totalPaid,
                        'remaining_amount' => $remainingAmount,
                        'payment_progress' => round($paymentProgress, 2),
                        'is_fully_paid' => $remainingAmount <= 0,
                        'all_payments_count' => $allPayments->count(),
                        'completed_payments' => $allPayments->where('status', 'completed')->count(),
                        'pending_payments' => $allPayments->where('status', 'pending')->count(),
                        'processing_payments' => $allPayments->where('status', 'processing')->count()
                    ];
                }

                $debugData[] = $paymentDebug;
            }

            return response()->json([
                'user_id' => $user->id,
                'user_name' => $user->name,
                'total_payments' => $payments->count(),
                'payments' => $debugData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}
