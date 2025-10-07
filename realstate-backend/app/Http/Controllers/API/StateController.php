<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\State;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class StateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = State::query();

            if ($request->has('active') && $request->active == 'true') {
                $query->active();
            }

            $states = $query->paginate(10);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'States fetched successfully',
                'data' => $states,
            ]);
        } catch (\Exception $e) {
            Log::error('States Fetch Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to fetch states',
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
                'sname' => 'required|string|max:100|unique:states',
                'slug' => 'required|string|max:100|unique:states',
                'is_active' => 'boolean',
            ]);

            $state = State::create($validated);

            return response()->json([
                'response_code' => 201,
                'status' => 'success',
                'message' => 'State created successfully',
                'data' => $state,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('State Create Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to create state',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $state = State::with('cities')->findOrFail($id);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'State fetched successfully',
                'data' => $state,
            ]);
        } catch (\Exception $e) {
            Log::error('State Show Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 404,
                'status' => 'error',
                'message' => 'State not found',
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $state = State::findOrFail($id);

            $validated = $request->validate([
                'sname' => 'sometimes|required|string|max:100|unique:states,sname,' . $id . ',sid',
                'slug' => 'sometimes|required|string|max:100|unique:states,slug,' . $id . ',sid',
                'is_active' => 'boolean',
            ]);

            $state->update($validated);

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'State updated successfully',
                'data' => $state,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('State Update Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to update state',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $state = State::findOrFail($id);

            // Check if state has cities
            if ($state->cities()->count() > 0) {
                return response()->json([
                    'response_code' => 400,
                    'status' => 'error',
                    'message' => 'Cannot delete state with associated cities',
                ], 400);
            }

            $state->delete();

            return response()->json([
                'response_code' => 200,
                'status' => 'success',
                'message' => 'State deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('State Delete Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status' => 'error',
                'message' => 'Failed to delete state',
            ], 500);
        }
    }
}
