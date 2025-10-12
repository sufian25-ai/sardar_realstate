<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserOrder;
use App\Models\UserProperty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class UserProfileController extends Controller
{
    /**
     * Get user profile with all related data
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('User not authenticated', 401);
            }

            // Load user with relationships
            $userProfile = User::with([
                'orders.property:pid,title,pimage,price,location',
                'userProperties.property:pid,title,pimage,price,location,bedroom,bathroom,size',
                'inquiries.property:pid,title'
            ])->find($user->id);

            return $this->successResponse('Profile fetched successfully', [
                'user' => $userProfile,
                'stats' => [
                    'total_orders' => $userProfile->orders->count(),
                    'total_properties' => $userProfile->userProperties->count(),
                    'total_inquiries' => $userProfile->inquiries->count(),
                    'pending_orders' => $userProfile->orders->where('status', 'pending')->count(),
                    'completed_orders' => $userProfile->orders->where('status', 'completed')->count(),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Profile Fetch Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to fetch profile', 500);
        }
    }

    /**
     * Update user profile
     */
    public function update(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('User not authenticated', 401);
            }

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'phone' => 'sometimes|nullable|string|max:20',
                'address' => 'sometimes|nullable|string',
                'bio' => 'sometimes|nullable|string',
                'date_of_birth' => 'sometimes|nullable|date',
                'gender' => 'sometimes|nullable|in:male,female,other',
                'occupation' => 'sometimes|nullable|string|max:255',
                'annual_income' => 'sometimes|nullable|numeric|min:0',
            ]);

            $user->update($validated);

            return $this->successResponse('Profile updated successfully', $user->fresh());
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            Log::error('Profile Update Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to update profile', 500);
        }
    }

    /**
     * Get user orders
     */
    public function orders(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('User not authenticated', 401);
            }

            $orders = UserOrder::with('property:pid,title,pimage,price,location')
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return $this->successResponse('Orders fetched successfully', $orders);
        } catch (\Exception $e) {
            Log::error('Orders Fetch Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to fetch orders', 500);
        }
    }

    /**
     * Get user properties
     */
    public function properties(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('User not authenticated', 401);
            }

            $properties = UserProperty::with('property:pid,title,pimage,price,location,bedroom,bathroom,size,type')
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return $this->successResponse('Properties fetched successfully', $properties);
        } catch (\Exception $e) {
            Log::error('Properties Fetch Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to fetch properties', 500);
        }
    }

    /**
     * Create a new order
     */
    public function createOrder(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('User not authenticated', 401);
            }

            $validated = $request->validate([
                'property_id' => 'required|exists:properties,pid',
                'amount' => 'required|numeric|min:0',
                'order_type' => 'required|in:purchase,rent,inquiry',
                'notes' => 'nullable|string',
                'payment_details' => 'nullable|array'
            ]);

            $validated['user_id'] = $user->id;

            $order = UserOrder::create($validated);
            $order->load('property:pid,title,pimage,price,location');

            return $this->successResponse('Order created successfully', $order, 201);
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            Log::error('Order Creation Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to create order', 500);
        }
    }

    /**
     * Add property to user's portfolio
     */
    public function addProperty(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('User not authenticated', 401);
            }

            $validated = $request->validate([
                'property_id' => 'required|exists:properties,pid',
                'ownership_type' => 'required|in:owned,rented,pending,sold',
                'purchase_price' => 'nullable|numeric|min:0',
                'purchase_date' => 'nullable|date',
                'lease_start_date' => 'nullable|date',
                'lease_end_date' => 'nullable|date',
                'monthly_rent' => 'nullable|numeric|min:0',
                'ownership_notes' => 'nullable|string'
            ]);

            $validated['user_id'] = $user->id;

            $userProperty = UserProperty::create($validated);
            $userProperty->load('property:pid,title,pimage,price,location,bedroom,bathroom,size,type');

            return $this->successResponse('Property added successfully', $userProperty, 201);
        } catch (ValidationException $e) {
            return $this->errorResponse('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            Log::error('Property Addition Error: ' . $e->getMessage());
            return $this->errorResponse('Failed to add property', 500);
        }
    }

    // Helper methods
    private function successResponse($message, $data = null, $code = 200)
    {
        return response()->json([
            'response_code' => $code,
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    private function errorResponse($message, $code = 500, $errors = null)
    {
        $response = [
            'response_code' => $code,
            'status' => 'error',
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }
}
