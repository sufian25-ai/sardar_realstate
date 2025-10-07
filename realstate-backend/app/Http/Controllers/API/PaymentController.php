<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Payment::with('property:pid,title', 'user:id,name,email', 'rent:id,monthly_rent');

            // Filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('property_id')) {
                $query->where('property_id', $request->property_id);
            }

            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->has('rent_id')) {
                $query->where('rent_id', $request->rent_id);
            }

            // For non-admin users, only show their own payments
            if ($request->user()->role !== 'admin') {
                $query->where('user_id', $request->user()->id);
            }

            $payments = $query->paginate(10);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Payments fetched successfully',
                'data' => $payments,
            ]);
        } catch (\Exception $e) {
            Log::error('Payments Fetch Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to fetch payments',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'property_id' => 'required|exists:properties,pid',
                'rent_id' => 'nullable|exists:rents,rid',
                'amount' => 'required|numeric|min:0.01',
                'payment_method' => 'required|in:card,bank_transfer,cash,online',
                'transaction_id' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
            ]);

            $property = Property::findOrFail($validated['property_id']);

            // Check authorization - only property owner or admin can create payment records
            if ($property->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $validated['user_id'] = $property->user_id;

            $payment = Payment::create($validated);

            return response()->json([
                'response_code' => 201,
                'status' => 'success',
                'message' => 'Payment record created successfully',
                'data' => $payment->load('property:pid,title', 'user:id,name,email'),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Payment Create Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to create payment record',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $payment = Payment::with('property:pid,title,location', 'user:id,name,email', 'rent')->findOrFail($id);

            // Check authorization
            if ($payment->user_id !== request()->user()->id && request()->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Payment fetched successfully',
                'data' => $payment,
            ]);
        } catch (\Exception $e) {
            Log::error('Payment Show Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 404,
                'status' => 'error',
                'message' => 'Payment not found',
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $payment = Payment::findOrFail($id);

            // Check authorization
            if ($payment->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $validated = $request->validate([
                'amount' => 'sometimes|required|numeric|min:0.01',
                'payment_method' => 'sometimes|required|in:card,bank_transfer,cash,online',
                'transaction_id' => 'nullable|string|max:255',
                'status' => 'sometimes|required|in:pending,approved,failed',
                'notes' => 'nullable|string',
            ]);

            $payment->update($validated);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Payment updated successfully',
                'data' => $payment->load('property:pid,title', 'user:id,name,email'),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Payment Update Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to update payment',
            ], 500);
        }
    }

    /**
     * Mark payment as approved.
     */
    public function approve(string $id)
    {
        try {
            $payment = Payment::findOrFail($id);

            // Check authorization
            if ($payment->user_id !== request()->user()->id && request()->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $payment->markAsApproved();

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Payment approved successfully',
                'data' => $payment->load('property:pid,title', 'user:id,name,email'),
            ]);
        } catch (\Exception $e) {
            Log::error('Payment Approve Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to approve payment',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        try {
            $payment = Payment::findOrFail($id);

            // Check authorization
            if ($payment->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            // Cannot delete approved payments
            if ($payment->status === 'approved') {
                return response()->json([
                    'response_code' => 400,
                    'status' => 'error',
                    'message' => 'Cannot delete approved payment',
                ], 400);
            }

            $payment->delete();

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Payment deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Payment Delete Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to delete payment',
            ], 500);
        }
    }
}
