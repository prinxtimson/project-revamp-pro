<?php

use App\Http\Controllers\CallBackController;
use App\Http\Controllers\LiveCallController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('livecall', [LiveCallController::class, 'store']);
Route::post('callback', [CallBackController::class, 'store']);
Route::put('livecall/{id}', [LiveCallController::class, 'update']);
Route::put('callback/{id}', [CallBackController::class, 'update']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/me', [UserController::class, 'me']);
    Route::delete('/delete', [UserController::class, 'delete']);
    Route::put('/update', [UserController::class, 'update']);
    Route::get('callback', [CallBackController::class, 'index']);
    Route::get('livecall', [LiveCallController::class, 'index']);
    Route::get('livecall/{id}', [LiveCallController::class, 'index']);
    Route::get('callback/{id}', [CallBackController::class, 'index']);
    Route::delete('livecall/{id}', [LiveCallController::class, 'delete']);
    Route::delete('callback/{id}', [CallBackController::class, 'delete']);
    // Route::get('/mark-notification', [AuthController::class, 'markNotification']);
    // Route::get('users/activities', [UserController::class, 'user_activities']);
});

Route::group(['middleware' => ['auth:sanctum', 'role:admin|super-admin']], function () {
    //
    Route::get('users', [UserController::class, 'index']);
    Route::post('users', [UserController::class, 'store']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);
    Route::put('users/disable/{id}', [UserController::class, 'disable']);
    Route::put('users/enable/{id}', [UserController::class, 'enable']);
    //Route::put('users/approved/{id}', [UserController::class, 'approved']);

});