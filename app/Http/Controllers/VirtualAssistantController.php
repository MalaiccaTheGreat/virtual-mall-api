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
                'response' => $responseText,
                'audio_url' => null, // Placeholder for audio response
                'expression' => 'neutral' // Placeholder for avatar expression
            ]);
        } catch (\Exception $e) {
            Log::error('Virtual Assistant Error: ' . $e->getMessage());
            return response()->json([
                'response' => 'Sorry, I encountered an error. Please try again.'
            ], 500);
        }
    }

    private function generateResponse($message)
    {
        $message = strtolower(trim($message));
        
        // Greetings
        if (preg_match('/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/', $message)) {
            return "Hello! Welcome to Pulse & Threads Virtual Mall! I'm your personal fashion assistant. How can I help you discover amazing styles today?";
        }
        
        // Virtual Try-On
        if (preg_match('/\b(try on|virtual|fitting|fit|size)\b/', $message)) {
            return "Great choice! Our Virtual Try-On feature lets you see how clothes look on you before buying. You can upload your photo or use our 3D model. Would you like me to guide you to the Virtual Try-On section?";
        }
        
        // Product searches
        if (preg_match('/\b(shirt|dress|pants|shoes|jacket|coat|jeans|top|blouse)\b/', $message)) {
            return "I'd love to help you find the perfect item! You can browse our extensive collection on the products page. Would you also like to try our Virtual Try-On feature to see how it looks on you?";
        }
        
        // Colors
        if (preg_match('/\b(blue|red|green|black|white|yellow|pink|purple|gold|royal)\b/', $message)) {
            return "Excellent color choice! We have a wide variety of items in different colors. Our Royal Blue and Gold collection is especially popular. Would you like me to help you find specific items in that color?";
        }
        
        // Cart/Shopping
        if (preg_match('/\b(cart|buy|purchase|checkout|price|cost)\b/', $message)) {
            return "I can help you with your shopping! Items you try on virtually are automatically added to your cart with pricing. You can view your cart anytime and proceed to secure checkout when ready.";
        }
        
        // Styling advice
        if (preg_match('/\b(style|fashion|look|outfit|recommend|advice)\b/', $message)) {
            return "I'd be happy to provide styling advice! Our AI can suggest outfits based on your preferences, occasion, and body type. Try our Virtual Try-On to experiment with different combinations!";
        }
        
        // Help
        if (preg_match('/\b(help|assist|support|how|what)\b/', $message)) {
            return "I'm here to help with everything at Pulse & Threads! I can assist with product searches, styling advice, virtual try-ons, cart management, and answering questions about our services. What would you like to know?";
        }
        
        // Default response
        return "Thank you for your message! I'm here to help you with fashion advice, product recommendations, virtual try-ons, and shopping assistance at Pulse & Threads Virtual Mall. Feel free to ask me anything about our products or services!";
    }

<<<<<<< HEAD
=======
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
>>>>>>> 45a42bb6b8f003179c57eadf18b2f7ae496b5430
}