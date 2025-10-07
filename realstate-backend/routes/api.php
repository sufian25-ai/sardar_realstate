<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['namespace' => 'App\Http\Controllers\API'], function () {
    // --------------- Register and Login ----------------//
    Route::post('register', 'AuthenticationController@register')->name('register');
    Route::post('login', 'AuthenticationController@login')->name('login');

    // ------------------ Get Data ----------------------//
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('get-user', 'AuthenticationController@userInfo')->name('get-user');
        Route::post('logout', 'AuthenticationController@logOut')->name('logout');

        // ------------------ States ----------------------//
        Route::apiResource('states', 'StateController');

        // ------------------ Cities ----------------------//
        Route::apiResource('cities', 'CityController');

        // ------------------ Properties ----------------------//
        Route::apiResource('properties', 'PropertyController');

        // ------------------ Rent Applications ----------------------//
        Route::apiResource('rents', 'RentController');
        Route::post('rents/{id}/approve', 'RentController@approve')->name('rents.approve');

        // ------------------ Payments ----------------------//
        Route::apiResource('payments', 'PaymentController');
        Route::post('payments/{id}/approve', 'PaymentController@approve')->name('payments.approve');

        // ------------------ Rent Payments ----------------------//
        Route::apiResource('rent-payments', 'RentPaymentController');
        Route::post('rent-payments/{id}/mark-paid', 'RentPaymentController@markAsPaid')->name('rent-payments.mark-paid');

        // ------------------ Feedback ----------------------//
        Route::apiResource('feedbacks', 'FeedbackController');
        Route::post('feedbacks/{id}/approve', 'FeedbackController@approve')->name('feedbacks.approve');
        Route::post('feedbacks/{id}/feature', 'FeedbackController@feature')->name('feedbacks.feature');

        // ------------------ Financial Reports ----------------------//
        Route::apiResource('financial-reports', 'FinancialReportController');
    });
});
