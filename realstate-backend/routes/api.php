<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthenticationController;
use App\Http\Controllers\API\InquiryController;

// Public routes (no authentication required)
Route::post('register', [AuthenticationController::class, 'register'])->name('api.register');
Route::post('login', [AuthenticationController::class, 'login'])->name('api.login');

// Public Inquiry Route - যাতে login ছাড়াই inquiry পাঠানো যায়
Route::post('inquiries', [InquiryController::class, 'store'])->name('api.inquiries.store');

// Test route to check API is working
Route::get('test', function() {
    return response()->json([
        'status' => 'success',
        'message' => 'API is working',
        'timestamp' => now()
    ]);
});

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {

    // Auth routes
    Route::get('me', [AuthenticationController::class, 'me'])->name('api.me');
    Route::get('get-user', [AuthenticationController::class, 'userInfo'])->name('api.get-user');
    Route::post('logout', [AuthenticationController::class, 'logOut'])->name('api.logout');

    // States
    Route::apiResource('states', App\Http\Controllers\API\StateController::class);

    // Cities
    Route::apiResource('cities', App\Http\Controllers\API\CityController::class);

    // Properties
    Route::apiResource('properties', App\Http\Controllers\API\PropertyController::class);

    // Rent Applications
    Route::apiResource('rents', App\Http\Controllers\API\RentController::class);
    Route::post('rents/{id}/approve', [App\Http\Controllers\API\RentController::class, 'approve'])->name('api.rents.approve');

    // Payments
    Route::apiResource('payments', App\Http\Controllers\API\PaymentController::class);
    Route::post('payments/{id}/approve', [App\Http\Controllers\API\PaymentController::class, 'approve'])->name('api.payments.approve');

    // Rent Payments
    Route::apiResource('rent-payments', App\Http\Controllers\API\RentPaymentController::class);
    Route::post('rent-payments/{id}/mark-paid', [App\Http\Controllers\API\RentPaymentController::class, 'markAsPaid'])->name('api.rent-payments.mark-paid');

    // Feedback
    Route::apiResource('feedbacks', App\Http\Controllers\API\FeedbackController::class);
    Route::post('feedbacks/{id}/approve', [App\Http\Controllers\API\FeedbackController::class, 'approve'])->name('api.feedbacks.approve');
    Route::post('feedbacks/{id}/feature', [App\Http\Controllers\API\FeedbackController::class, 'feature'])->name('api.feedbacks.feature');

    // Financial Reports
    Route::apiResource('financial-reports', App\Http\Controllers\API\FinancialReportController::class);

    // Inquiries (Protected - for Admin/Agent)
    Route::get('inquiries', [InquiryController::class, 'index'])->name('api.inquiries.index');
    Route::get('inquiries/{id}', [InquiryController::class, 'show'])->name('api.inquiries.show');
    Route::put('inquiries/{id}', [InquiryController::class, 'update'])->name('api.inquiries.update');
    Route::delete('inquiries/{id}', [InquiryController::class, 'destroy'])->name('api.inquiries.destroy');

    // User Profile Management
    Route::get('profile', [App\Http\Controllers\API\UserProfileController::class, 'index'])->name('api.profile.index');
    Route::put('profile', [App\Http\Controllers\API\UserProfileController::class, 'update'])->name('api.profile.update');
    Route::get('profile/orders', [App\Http\Controllers\API\UserProfileController::class, 'orders'])->name('api.profile.orders');
    Route::get('profile/properties', [App\Http\Controllers\API\UserProfileController::class, 'properties'])->name('api.profile.properties');
    Route::post('profile/orders', [App\Http\Controllers\API\UserProfileController::class, 'createOrder'])->name('api.profile.orders.create');
    Route::post('profile/properties', [App\Http\Controllers\API\UserProfileController::class, 'addProperty'])->name('api.profile.properties.add');

    // Property Payment Management
    Route::get('properties/{propertyId}/payment-details', [App\Http\Controllers\API\PaymentController::class, 'getPropertyPaymentDetails'])->name('api.properties.payment-details');
    Route::post('properties/{propertyId}/payment', [App\Http\Controllers\API\PaymentController::class, 'processPropertyPayment'])->name('api.properties.payment');
    
    // Payment Management
    Route::apiResource('payments', App\Http\Controllers\API\PaymentController::class);
    Route::post('payments/{id}/approve', [App\Http\Controllers\API\PaymentController::class, 'approve'])->name('api.payments.approve');
});
