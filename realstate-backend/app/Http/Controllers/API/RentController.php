<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Rent;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class RentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Rent::with('property:pid,title,location', 'user:id,name,email', 'applicant:id,name,email');

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

            if ($request->has('applicant_id')) {
                $query->where('applicant_id', $request->applicant_id);
            }

            // For non-admin users, only show their own applications
            if ($request->user()->role !== 'admin') {
                $query->where(function ($q) use ($request) {
                    $q->where('user_id', $request->user()->id)
                      ->orWhere('applicant_id', $request->user()->id);
                });
            }

            $rents = $query->paginate(10);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Rent applications fetched successfully',
                'data' => $rents,
            ]);
        } catch (\Exception $e) {
            Log::error('Rent Applications Fetch Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to fetch rent applications',
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
                'monthly_rent' => 'required|numeric|min:0',
                'security_deposit' => 'required|numeric|min:0',
                'lease_duration' => 'required|integer|min:1',
                'start_date' => 'required|date|after:today',
                'end_date' => 'required|date|after:start_date',
                'additional_terms' => 'nullable|string',
            ]);

            $property = Property::findOrFail($validated['property_id']);

            // Check if property is available for rent
            if (!$property->isAvailable()) {
                return response()->json([
                    'response_code' => 400,
                    'status' => 'error',
                    'message' => 'Property is not available for rent',
                ], 400);
            }

            // Check if user already has a pending application for this property
            $existing = Rent::where('property_id', $validated['property_id'])
                           ->where('applicant_id', $request->user()->id)
                           ->whereIn('status', ['pending', 'approved'])
                           ->exists();

            if ($existing) {
                return response()->json([
                    'response_code' => 400,
                    'status' => 'error',
                    'message' => 'You already have a pending or approved application for this property',
                ], 400);
            }

            $validated['user_id'] = $property->user_id; // Property owner
            $validated['applicant_id'] = $request->user()->id;

            $rent = Rent::create($validated);

            return response()->json([
                'response_code' => 201,
                'status' => 'success',
                'message' => 'Rent application submitted successfully',
                'data' => $rent->load('property:pid,title,location', 'user:id,name,email'),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Rent Application Create Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to submit rent application',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $rent = Rent::with('property', 'user:id,name,email', 'applicant:id,name,email', 'payments')->findOrFail($id);

            // Check authorization
            if ($rent->user_id !== request()->user()->id &&
                $rent->applicant_id !== request()->user()->id &&
                request()->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Rent application fetched successfully',
                'data' => $rent,
            ]);
        } catch (\Exception $e) {
            Log::error('Rent Application Show Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 404,
                'status' => 'error',
                'message' => 'Rent application not found',
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $rent = Rent::findOrFail($id);

            // Only property owner or admin can update
            if ($rent->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $validated = $request->validate([
                'status' => 'sometimes|required|in:pending,approved,rejected',
                'monthly_rent' => 'sometimes|required|numeric|min:0',
                'security_deposit' => 'sometimes|required|numeric|min:0',
                'lease_duration' => 'sometimes|required|integer|min:1',
                'start_date' => 'sometimes|required|date',
                'end_date' => 'sometimes|required|date|after:start_date',
                'additional_terms' => 'nullable|string',
            ]);

            $rent->update($validated);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Rent application updated successfully',
                'data' => $rent->load('property:pid,title,location', 'user:id,name,email', 'applicant:id,name,email'),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Rent Application Update Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to update rent application',
            ], 500);
        }
    }

    /**
     * Approve rent application.
     */
    public function approve(string $id)
    {
        try {
            $rent = Rent::findOrFail($id);

            // Only property owner or admin can approve
            if ($rent->user_id !== request()->user()->id && request()->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $rent->approve();

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Rent application approved successfully',
                'data' => $rent->load('property', 'user:id,name,email', 'applicant:id,name,email'),
            ]);
        } catch (\Exception $e) {
            Log::error('Rent Application Approve Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to approve rent application',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        try {
            $rent = Rent::findOrFail($id);

            // Only applicant or admin can delete pending applications
            if ($rent->applicant_id !== $request->user()->id && $request->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            // Cannot delete approved applications
            if ($rent->status === 'approved') {
                return response()->json([
                    'response_code' => 400,
                    'status' => 'error',
                    'message' => 'Cannot delete approved rent application',
                ], 400);
            }

            $rent->delete();

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Rent application deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Rent Application Delete Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to delete rent application',
            ], 500);
        }
    }
}
