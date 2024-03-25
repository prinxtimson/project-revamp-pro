<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnToCallBacksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('call_backs', function (Blueprint $table) {
            $table->enum('status', ['PENDING', 'SUCCESSFUL', 'FAILED'])->default('FAILED');
            $table->string('query_type');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('call_backs', function (Blueprint $table) {
            //
        });
    }
}
