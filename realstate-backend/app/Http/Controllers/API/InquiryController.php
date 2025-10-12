<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class InquiryController extends Controller
{
    /**
     * Display a listing of the resource with filters.
     */
    public function index(Request $request)
    {
        try {
            $user = auth()->user();
            $query = Inquiry::with(['property:pid,title,uid']);

            // If user is agent, only show inquiries for their properties
            if ($user && $user->utype === 'agent') {
                $query->whereHas('property', function($q) use ($user) {
                    $q->where('uid', $user->uid);
                });
            }

            $this->applyFilters($query, $request);

            $inquiries = $query->latest()->paginate(50);

            return $this->successResponse('Inquiries fetched successfully', $inquiries);
        } catch (\Exception $e) {
            Log::error('Inquiries Fetch Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to fetch inquiries', 500);
        }
    }

    /**
     * Store a newly created resource - PUBLIC ACCESS
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:20',
                'property_id' => 'nullable|exists:properties,pid',
                'message' => 'nullable|string',
                'status' => 'in:new,reviewed,converted',
            ]);

            // Default status to 'new' if not provided
            if (!isset($validated['status'])) {
                $validated['status'] = 'new';
            }

            $inquiry = Inquiry::create($validated);

            return response()->json([
                'response_code' => 201,
                'status' => 'success',
                'message' => 'Inquiry created successfully',
                'data' => $inquiry,
            ], 201)->withHeaders([
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization',
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422)->withHeaders([
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization',
            ]);
        } catch (\Exception $e) {
            Log::error('Inquiry Create Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to create inquiry',
                'error' => $e->getMessage()
            ], 500)->withHeaders([
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization',
            ]);
        }
    }

    /**
     * Display a single inquiry.
     */
    public function show(string $id)
    {
        try {
            $inquiry = Inquiry::with(['property:id,title'])->findOrFail($id);

            return $this->successResponse('Inquiry fetched successfully', $inquiry);
        } catch (\Exception $e) {
            Log::error('Inquiry Show Error: ' . $e->getMessage());
            return $this->errorResponse('Inquiry not found', 404);
        }
    }

    /**
     * Update an inquiry.
     */
    public function update(Request $request, string $id)
    {
        try {
            $inquiry = Inquiry::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:20',
                'property_id' => 'nullable|exists:properties,pid',
                'message' => 'nullable|string',
                'status' => 'in:new,reviewed,converted',
            ]);

            $inquiry->update($validated);

            return $this->successResponse(
                'Inquiry updated successfully',
                $inquiry->load(['property:id,title'])
            );
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            Log::error('Inquiry Update Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to update inquiry', 500);
        }
    }

    /**
     * Delete an inquiry.
     */
    public function destroy(string $id)
    {
        try {
            $inquiry = Inquiry::findOrFail($id);
            $inquiry->delete();

            return $this->successResponse('Inquiry deleted successfully', null);
        } catch (\Exception $e) {
            Log::error('Inquiry Delete Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to delete inquiry', 500);
        }
    }

    // ------------------------ Private Helpers ------------------------

    private function applyFilters($query, Request $request)
    {
        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        if ($request->has('property_id') && !empty($request->property_id)) {
            $query->where('property_id', $request->property_id);
        }

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%")
                  ->orWhereHas('property', function($propertyQuery) use ($search) {
                      $propertyQuery->where('title', 'like', "%{$search}%");
                  });
            });
        }
    }

    private function successResponse($message, $data = null, $code = 200)
    {
        return response()->json([
            'response_code' => $code,
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    private function errorResponse($message, $code = 500)
    {
        return response()->json([
            'response_code' => $code,
            'status' => 'error',
            'message' => $message,
        ], $code);
    }

    private function validationErrorResponse(ValidationException $e)
    {
        return response()->json([
            'response_code' => 422,
            'status' => 'error',
            'message' => 'Validation failed',
            'errors' => $e->errors(),
        ], 422);
    }
}
