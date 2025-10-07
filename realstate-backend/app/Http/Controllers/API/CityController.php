<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\State;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = City::with('state:sid,sname');

            if ($request->has('state_id')) {
                $query->where('state_id', $request->state_id);
            }

            if ($request->has('active') && $request->active == 'true') {
                $query->active();
            }

            $cities = $query->paginate(10);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'Cities fetched successfully',
                'data' => $cities,
            ]);
        } catch (\Exception $e) {
            Log::error('Cities Fetch Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to fetch cities',
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
                'cname' => 'required|string|max:100',
                'slug' => 'required|string|max:100',
                'state_id' => 'required|exists:states,sid',
                'is_active' => 'boolean',
            ]);

            // Check unique cname within state
            $exists = City::where('cname', $validated['cname'])
                         ->where('state_id', $validated['state_id'])
                         ->exists();

            if ($exists) {
                return response()->json([
                    'response_code' => 422,
                    'status' => 'error',
                    'message' => 'City name already exists in this state',
                ], 422);
            }

            $city = City::create($validated);

            return response()->json([
                'response_code' => 201,
                'status' => 'success',
                'message' => 'City created successfully',
                'data' => $city->load('state:sid,sname'),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('City Create Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to create city',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $city = City::with('state:sid,sname')->findOrFail($id);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'City fetched successfully',
                'data' => $city,
            ]);
        } catch (\Exception $e) {
            Log::error('City Show Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 404,
                'status' => 'error',
                'message' => 'City not found',
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $city = City::findOrFail($id);

            $validated = $request->validate([
                'cname' => 'sometimes|required|string|max:100',
                'slug' => 'sometimes|required|string|max:100',
                'state_id' => 'sometimes|required|exists:states,sid',
                'is_active' => 'boolean',
            ]);

            // Check unique cname within state
            if (isset($validated['cname']) && isset($validated['state_id'])) {
                $exists = City::where('cname', $validated['cname'])
                             ->where('state_id', $validated['state_id'])
                             ->where('cid', '!=', $id)
                             ->exists();

                if ($exists) {
                    return response()->json([
                        'response_code' => 422,
                        'status' => 'error',
                        'message' => 'City name already exists in this state',
                    ], 422);
                }
            }

            $city->update($validated);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'City updated successfully',
                'data' => $city->load('state:sid,sname'),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('City Update Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to update city',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $city = City::findOrFail($id);

            // Check if city has properties
            if ($city->properties()->count() > 0) {
                return response()->json([
                    'response_code' => 400,
                    'status' => 'error',
                    'message' => 'Cannot delete city with associated properties',
                ], 400);
            }

            $city->delete();

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'City deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('City Delete Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to delete city',
            ], 500);
        }
    }
}
