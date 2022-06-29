<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;
use App\Broadcasting\LivecallChannel;
use App\Http\Controllers\TwoFactorAuthController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CallBackController;
use App\Http\Controllers\LiveCallController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/



Route::middleware(['guest'])->group(function () {
    //
    //Route::post('/login', [LoginController::class, 'authenticate']);
    Route::get('admin', function () {
        return view('welcome');
    })->name('home');

    Route::get('password/reset/{token}', function () {
        return view('welcome');
    })->name('password.reset');

    Route::get('admin/forgot-password', function () {
        return view('welcome');
    });

    Route::get('/', function () {
        return view('home');
    });

    Route::get('live-support', function () {
        return view('welcome');
    });

    // Route::post('/login', [AuthController::class, 'login']);
    // Route::post('password/email', [AuthController::class, 'forgotPass']);
    // Route::post('password/update', [AuthController::class, 'resetPass']);

});

Route::get('admin/two-factor-auth', [TwoFactorAuthController::class, 'index'])->name('2fa.index');

Route::post('two-factor-auth', [TwoFactorAuthController::class, 'store'])->name('2fa.store');

Route::get('two-factor-auth/resent', [TwoFactorAuthController::class, 'resend'])->name('2fa.resend');

Route::middleware(['auth', '2fa'])->group(function () {

    Route::get('admin/dashboard', function () {
        return view('welcome');
    })->name('dashboard');

    Route::get('admin/dashboard/{name?}', function () {
        return view('welcome');
    })->where('name', '.*')->name('dashboard');

    Route::put('/change-password', [AuthController::class, 'changePass']);
    Route::put('/update', [AuthController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/save-token', [AuthController::class, 'saveToken']);

    Route::get('livecall/download', [LiveCallController::class, 'download']);
    Route::get('callback/download', [CallBackController::class, 'download']);
});

Route::middleware(['auth', 'role:admin|super-admin'])->group(function () {

    Route::get('authenticate', function () {
        return true;
    });
});

Route::middleware(['auth', 'role:super-admin'])->group(function () {

    Route::get('admin/dashboard/account', function () {
        return view('welcome');
    })->name('dashboard');
});

Route::get('confrencing/{URLRoomName?}', function () {
    return view('welcome');
});

Auth::routes();