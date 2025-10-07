<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\RentPayment;
use App\Models\Rent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class RentPaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = RentPayment::with('rent.property:pid,title', 'user:id,name,email');

            // Filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('rent_id')) {
                $query->where('rent_id', $request->rent_id);
            }

            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->has('month')) {
                $query->where('month', $request->month);
            }

            if ($request->has('year')) {
                $query->where('year', $request->year);
            }

            // For non-admin users, only show their own payments
            if ($request->user()->role !== 'admin') {
                $query->where('user_id', $request->user()->id);
            }

            $rentPayments = $query->paginate(10);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Rent payments fetched successfully',
                'data' => $rentPayments,
            ]);
        } catch (\Exception $e) {
            Log::error('Rent Payments Fetch Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to fetch rent payments',
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
                'rent_id' => 'required|exists:rents,rid',
                'amount' => 'required|numeric|min:0.01',
                'month' => 'required|integer|min:1|max:12',
                'year' => 'required|integer|min:2020|max:' . (date('Y') + 10),
                'due_date' => 'required|date',
                'payment_method' => 'required|in:card,bank_transfer,cash,online',
                'transaction_id' => 'nullable|string|max:255',
                'notes' => 'nullable|string',
            ]);

            $rent = Rent::findOrFail($validated['rent_id']);

            // Check authorization - only tenant or admin can create payment records
            if ($rent->applicant_id !== $request->user()->id && $request->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            // Check if payment for this month/year already exists
            $existing = RentPayment::where('rent_id', $validated['rent_id'])
                                  ->where('month', $validated['month'])
                                  ->where('year', $validated['year'])
                                  ->exists();

            if ($existing) {
                return response()->json([
                    'response_code' => 400,
                    'status' => 'error',
                    'message' => 'Payment for this month already exists',
                ], 400);
            }

            $validated['user_id'] = $rent->applicant_id;
            $validated['property_id'] = $rent->property_id;

            $rentPayment = RentPayment::create($validated);

            return response()->json([
                'response_code' => 201,
                'status' => 'success',
                'message' => 'Rent payment record created successfully',
                'data' => $rentPayment->load('rent.property:pid,title', 'user:id,name,email'),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Rent Payment Create Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to create rent payment record',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $rentPayment = RentPayment::with('rent.property:pid,title,location', 'user:id,name,email')->findOrFail($id);

            // Check authorization
            if ($rentPayment->user_id !== request()->user()->id && request()->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Rent payment fetched successfully',
                'data' => $rentPayment,
            ]);
        } catch (\Exception $e) {
            Log::error('Rent Payment Show Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 404,
                'status' => 'error',
                'message' => 'Rent payment not found',
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $rentPayment = RentPayment::findOrFail($id);

            // Check authorization
            if ($rentPayment->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $validated = $request->validate([
                'amount' => 'sometimes|required|numeric|min:0.01',
                'due_date' => 'sometimes|required|date',
                'payment_method' => 'sometimes|required|in:card,bank_transfer,cash,online',
                'transaction_id' => 'nullable|string|max:255',
                'status' => 'sometimes|required|in:paid,pending,overdue',
                'notes' => 'nullable|string',
            ]);

            $rentPayment->update($validated);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Rent payment updated successfully',
                'data' => $rentPayment->load('rent.property:pid,title', 'user:id,name,email'),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Rent Payment Update Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to update rent payment',
            ], 500);
        }
    }

    /**
     * Mark rent payment as paid.
     */
    public function markAsPaid(string $id)
    {
        try {
            $rentPayment = RentPayment::findOrFail($id);

            // Check authorization
            if ($rentPayment->user_id !== request()->user()->id && request()->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $rentPayment->markAsPaid();

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Rent payment marked as paid successfully',
                'data' => $rentPayment->load('rent.property:pid,title', 'user:id,name,email'),
            ]);
        } catch (\Exception $e) {
            Log::error('Rent Payment Mark Paid Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to mark rent payment as paid',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        try {
            $rentPayment = RentPayment::findOrFail($id);

            // Check authorization
            if ($rentPayment->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            // Cannot delete paid payments
            if ($rentPayment->status === 'paid') {
                return response()->json([
                    'response_code' => 400,
                    'status' => 'error',
                    'message' => 'Cannot delete paid rent payment',
                ], 400);
            }

            $rentPayment->delete();

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Rent payment deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Rent Payment Delete Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to delete rent payment',
            ], 500);
        }
    }
}
