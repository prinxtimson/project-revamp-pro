<?php

use Illuminate\Support\Facades\Route;

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
    Route::get('/', function () {
        return view('welcome');
    })->name('home');
    Route::get('reset-password/{token}', function () {
        return view('welcome');
    })->name('password.reset');
    Route::get('forgot-password', function () {
        return view('welcome');
    });

});

Route::middleware(['auth'])->group(function () {

    Route::get('change-password', function () {
        return view('welcome');
    });

    Route::get('dashboard/{name?}/{id?}', function () {
        return view('welcome');
    })->name('dashboard.rpa-folders');

    //Route::get('customer-analytics/download', [MailController::class, 'download']);
});

Auth::routes();