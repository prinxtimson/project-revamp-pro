<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;
use App\Broadcasting\LivecallChannel;

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

    Route::get('admin/reset-password/{token}', function () {
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

});

Route::middleware(['auth'])->group(function () {

    Route::get('admin/dashboard', function () {
        return view('welcome');
    })->name('dashboard');

    Route::get('admin/dashboard/{name?}', function () {
        return view('welcome');
    });

    //Route::get('customer-analytics/download', [MailController::class, 'download']);
});

Route::get('confrencing/{URLRoomName?}', function () {
    return view('welcome');
});

Auth::routes();

//Broadcast::channel('livecall', LivecallChannel::class);