<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLiveCallsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('live_calls', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('query_type')->nullable();
            $table->foreignId('agent_id')->nullable();
            $table->timestamp('left_at')->nullable();
            $table->timestamp('answered_at')->nullable();
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('live_calls');
    }
}