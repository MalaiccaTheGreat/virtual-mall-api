<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class WelcomePageTest extends TestCase
{
    public function test_guest_can_access_welcome_page()
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_welcome_page_contains_required_elements()
    {
        $response = $this->get('/');
        $response->assertInertia(fn ($assert) => $assert
            ->component('Welcome')
            ->has('auth.user')
        );
    }
} 