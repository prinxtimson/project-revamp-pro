<?php

use App\Http\Controllers\CallBackController;
use App\Http\Controllers\LiveCallController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideoRoomController;
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
Route::get('livecall/waiting/count', [LiveCallController::class, 'waiting_list_count']);
Route::get('livecall/leave/{id}', [LiveCallController::class, 'leave']);
Route::get('room/{id}', [VideoRoomController::class, 'show']);
Route::post('room/token', [VideoRoomController::class, 'get_access_token']);
Route::post('feedback', [SurveyController::class, 'store']);
Route::get('feedback/{id}', [SurveyController::class, 'show']);


Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/me', [UserController::class, 'me']);
    Route::delete('/delete', [UserController::class, 'delete']);
    Route::put('/update', [UserController::class, 'update']);

    Route::get('livecall', [LiveCallController::class, 'index']);
    Route::get('livecall/filter', [LiveCallController::class, 'filter_waiting_list']);
    Route::get('livecall/summary', [LiveCallController::class, 'summary']);
    Route::delete('livecall/{id}', [LiveCallController::class, 'destroy']);
    Route::get('livecall/connect/{id}', [LiveCallController::class, 'connect']);
    Route::get('livecall/{id}', [LiveCallController::class, 'show']);
    Route::get('livecall/search/{query_type}', [LiveCallController::class, 'search_by_query_type']);

    //Route::get('callback/{id}', [CallBackController::class, 'show']);
    Route::get('callback/summary', [CallBackController::class, 'summary']); 
    Route::get('callback/search/{query}', [CallBackController::class, 'search']);
    Route::get('callback', [CallBackController::class, 'index']);
    Route::put('callback/success/{id}', [CallBackController::class, 'success']);
    Route::put('callback/fail/{id}', [CallBackController::class, 'fail']);
    Route::delete('callback/{id}', [CallBackController::class, 'destroy']);

    Route::get('feedback', [SurveyController::class, 'index']);
    Route::delete('feedback/{id}', [SurveyController::class, 'destroy']);

    // Route::get('/mark-notification', [AuthController::class, 'markNotification']);
    // Route::get('users/activities', [UserController::class, 'user_activities']);
});

Route::group(['middleware' => ['auth:sanctum', 'role:admin|super-admin']], function () {
    //
    Route::get('users', [UserController::class, 'index']);
    Route::get('users/search/{query}', [UserController::class, 'search']);
    Route::post('users', [UserController::class, 'store']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);
    Route::put('users/disable/{id}', [UserController::class, 'disable']);
    Route::put('users/enable/{id}', [UserController::class, 'enable']);
    
    Route::post('livecall/opentok/{id}', [LiveCallController::class, 'con']);
    Route::post('livecall/on_connected/{id}', [LiveCallController::class, 'on_connected']);
    //Route::put('users/approved/{id}', [UserController::class, 'approved']);

    Route::get('room', [VideoRoomController::class, 'index']);
    Route::post('room', [VideoRoomController::class, 'create_room']);
    Route::get('room/end/{id}', [VideoRoomController::class, 'end']);
    Route::post('room/breakout/{id}', [VideoRoomController::class, 'create_breakout_room']);
    Route::post('room/remove_participant', [VideoRoomController::class, 'remove_participant']);

});