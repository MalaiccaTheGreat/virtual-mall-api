<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VirtualAssistantController extends Controller
{
    public function handleMessage(Request $request)
    {
        try {
            $message = $request->input('message');
            
            if (empty($message)) {
                return response()->json([
                    'error' => 'Message is required'
                ], 400);
            }

            $responseText = $this->generateResponse($message);

            return response()->json([
                'message' => $responseText,
                'audio_url' => null, // Placeholder for audio response
                'expression' => 'neutral' // Placeholder for avatar expression
            ]);
        } catch (\Exception $e) {
            Log::error('Virtual Assistant Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred while processing your request'
            ], 500);
        }
    }

    private function generateResponse($message)
    {
        // Simple response logic - you can enhance this with AI or more complex logic
        $message = strtolower($message);
        
        if (str_contains($message, 'hello') || str_contains($message, 'hi')) {
            return 'Hello! How can I help you today?';
        }
        
        if (str_contains($message, 'product') || str_contains($message, 'price')) {
            return 'You can find all our products and their prices on the products page. Would you like me to help you find something specific?';
        }
        
        if (str_contains($message, 'delivery') || str_contains($message, 'shipping')) {
            return 'We offer delivery services across Zambia. Delivery times vary by location. Would you like to know more about delivery options?';
        }
        
        if (str_contains($message, 'payment') || str_contains($message, 'pay')) {
            return 'We accept various payment methods including mobile money, bank transfers, and cash on delivery. How would you like to proceed with payment?';
        }
        
        return "I'm here to help! Could you please provide more details about what you're looking for?";
    }
}