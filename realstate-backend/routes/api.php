
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthenticationController;

// Public routes (no authentication required)
Route::post('register', [AuthenticationController::class, 'register'])->name('api.register');
Route::post('login', [AuthenticationController::class, 'login'])->name('api.login');

// Test route to check API is working
Route::get('test', function() {
    return response()->json([
        'status' => 'success',
        'message' => 'API is working',
        'timestamp' => now()
    ]);
});

// Public routes (for homepage)
Route::get('properties', [App\Http\Controllers\API\PropertyController::class, 'index'])->name('api.properties.index');
Route::get('properties/{id}', [App\Http\Controllers\API\PropertyController::class, 'show'])->name('api.properties.show');
Route::get('states', [App\Http\Controllers\API\StateController::class, 'index'])->name('api.states.index.public');
Route::get('cities', [App\Http\Controllers\API\CityController::class, 'index'])->name('api.cities.index.public');

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {

    // Auth routes
    Route::get('me', [AuthenticationController::class, 'me'])->name('api.me');
    Route::get('get-user', [AuthenticationController::class, 'userInfo'])->name('api.get-user');
    Route::post('logout', [AuthenticationController::class, 'logOut'])->name('api.logout');

    // States (admin only)
    Route::post('states', [App\Http\Controllers\API\StateController::class, 'store'])->name('api.states.store');
    Route::put('states/{id}', [App\Http\Controllers\API\StateController::class, 'update'])->name('api.states.update');
    Route::delete('states/{id}', [App\Http\Controllers\API\StateController::class, 'destroy'])->name('api.states.destroy');

    // Cities (admin only)
    Route::post('cities', [App\Http\Controllers\API\CityController::class, 'store'])->name('api.cities.store');
    Route::put('cities/{id}', [App\Http\Controllers\API\CityController::class, 'update'])->name('api.cities.update');
    Route::delete('cities/{id}', [App\Http\Controllers\API\CityController::class, 'destroy'])->name('api.cities.destroy');

    // Properties (CRUD)
    Route::post('properties', [App\Http\Controllers\API\PropertyController::class, 'store'])->name('api.properties.store');
    Route::put('properties/{id}', [App\Http\Controllers\API\PropertyController::class, 'update'])->name('api.properties.update');
    Route::delete('properties/{id}', [App\Http\Controllers\API\PropertyController::class, 'destroy'])->name('api.properties.destroy');

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
    // Inquiries
    Route::get('inquiries', [App\Http\Controllers\API\InquiryController::class
    , 'index'])->name('api.inquiries.index');
    Route::get('inquiries/{id}', [App\Http\Controllers\API\InquiryController::class, 'show'])->name('api.inquiries.show');
    Route::put('inquiries/{id}', [App\Http\Controllers\API\InquiryController::class, 'update'])->name('api.inquiries.update');
    Route::delete('inquiries/{id}', [App\Http\Controllers\API\InquiryController::class, 'destroy'])->name('api.inquiries.destroy');



});
