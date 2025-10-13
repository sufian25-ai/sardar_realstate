<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class UserProfileController extends Controller
{
    /**
     * Get user profile with all related data
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('User not authenticated', 401);
            }

            // Load user with relationships - handle missing relations gracefully
            $userProfile = User::find($user->id);
            
            if (!$userProfile) {
                return $this->errorResponse('User not found', 404);
            }

            // Load relationships separately to handle errors
            try {
                $userProfile->load([
                    'payments.property:pid,title,pimage,price,location',
                    'inquiries.property:pid,title'
                ]);
            } catch (\Exception $relationError) {
                Log::warning('Relation loading error: ' . $relationError->getMessage());
                // Continue without relations if there's an error
            }

            // Get payment statistics with null checks
            $payments = $userProfile->payments ?? collect();
            $inquiries = $userProfile->inquiries ?? collect();
            
            $totalPayments = $payments->count();
            $completedPayments = $payments->where('status', 'completed')->count();
            $processingPayments = $payments->where('status', 'processing')->count();
            $pendingPayments = $payments->where('status', 'pending')->count();

            // Get owned properties (completed payments)
            $ownedProperties = $payments->where('status', 'completed')->unique('property_id')->count();

            return $this->successResponse('Profile fetched successfully', [
                'user' => $userProfile,
                'stats' => [
                    'total_payments' => $totalPayments,
                    'owned_properties' => $ownedProperties,
                    'total_inquiries' => $inquiries->count(),
                    'pending_payments' => $pendingPayments,
                    'processing_payments' => $processingPayments,
                    'completed_payments' => $completedPayments,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Profile Fetch Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to fetch profile', 500);
        }
    }

    /**
     * Update user profile
     */
    public function update(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('User not authenticated', 401);
            }

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'phone' => 'sometimes|nullable|string|max:20',
                'address' => 'sometimes|nullable|string',
                'bio' => 'sometimes|nullable|string',
                'date_of_birth' => 'sometimes|nullable|date',
                'gender' => 'sometimes|nullable|in:male,female,other',
                'occupation' => 'sometimes|nullable|string|max:255',
                'annual_income' => 'sometimes|nullable|numeric|min:0',
            ]);

            $user->update($validated);
            $updatedUser = $user->fresh();

            return $this->successResponse('Profile updated successfully', [
                'user' => $updatedUser
            ]);
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            Log::error('Profile Update Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to update profile', 500);
        }
    }

    /**
     * Get user orders with payment details
     */
    public function orders(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('User not authenticated', 401);
            }

            // Get payments with property details (acting as orders)
            $payments = Payment::with('property:pid,title,pimage,price,location,stype')
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            // Add payment details for each payment
            foreach ($payments as $payment) {
                Log::info('Processing payment for orders', [
                    'payment_id' => $payment->id,
                    'property_id' => $payment->property_id,
                    'property_stype' => $payment->property->stype ?? 'null'
                ]);
                
                if ($payment->property) {
                    if ($payment->property->stype === 'sale') {
                        // Get all payments for this property by this user
                        $allPayments = Payment::where('property_id', $payment->property->pid)
                            ->where('user_id', $user->id)
                            ->orderBy('created_at', 'desc')
                            ->get();

                        $totalPaid = $allPayments->where('status', 'completed')->sum('amount_paid');
                        $remainingAmount = max(0, $payment->property->price - $totalPaid);
                        $paymentProgress = $payment->property->price > 0 ? ($totalPaid / $payment->property->price) * 100 : 0;

                        $payment->payment_details = [
                            'payment_type' => 'sale',
                            'total_property_price' => $payment->property->price,
                            'total_paid' => $totalPaid,
                            'remaining_amount' => $remainingAmount,
                            'payment_progress' => round($paymentProgress, 2),
                            'is_fully_paid' => $remainingAmount <= 0,
                            'payment_count' => $allPayments->count(),
                            'completed_payments' => $allPayments->where('status', 'completed')->count(),
                            'processing_payments' => $allPayments->where('status', 'processing')->count(),
                            'pending_payments' => $allPayments->where('status', 'pending')->count(),
                            'latest_payment' => $allPayments->first()
                        ];
                    } else {
                        // Get payment details from rent_payments table
                        $rentPayments = \App\Models\RentPayment::where('property_id', $payment->property->pid)
                            ->where('user_id', $user->id)
                            ->orderBy('created_at', 'desc')
                            ->get();

                        $totalPaid = $rentPayments->where('status', 'paid')->sum('amount_paid');
                        $pendingAmount = $rentPayments->where('status', 'pending')->sum('amount_paid');

                        $payment->payment_details = [
                            'payment_type' => 'rent',
                            'total_paid' => $totalPaid,
                            'pending_amount' => $pendingAmount,
                            'payment_count' => $rentPayments->count(),
                            'paid_installments' => $rentPayments->where('status', 'paid')->count(),
                            'pending_installments' => $rentPayments->where('status', 'pending')->count(),
                            'overdue_installments' => $rentPayments->where('status', 'overdue')->count(),
                            'latest_payment' => $rentPayments->first()
                        ];
                    }
                }
            }

            return $this->successResponse('Orders fetched successfully', $payments);
        } catch (\Exception $e) {
            Log::error('Orders Fetch Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to fetch orders', 500);
        }
    }

    /**
     * Get user properties
     */
    public function properties(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('User not authenticated', 401);
            }

            // Get owned properties through completed payments
            $completedPayments = Payment::with('property:pid,title,pimage,price,location,bedroom,bathroom,size,type')
                ->where('user_id', $user->id)
                ->where('status', 'completed')
                ->orderBy('created_at', 'desc')
                ->get()
                ->unique('property_id')
                ->values();

            // Transform to match expected structure
            $properties = $completedPayments->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'user_id' => $payment->user_id,
                    'property_id' => $payment->property_id,
                    'ownership_type' => 'owned',
                    'purchase_price' => $payment->amount_paid,
                    'purchase_date' => $payment->payment_date,
                    'ownership_notes' => 'Property purchased through payment system',
                    'created_at' => $payment->created_at,
                    'updated_at' => $payment->updated_at,
                    'property' => $payment->property
                ];
            });

            // Paginate manually
            $page = $request->get('page', 1);
            $perPage = 10;
            $offset = ($page - 1) * $perPage;
            $paginatedProperties = $properties->slice($offset, $perPage)->values();

            $paginationData = [
                'data' => $paginatedProperties,
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $properties->count(),
                'last_page' => ceil($properties->count() / $perPage),
                'from' => $offset + 1,
                'to' => min($offset + $perPage, $properties->count())
            ];

            return $this->successResponse('Properties fetched successfully', $paginationData);
        } catch (\Exception $e) {
            Log::error('Properties Fetch Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to fetch properties', 500);
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
