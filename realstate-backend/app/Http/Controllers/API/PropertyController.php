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
            $query = Property::with('user:id,name,email', 'city:cid,cname', 'state:sid,sname');

            // Filters
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            if ($request->has('stype')) {
                $query->where('stype', $request->stype);
            }

            if ($request->has('city_id')) {
                $query->where('city_id', $request->city_id);
            }

            if ($request->has('state_id')) {
                $query->where('state_id', $request->state_id);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('featured') && $request->featured == 'true') {
                $query->featured();
            }

            if ($request->has('verified') && $request->verified == 'true') {
                $query->verified();
            }

            // Price range
            if ($request->has('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }

            if ($request->has('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }

            // Bedrooms
            if ($request->has('bedroom')) {
                $query->where('bedroom', $request->bedroom);
            }

            $properties = $query->paginate(10);

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
                'slug' => 'required|string|max:100|unique:properties',
                'pcontent' => 'required|string',
                'type' => 'required|in:apartment,house,land,commercial',
                'stype' => 'required|in:sale,rent',
                'bedroom' => 'nullable|integer|min:0',
                'bathroom' => 'nullable|integer|min:0',
                'balcony' => 'nullable|integer|min:0',
                'kitchen' => 'nullable|integer|min:0',
                'drawing_room' => 'nullable|integer|min:0',
                'dining_room' => 'nullable|integer|min:0',
                'floor' => 'nullable|string|max:50',
                'size' => 'nullable|numeric|min:0',
                'price' => 'required|numeric|min:0',
                'location' => 'required|string|max:255',
                'city_id' => 'required|exists:cities,cid',
                'state_id' => 'required|exists:states,sid',
                'feature' => 'nullable|string',
                'pimage' => 'nullable|string|max:255',
                'pimage1' => 'nullable|string|max:255',
                'pimage2' => 'nullable|string|max:255',
                'pimage3' => 'nullable|string|max:255',
                'pimage4' => 'nullable|string|max:255',
                'status' => 'in:available,sold,rented',
                'mapimage' => 'nullable|string|max:255',
                'topmapimage' => 'nullable|string|max:255',
                'groundmapimage' => 'nullable|string|max:255',
                'totalfloor' => 'nullable|integer|min:0',
                'featured' => 'boolean',
                'verified' => 'boolean',
                'date' => 'nullable|date',
            ]);

            $validated['user_id'] = $request->user()->id;

            $property = Property::create($validated);

            return response()->json([
                'response_code' => 201,
                'status' => 'success',
                'message' => 'Property created successfully',
                'data' => $property->load('user:id,name,email', 'city:cid,cname', 'state:sid,sname'),
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
            $property = Property::with('user:id,name,email', 'city:cid,cname', 'state:sid,sname')->findOrFail($id);

            // Increment view count
            $property->incrementViewCount();

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

            // Check authorization - only owner or admin can update
            if ($property->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'slug' => 'sometimes|required|string|max:100|unique:properties,slug,' . $id . ',pid',
                'pcontent' => 'sometimes|required|string',
                'type' => 'sometimes|required|in:apartment,house,land,commercial',
                'stype' => 'sometimes|required|in:sale,rent',
                'bedroom' => 'nullable|integer|min:0',
                'bathroom' => 'nullable|integer|min:0',
                'balcony' => 'nullable|integer|min:0',
                'kitchen' => 'nullable|integer|min:0',
                'drawing_room' => 'nullable|integer|min:0',
                'dining_room' => 'nullable|integer|min:0',
                'floor' => 'nullable|string|max:50',
                'size' => 'nullable|numeric|min:0',
                'price' => 'sometimes|required|numeric|min:0',
                'location' => 'sometimes|required|string|max:255',
                'city_id' => 'sometimes|required|exists:cities,cid',
                'state_id' => 'sometimes|required|exists:states,sid',
                'feature' => 'nullable|string',
                'pimage' => 'nullable|string|max:255',
                'pimage1' => 'nullable|string|max:255',
                'pimage2' => 'nullable|string|max:255',
                'pimage3' => 'nullable|string|max:255',
                'pimage4' => 'nullable|string|max:255',
                'status' => 'in:available,sold,rented',
                'mapimage' => 'nullable|string|max:255',
                'topmapimage' => 'nullable|string|max:255',
                'groundmapimage' => 'nullable|string|max:255',
                'totalfloor' => 'nullable|integer|min:0',
                'featured' => 'boolean',
                'verified' => 'boolean',
                'date' => 'nullable|date',
            ]);

            $property->update($validated);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Property updated successfully',
                'data' => $property->load('user:id,name,email', 'city:cid,cname', 'state:sid,sname'),
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

            // Check authorization - only owner or admin can delete
            if ($property->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
                return response()->json([
                    'response_code' => 403,
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ], 403);
            }

            // Check if property has active rents or payments
            if ($property->rentApplications()->where('status', 'approved')->count() > 0) {
                return response()->json([
                    'response_code' => 400,
                    'status' => 'error',
                    'message' => 'Cannot delete property with active rentals',
                ], 400);
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
