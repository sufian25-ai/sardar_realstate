<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AgentPaymentController extends Controller
{
    /**
     * Get all payments for agent management
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user || !in_array($user->role, ['agent', 'admin'])) {
                return $this->errorResponse('Unauthorized access', 403);
            }

            $query = Payment::with([
                'user:id,name,email,phone',
                'property:pid,title,pimage,price,location,stype'
            ]);

            // Apply filters
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->has('property_id')) {
                $query->where('property_id', $request->property_id);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->whereHas('user', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                })->orWhereHas('property', function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%");
                })->orWhere('transaction_id', 'like', "%{$search}%");
            }

            $payments = $query->orderBy('created_at', 'desc')->paginate(20);

            return $this->successResponse('Payments fetched successfully', $payments);
        } catch (\Exception $e) {
            Log::error('Agent Payment Fetch Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to fetch payments', 500);
        }
    }

    /**
     * Update payment status
     */
    public function updateStatus(Request $request, $paymentId)
    {
        try {
            $user = Auth::user();
            
            Log::info('Payment status update attempt', [
                'payment_id' => $paymentId,
                'user_id' => $user->id ?? 'null',
                'user_role' => $user->role ?? 'null',
                'request_data' => $request->all()
            ]);
            
            if (!$user) {
                return $this->errorResponse('User not authenticated', 401);
            }
            
            if (!in_array($user->role, ['agent', 'admin'])) {
                return $this->errorResponse('Unauthorized access. Only agents and admins can update payment status.', 403);
            }

            $validated = $request->validate([
                'status' => 'required|in:pending,processing,completed,cancelled',
                'admin_notes' => 'nullable|string|max:1000'
            ]);

            $payment = Payment::find($paymentId);
            
            if (!$payment) {
                Log::error('Payment not found', ['payment_id' => $paymentId]);
                return $this->errorResponse('Payment not found', 404);
            }

            // Store old status for logging
            $oldStatus = $payment->status;

            // Update payment with explicit field mapping
            $updateData = [
                'status' => $validated['status'],
                'approved_by' => $user->id,
            ];

            if (isset($validated['admin_notes'])) {
                $updateData['admin_notes'] = $validated['admin_notes'];
            }

            // Check if this is a completion and handle property ownership
            if ($validated['status'] === 'completed') {
                $this->handlePropertyCompletion($payment, $user);
            }

            $updated = $payment->update($updateData);

            if (!$updated) {
                Log::error('Failed to update payment in database', [
                    'payment_id' => $paymentId,
                    'update_data' => $updateData
                ]);
                return $this->errorResponse('Failed to update payment in database', 500);
            }

            // Log the status change
            Log::info("Payment status updated successfully", [
                'payment_id' => $payment->id,
                'old_status' => $oldStatus,
                'new_status' => $validated['status'],
                'updated_by' => $user->id,
                'user_name' => $user->name
            ]);

            // Load fresh data with relationships
            $payment->load(['user:id,name,email', 'property:pid,title,price']);

            return $this->successResponse('Payment status updated successfully', [
                'payment' => $payment,
                'old_status' => $oldStatus,
                'new_status' => $validated['status']
            ]);
        } catch (ValidationException $e) {
            Log::error('Validation failed for payment status update', [
                'payment_id' => $paymentId,
                'errors' => $e->errors()
            ]);
            return $this->errorResponse('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            Log::error('Payment Status Update Error', [
                'payment_id' => $paymentId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Failed to update payment status: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get payment statistics
     */
    public function statistics(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user || !in_array($user->role, ['agent', 'admin'])) {
                return $this->errorResponse('Unauthorized access', 403);
            }

            $stats = [
                'total_payments' => Payment::count(),
                'pending_payments' => Payment::where('status', 'pending')->count(),
                'processing_payments' => Payment::where('status', 'processing')->count(),
                'completed_payments' => Payment::where('status', 'completed')->count(),
                'cancelled_payments' => Payment::where('status', 'cancelled')->count(),
                'total_amount' => Payment::where('status', 'completed')->sum('amount_paid'),
                'pending_amount' => Payment::where('status', 'pending')->sum('amount_paid'),
                'processing_amount' => Payment::where('status', 'processing')->sum('amount_paid'),
            ];

            // Monthly statistics
            $monthlyStats = Payment::selectRaw('
                MONTH(created_at) as month,
                YEAR(created_at) as year,
                COUNT(*) as count,
                SUM(amount_paid) as total_amount,
                status
            ')
            ->whereYear('created_at', date('Y'))
            ->groupBy('month', 'year', 'status')
            ->orderBy('month')
            ->get();

            $stats['monthly_breakdown'] = $monthlyStats;

            return $this->successResponse('Statistics fetched successfully', $stats);
        } catch (\Exception $e) {
            Log::error('Payment Statistics Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to fetch statistics', 500);
        }
    }

    /**
     * Get payment details with property progress
     */
    public function paymentDetails($paymentId)
    {
        try {
            $user = Auth::user();
            
            if (!$user || !in_array($user->role, ['agent', 'admin'])) {
                return $this->errorResponse('Unauthorized access', 403);
            }

            $payment = Payment::with([
                'user:id,name,email,phone,address',
                'property:pid,title,pimage,price,location,stype,bedroom,bathroom,size'
            ])->find($paymentId);

            if (!$payment) {
                return $this->errorResponse('Payment not found', 404);
            }

            // Get all payments for this property by this user
            $allPayments = Payment::where('property_id', $payment->property_id)
                ->where('user_id', $payment->user_id)
                ->orderBy('created_at', 'desc')
                ->get();

            // Calculate progress
            $totalPaid = $allPayments->where('status', 'completed')->sum('amount_paid');
            $processingAmount = $allPayments->where('status', 'processing')->sum('amount_paid');
            $pendingAmount = $allPayments->where('status', 'pending')->sum('amount_paid');
            
            $propertyPrice = $payment->property->price ?? 0;
            $remainingAmount = max(0, $propertyPrice - $totalPaid);
            $paymentProgress = $propertyPrice > 0 ? ($totalPaid / $propertyPrice) * 100 : 0;

            $paymentDetails = [
                'payment' => $payment,
                'all_payments' => $allPayments,
                'progress' => [
                    'property_price' => $propertyPrice,
                    'total_paid' => $totalPaid,
                    'processing_amount' => $processingAmount,
                    'pending_amount' => $pendingAmount,
                    'remaining_amount' => $remainingAmount,
                    'payment_progress' => round($paymentProgress, 2),
                    'is_fully_paid' => $remainingAmount <= 0,
                    'payment_count' => $allPayments->count(),
                    'completed_payments' => $allPayments->where('status', 'completed')->count(),
                    'processing_payments' => $allPayments->where('status', 'processing')->count(),
                    'pending_payments' => $allPayments->where('status', 'pending')->count(),
                ]
            ];

            return $this->successResponse('Payment details fetched successfully', $paymentDetails);
        } catch (\Exception $e) {
            Log::error('Payment Details Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to fetch payment details', 500);
        }
    }

    /**
     * Get user payment summary
     */
    public function userPaymentSummary($userId)
    {
        try {
            $user = Auth::user();
            
            if (!$user || !in_array($user->role, ['agent', 'admin'])) {
                return $this->errorResponse('Unauthorized access', 403);
            }

            $targetUser = User::find($userId);
            if (!$targetUser) {
                return $this->errorResponse('User not found', 404);
            }

            $payments = Payment::with('property:pid,title,price,location')
                ->where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get();

            $summary = [
                'user' => $targetUser,
                'total_payments' => $payments->count(),
                'total_amount_paid' => $payments->where('status', 'completed')->sum('amount_paid'),
                'pending_amount' => $payments->where('status', 'pending')->sum('amount_paid'),
                'processing_amount' => $payments->where('status', 'processing')->sum('amount_paid'),
                'properties_count' => $payments->unique('property_id')->count(),
                'fully_owned_properties' => 0, // Will calculate below
                'payments' => $payments
            ];

            // Calculate fully owned properties
            $propertyGroups = $payments->groupBy('property_id');
            foreach ($propertyGroups as $propertyId => $propertyPayments) {
                $property = $propertyPayments->first()->property;
                if ($property) {
                    $totalPaid = $propertyPayments->where('status', 'completed')->sum('amount_paid');
                    if ($totalPaid >= $property->price) {
                        $summary['fully_owned_properties']++;
                    }
                }
            }

            return $this->successResponse('User payment summary fetched successfully', $summary);
        } catch (\Exception $e) {
            Log::error('User Payment Summary Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to fetch user payment summary', 500);
        }
    }

    /**
     * Handle property completion when payment is marked as completed
     */
    private function handlePropertyCompletion($payment, $approver)
    {
        try {
            // Check if this property is fully paid
            $totalPaid = Payment::where('property_id', $payment->property_id)
                ->where('user_id', $payment->user_id)
                ->where('status', 'completed')
                ->sum('amount_paid');

            $property = $payment->property;
            
            if ($property && $totalPaid >= $property->price) {
                // Property is fully paid - transfer ownership
                Log::info('Property fully paid, transferring ownership', [
                    'property_id' => $property->pid,
                    'user_id' => $payment->user_id,
                    'total_paid' => $totalPaid,
                    'property_price' => $property->price
                ]);

                // You can add property ownership transfer logic here
                // For example, create a UserProperty record or update property status
                
                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Property completion handling error: ' . $e->getMessage());
            return false;
        }
    }

    // Helper methods
    private function successResponse($message, $data = null, $code = 200)
    {
        return response()->json([
            'response_code' => $code,
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    private function errorResponse($message, $code = 500, $errors = null)
    {
        $response = [
            'response_code' => $code,
            'status' => 'error',
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }
}
