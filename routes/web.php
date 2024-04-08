<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;
use App\Broadcasting\LivecallChannel;
use App\Http\Controllers\TwoFactorAuthController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CallBackController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\LiveCallController;
use App\Http\Controllers\ReportTemplateController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideoRoomController;

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

    Route::get('admin/password/reset/{token}', function () {
        return view('welcome');
    })->name('password.reset');

    Route::get('admin/forgot-password', function () {
        return view('welcome');
    });

    Route::get('/', function () {
        return view('welcome');
    });

    Route::get('/callback/{id}', function () {
        return view('welcome');
    });

    Route::get('/review/{channel}/{id}', function () {
        return view('welcome');
    });

    Route::get('live-support', function () {
        return view('welcome');
    });

    // Route::post('/login', [AuthController::class, 'login']);
    // Route::post('password/email', [AuthController::class, 'forgotPass']);
    // Route::post('password/update', [AuthController::class, 'resetPass']);

});

Route::get('admin/two-factor-auth', [TwoFactorAuthController::class, 'index'])->name('2fa.index')->middleware("auth");

Route::post('two-factor-auth', [TwoFactorAuthController::class, 'store'])->name('2fa.store')->middleware('auth');

Route::get('two-factor-auth/resend', [TwoFactorAuthController::class, 'resend'])->name('2fa.resend')->middleware("auth");

Route::get('admin/logout', function () {
    return view('welcome');
})->name('logout');

Route::middleware(['auth', '2fa'])->group(function () {

    Route::get('admin/dashboard', function () {
        return view('welcome');
    })->name('dashboard');

    Route::get('admin/dashboard/{name?}', function () {
        return view('welcome');
    })->where('name', '.*')->name('dashboard.*');

    Route::get('admin/dashboard/agent/{id}', function () {
        return view('welcome');
    })->name('dashboard.agent.single');

    Route::get('admin/dashboard/e-learning/view/{id}', function () {
        return view('welcome');
    })->name('dashboard.e-learning.single');

    Route::get('admin/dashboard/profile/edit', function () {
        return view('welcome');
    })->name('dashboard.profile.edit');

    Route::get('admin/dashboard/profile/edit/upload', function () {
        return view('welcome');
    })->name('dashboard.profile.edit.upload');

    Route::put('/change-password', [AuthController::class, 'changePass']);
    Route::put('/update', [AuthController::class, 'update']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/save-token', [AuthController::class, 'saveToken']);

    Route::get('livecall/report/download', [LiveCallController::class, 'download']);
    Route::get('callback/report/download', [CallBackController::class, 'download']);
    Route::get('tickets/report/download', [TicketController::class, 'download']);
    Route::get('chats/transcript/{chat}/download', [ChatController::class, 'download_chat']);
    Route::get('customer-review/report/download', [SurveyController::class, 'download']);
    Route::get('leaderboard/report/download', [UserController::class, 'download']);

    Route::post('recordingrules', [VideoRoomController::class, 'recording']);
});

Route::middleware(['auth', 'role:admin|super-admin'])->group(function () {

    Route::get('authenticate', function () {
        return true;
    });
});

Route::middleware(['auth', 'role:super-admin'])->group(function () {

    Route::get('admin/dashboard/account', function () {
        return view('welcome');
    })->name('dashboard.accout');
});

Route::get('conferencing/{URLRoomName?}', function () {
    return view('welcome');
});

Route::get('report/download/{filename}', [ReportTemplateController::class, 'download']);

Auth::routes();