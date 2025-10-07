<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Feedback::with('user:id,name,email', 'property:pid,title', 'approvedBy:id,name,email');

            // Filters
            if ($request->has('property_id')) {
                $query->where('property_id', $request->property_id);
            }

            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->has('rating')) {
                $query->where('rating', $request->rating);
            }

            if ($request->has('approved')) {
                $approved = $request->approved === 'true';
                $query->where('is_approved', $approved);
            }

            if ($request->has('featured')) {
                $featured = $request->featured === 'true';
                $query->where('is_featured', $featured);
            }

            if ($request->has('verified')) {
                $verified = $request->verified === 'true';
                $query->where('is_verified', $verified);
            }

            // For non-admin users, only show approved feedback
            if ($request->user()->role !== 'admin') {
                $query->approved();
            }

            $feedbacks = $query->paginate(10);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Feedbacks fetched successfully',
                'data' => $feedbacks,
            ]);
        } catch (\Exception $e) {
            Log::error('Feedbacks Fetch Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to fetch feedbacks',
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
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'required|string|max:1000',
                'pros' => 'nullable|string|max:500',
                'cons' => 'nullable|string|max:500',
                'recommend' => 'boolean',
                'anonymous' => 'boolean',
            ]);

            $property = Property::findOrFail($validated['property_id']);

            // Check if user already submitted feedback for this property
            $existing = Feedback::where('property_id', $validated['property_id'])
                               ->where('user_id', $request->user()->id)
                               ->exists();

            if ($existing) {
                return response()->json([
                    'response_code' => 400,
                    'status' => 'error',
                    'message' => 'You have already submitted feedback for this property',
                ], 400);
            }

            $validated['user_id'] = $request->user()->id;

            $feedback = Feedback::create($validated);

            return response()->json([
                'response_code' => 201,
                'status' => 'success',
                'message' => 'Feedback submitted successfully',
                'data' => $feedback->load('user:id,name,email', 'property:pid,title'),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Feedback Create Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to submit feedback',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $feedback = Feedback::with('user:id,name,email', 'property:pid,title,location', 'approvedBy:id,name,email')->findOrFail($id);

            // For non-admin users, only show approved feedback
            if ($feedback->user_id !== request()->user()->id &&
                request()->user()->role !== 'admin' &&
                !$feedback->is_approved) {
                return response()->json([
                    'response_code' => 404,
                    'status' => 'error',
                    'message' => 'Feedback not found',
                ], 404);
            }

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Feedback fetched successfully',
                'data' => $feedback,
            ]);
        } catch (\Exception $e) {
            Log::error('Feedback Show Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 404,
                'status' => 'error',
                'message' => 'Feedback not found',
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $feedback = Feedback::findOrFail($id);

            // Only feedback author can update
            if ($feedback->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $validated = $request->validate([
                'rating' => 'sometimes|required|integer|min:1|max:5',
                'comment' => 'sometimes|required|string|max:1000',
                'pros' => 'nullable|string|max:500',
                'cons' => 'nullable|string|max:500',
                'recommend' => 'boolean',
                'anonymous' => 'boolean',
            ]);

            $feedback->update($validated);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Feedback updated successfully',
                'data' => $feedback->load('user:id,name,email', 'property:pid,title'),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Feedback Update Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to update feedback',
            ], 500);
        }
    }

    /**
     * Approve feedback.
     */
    public function approve(string $id)
    {
        try {
            $feedback = Feedback::findOrFail($id);

            // Only admin can approve
            if (request()->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $feedback->approve(request()->user()->id);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Feedback approved successfully',
                'data' => $feedback->load('user:id,name,email', 'property:pid,title', 'approvedBy:id,name,email'),
            ]);
        } catch (\Exception $e) {
            Log::error('Feedback Approve Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to approve feedback',
            ], 500);
        }
    }

    /**
     * Feature feedback.
     */
    public function feature(string $id)
    {
        try {
            $feedback = Feedback::findOrFail($id);

            // Only admin can feature
            if (request()->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $feedback->feature();

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Feedback featured successfully',
                'data' => $feedback->load('user:id,name,email', 'property:pid,title'),
            ]);
        } catch (\Exception $e) {
            Log::error('Feedback Feature Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to feature feedback',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        try {
            $feedback = Feedback::findOrFail($id);

            // Only feedback author or admin can delete
            if ($feedback->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $feedback->delete();

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Feedback deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Feedback Delete Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to delete feedback',
            ], 500);
        }
    }
}
