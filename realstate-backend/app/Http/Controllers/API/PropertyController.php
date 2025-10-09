<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource with filters.
     */
    public function index(Request $request)
    {
        try {
            $query = Property::with(['user:id,name,email', 'city:cid,cname', 'state:sid,sname']);
            $this->applyFilters($query, $request);

            $properties = $query->paginate(10);

            return $this->successResponse('Properties fetched successfully', $properties);
        } catch (\Exception $e) {
            Log::error('Properties Fetch Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to fetch properties', 500);
        }
    }

    /**
     * Store a newly created resource with file uploads.
     */
    public function store(Request $request)
    {
        try {
            $validated = $this->validateProperty($request);
            $fileData = [];

            // Handle file uploads
            foreach (['pimage','pimage1','pimage2','pimage3','pimage4','mapimage','groundmapimage'] as $fileField) {
                if ($request->hasFile($fileField)) {
                    $file = $request->file($fileField);

                    $destinationPath = public_path('properties');

                    if (!File::exists($destinationPath)) {
                        File::makeDirectory($destinationPath, 0777, true, true);
                    }

                    $filename = time() . '_' . $file->getClientOriginalName();
                    $file->move($destinationPath, $filename);

                    $fileData[$fileField] = 'properties/' . $filename;
                }
            }

            $validated = array_merge($validated, $fileData);

            if (!isset($validated['user_id'])) {
                $validated['user_id'] = auth()->id();
            }

            $validated['slug'] = $this->generateUniqueSlug($validated['title'], $validated['slug'] ?? null);

            $property = Property::create($validated);

            return $this->successResponse(
                'Property created successfully',
                $property->load(['user:id,name,email', 'city:cid,cname', 'state:sid,sname']),
                201
            );
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            Log::error('Property Create Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to create property', 500);
        }
    }

    /**
     * Display a single property.
     */
    public function show(string $id)
    {
        try {
            $property = Property::with(['user:id,name,email', 'city:cid,cname', 'state:sid,sname'])->findOrFail($id);
            $property->incrementViewCount();

            return $this->successResponse('Property fetched successfully', $property);
        } catch (\Exception $e) {
            Log::error('Property Show Error: ' . $e->getMessage());
            return $this->errorResponse('Property not found', 404);
        }
    }

    /**
     * Update a property.
     */
    public function update(Request $request, string $id)
    {
        try {
            $property = Property::findOrFail($id);
            $validated = $this->validateProperty($request, $id);
            $fileData = [];

            foreach (['pimage','pimage1','pimage2','pimage3','pimage4','mapimage','groundmapimage'] as $fileField) {
                if ($request->hasFile($fileField)) {
                    $file = $request->file($fileField);

                    $destinationPath = public_path('properties');

                    if (!File::exists($destinationPath)) {
                        File::makeDirectory($destinationPath, 0777, true, true);
                    }

                    $filename = time() . '_' . $file->getClientOriginalName();
                    $file->move($destinationPath, $filename);

                    $fileData[$fileField] = 'properties/' . $filename;
                }
            }

            $validated = array_merge($validated, $fileData);

            if (isset($validated['title']) || isset($validated['slug'])) {
                $validated['slug'] = $this->generateUniqueSlug(
                    $validated['title'] ?? $property->title,
                    $validated['slug'] ?? null,
                    $id
                );
            }

            $property->update($validated);

            return $this->successResponse(
                'Property updated successfully',
                $property->load(['user:id,name,email', 'city:cid,cname', 'state:sid,sname'])
            );
        } catch (ValidationException $e) {
            return $this->validationErrorResponse($e);
        } catch (\Exception $e) {
            Log::error('Property Update Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to update property', 500);
        }
    }

    /**
     * Delete a property.
     */
    public function destroy(string $id)
    {
        try {
            $property = Property::findOrFail($id);

            if ($property->rentApplications()->count() > 0 || $property->payments()->count() > 0) {
                return $this->errorResponse('Cannot delete property with associated rent applications or payments', 400);
            }

            $property->delete();

            return $this->successResponse('Property deleted successfully', null);
        } catch (\Exception $e) {
            Log::error('Property Delete Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to delete property', 500);
        }
    }

    // ------------------------ Private Helpers ------------------------

    private function applyFilters($query, Request $request)
    {
        if ($request->has('type')) $query->byType($request->type);
        if ($request->has('stype')) $query->{$request->stype === 'sale' ? 'forSale' : 'forRent'}();
        if ($request->has('city_id')) $query->byCity($request->city_id);
        if ($request->has('state_id')) $query->byState($request->state_id);
        if ($request->has('status')) $query->where('status', $request->status);
        if ($request->has('featured') && $request->featured == 'true') $query->featured();
        if ($request->has('verified') && $request->verified == 'true') $query->verified();
        if ($request->has('min_price') && $request->has('max_price')) $query->priceRange($request->min_price, $request->max_price);
        if ($request->has('user_id')) $query->where('user_id', $request->user_id);
    }

    private function validateProperty(Request $request, $id = null)
    {
        $rules = [
            'title' => ($id ? 'sometimes|required' : 'required') . '|string|max:200',
            'slug' => ($id ? 'sometimes|required|unique:properties,slug,' . $id . ',pid' : 'nullable|string|max:220'),
            'pcontent' => ($id ? 'sometimes|required' : 'required') . '|string',
            'type' => ($id ? 'sometimes|required' : 'required') . '|string|max:100',
            'stype' => ($id ? 'sometimes|required' : 'required') . '|in:sale,rent',
            'bedroom' => 'nullable|integer|min:0',
            'bathroom' => 'nullable|integer|min:0',
            'balcony' => 'nullable|integer|min:0',
            'kitchen' => 'nullable|integer|min:0',
            'drawing_room' => 'nullable|integer|min:0',
            'dining_room' => 'nullable|integer|min:0',
            'floor' => 'nullable|string|max:50',
            'totalfloor' => 'nullable|integer|min:0',
            'size' => 'nullable|integer|min:0',
            'price' => ($id ? 'sometimes|required' : 'required') . '|numeric|min:0',
            'location' => ($id ? 'sometimes|required' : 'required') . '|string',
            'city_id' => ($id ? 'sometimes|required' : 'required') . '|exists:cities,cid',
            'state_id' => ($id ? 'sometimes|required' : 'required') . '|exists:states,sid',
            'feature' => 'nullable|string',
            'pimage' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'pimage1' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'pimage2' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'pimage3' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'pimage4' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'mapimage' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'groundmapimage' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'user_id' => 'nullable|exists:users,id',
            'status' => 'in:available,sold,rented,pending',
            'featured' => 'boolean',
            'verified' => 'boolean',
        ];

        return $request->validate($rules);
    }

    private function generateUniqueSlug($title, $slug = null, $id = null)
    {
        $slug = $slug ? Str::slug($slug) : Str::slug($title) . '-' . time();
        $originalSlug = $slug;
        $count = 1;

        while (Property::where('slug', $slug)->when($id, fn($q) => $q->where('pid', '!=', $id))->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $slug;
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
