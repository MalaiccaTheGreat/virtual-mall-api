<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class VirtualAssistantController extends Controller
{
    private $expressions = [
        'greeting' => 'happy',
        'product_help' => 'thinking',
        'error' => 'sad',
        'suggestion' => 'neutral',
        'confirmation' => 'happy',
        'default' => 'neutral',
        'listening' => 'listening',
        'talking' => 'talking'
    ];

    public function handleMessage(Request $request)
    {
        try {
            $message = $request->input('message');
            $context = $request->input('context', []);
            
            if (empty($message)) {
                return $this->errorResponse('Message is required', 400);
            }

            $response = $this->generateResponse($message, $context);
            $expression = $this->determineExpression($response['type'] ?? 'default');

            return response()->json([
                'response' => $response['text'],
                'expression' => $expression,
                'shouldSpeak' => $response['shouldSpeak'] ?? true,
                'suggestions' => $response['suggestions'] ?? [],
                'metadata' => $response['metadata'] ?? []
            ]);
        } catch (\Exception $e) {
            Log::error('Virtual Assistant Error: ' . $e->getMessage());
            return response()->json([
                'response' => 'Sorry, I encountered an error. Please try again.'
            ], 500);
        }
    }

    private function generateResponse($message, $context = [])
    {
        $message = strtolower(trim($message));
        
        // Greetings
        if (preg_match('/\b(hello|hi|hey|good morning|good afternoon|good evening|hey there|greetings)\b/', $message)) {
            $name = $context['user'] ?? null;
            $greeting = $name ? "Hello, $name!" : "Hello!";
            
            return [
                'type' => 'greeting',
                'text' => "$greeting Welcome to Pulse & Threads Virtual Mall! I'm your personal fashion assistant. How can I help you discover amazing styles today?",
                'shouldSpeak' => true,
                'suggestions' => [
                    'Show me new arrivals',
                    'Help me find an outfit',
                    'How does virtual try-on work?'
                ]
            ];
        }
        
        // Virtual Try-On
        if (preg_match('/\b(try on|virtual|fitting|fit|size|how do i know my size|does this fit)\b/', $message)) {
            return [
                'type' => 'suggestion',
                'text' => "Great choice! Our Virtual Try-On feature lets you see how clothes look on you before buying. You can upload your photo or use our 3D model. Would you like me to guide you to the Virtual Try-On section?",
                'shouldSpeak' => true,
                'metadata' => [
                    'action' => 'navigate',
                    'target' => '/virtual-try-on'
                ]
            ];
        }
        
        // Product searches
        if (preg_match('/\b(show me|find|look for|search for|where can i find|i need|i want|looking for)\b/', $message)) {
            $productType = $this->extractProductType($message);
            
            if ($productType) {
                return [
                    'type' => 'product_help',
                    'text' => "I found some $productType options for you. Let me show you what we have available.",
                    'shouldSpeak' => true,
                    'metadata' => [
                        'action' => 'search',
                        'query' => $productType
                    ]
                ];
            }
            
            return [
                'type' => 'product_help',
                'text' => "I'd be happy to help you find something! Could you tell me what type of clothing or accessory you're interested in?",
                'shouldSpeak' => true,
                'suggestions' => [
                    'Show me dresses',
                    'I need shoes',
                    'Looking for accessories'
                ]
            ];
        }
        
        // Help with orders
        if (preg_match('/\b(track order|order status|where is my order|when will i get my order)\b/', $message)) {
            return [
                'type' => 'order_help',
                'text' => "I can help you track your order. Please provide your order number, or check the 'My Orders' section in your account for the latest updates on your delivery.",
                'shouldSpeak' => true,
                'metadata' => [
                    'action' => 'navigate',
                    'target' => '/orders'
                ]
            ];
        }
        
        // Cart/Shopping
        if (preg_match('/\b(cart|shopping bag|my items|checkout|purchase|buy)\b/', $message)) {
            return [
                'type' => 'suggestion',
                'text' => "I can help you with your shopping cart. Would you like to view your cart, proceed to checkout, or continue shopping?",
                'shouldSpeak' => true,
                'metadata' => [
                    'action' => 'navigate',
                    'target' => '/cart'
                ]
            ];
        }
        
        // Help/Support
        if (preg_match('/\b(help|support|problem|issue|question|how to|what is)\b/', $message)) {
            return [
                'type' => 'suggestion',
                'text' => "I'm here to help! You can ask me about our products, track orders, or get assistance with returns and exchanges. What do you need help with?",
                'shouldSpeak' => true,
                'suggestions' => [
                    'How do I return an item?',
                    'What are your shipping options?',
                    'Contact customer service'
                ]
            ];
        }
        
        // Styling advice
        if (preg_match('/\b(style|fashion|look|outfit|recommend|advice|what should i wear|outfit suggestion)\b/', $message)) {
            return [
                'type' => 'suggestion',
                'text' => "I'd be happy to provide styling advice! Our AI can suggest outfits based on your preferences, occasion, and body type. Would you like to try our Virtual Try-On to experiment with different combinations?",
                'shouldSpeak' => true,
                'suggestions' => [
                    'Show me casual outfits',
                    'I need a formal look',
                    'What goes with these shoes?'
                ],
                'metadata' => [
                    'action' => 'navigate',
                    'target' => '/virtual-wardrobe'
                ]
            ];
        }
        
        // Price/Checkout
        if (preg_match('/\b(price|cost|how much|discount|sale|promo|coupon|voucher)\b/', $message)) {
            return [
                'type' => 'product_help',
                'text' => "I can help you find great deals! Check out our 'Sale' section for current promotions. You can also sign up for our newsletter to receive exclusive discounts. Would you like to see items on sale?",
                'shouldSpeak' => true,
                'metadata' => [
                    'action' => 'navigate',
                    'target' => '/sale'
                ]
            ];
        }
        
        // Default response for unknown queries
        return [
            'type' => 'default',
            'text' => "I'm here to help with your fashion needs! You can ask me about products, sizes, orders, or use our virtual try-on feature. What would you like to know?",
            'shouldSpeak' => true,
            'suggestions' => [
                'Show me new arrivals',
                'Help me find an outfit',
                'How does virtual try-on work?'
            ]
        ];
    }
    
    private function extractProductType($message)
    {
        $keywords = [
            'dress' => 'dresses',
            'shirt' => 'shirts',
            'pant' => 'pants',
            'jean' => 'jeans',
            'shoe' => 'shoes',
            'accessor' => 'accessories',
            'jewel' => 'jewelry',
            'bag' => 'bags',
            'hat' => 'hats',
            'jacket' => 'jackets',
            'skirt' => 'skirts',
            'short' => 'shorts',
            'swim' => 'swimwear',
            'lingerie' => 'lingerie',
            'suit' => 'suits',
            'blouse' => 'blouses'
        ];
        
        foreach ($keywords as $key => $value) {
            if (stripos($message, $key) !== false) {
                return $value;
            }
        }
        
        return null;
    }
    
    private function determineExpression($type)
    {
        return $this->expressions[$type] ?? $this->expressions['default'];
    }
    
    private function errorResponse($message, $status = 500)
    {
        return response()->json([
            'response' => $message,
            'expression' => $this->expressions['error'],
            'shouldSpeak' => true,
            'error' => true
        ], $status);
    }
}