<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $properties = Property::with('user:id,name,email')->paginate(10);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Properties fetched successfully',
                'data' => $properties,
            ]);
        } catch (\Exception $e) {
            Log::error('Properties Fetch Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to fetch properties',
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
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'location' => 'required|string|max:255',
                'bedrooms' => 'nullable|integer|min:0',
                'bathrooms' => 'nullable|integer|min:0',
                'area' => 'nullable|numeric|min:0',
                'type' => 'required|in:sale,rent',
                'images' => 'nullable|array',
                'images.*' => 'url',
            ]);

            $validated['user_id'] = $request->user()->id;

            $property = Property::create($validated);

            return response()->json([
                'response_code' => 201,
                'status' => 'success',
                'message' => 'Property created successfully',
                'data' => $property,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Property Create Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to create property',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $property = Property::with('user:id,name,email')->findOrFail($id);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Property fetched successfully',
                'data' => $property,
            ]);
        } catch (\Exception $e) {
            Log::error('Property Show Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 404,
                'status' => 'error',
                'message' => 'Property not found',
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $property = Property::findOrFail($id);

            if ($property->user_id !== $request->user()->id) {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'price' => 'sometimes|required|numeric|min:0',
                'location' => 'sometimes|required|string|max:255',
                'bedrooms' => 'nullable|integer|min:0',
                'bathrooms' => 'nullable|integer|min:0',
                'area' => 'nullable|numeric|min:0',
                'type' => 'sometimes|required|in:sale,rent',
                'images' => 'nullable|array',
                'images.*' => 'url',
            ]);

            $property->update($validated);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Property updated successfully',
                'data' => $property,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Property Update Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to update property',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        try {
            $property = Property::findOrFail($id);

            if ($property->user_id !== $request->user()->id) {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $property->delete();

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Property deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Property Delete Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to delete property',
            ], 500);
        }
    }
}
