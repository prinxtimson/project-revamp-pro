<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChatMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('chat_id')
                ->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable();
            $table->string('sender_name');
            $table->string('sender_avatar')->nullable();
            $table->tinyText('message')->default('');
            $table->string('media')->nullable();
            $table->string('media_format')->nullable();
            $table->tinyInteger('is_edited')->default(0);
            $table->timestamp('read_at')->nullable();
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
        Schema::dropIfExists('chat_messages');
    }
}
