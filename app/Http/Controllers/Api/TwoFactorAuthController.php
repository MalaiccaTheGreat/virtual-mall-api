<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TwoFactorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TwoFactorAuthController extends Controller
{
    protected $twoFactorService;

    public function __construct(TwoFactorService $twoFactorService)
    {
        $this->twoFactorService = $twoFactorService;
    }

    /**
     * Send verification code for registration
     */
    public function sendVerificationCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $this->twoFactorService->sendVerificationCode($request->email);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Verification code sent successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send verification code',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify code for registration
     */
    public function verifyCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|string|size:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $isValid = $this->twoFactorService->verifyCode($request->email, $request->code);
            
            if (!$isValid) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid verification code'
                ], 400);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Code verified successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to verify code',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send 2FA code for login
     */
    public function sendTwoFactorCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $this->twoFactorService->sendTwoFactorCode($request->email);
            
            return response()->json([
                'status' => 'success',
                'message' => '2FA code sent successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send 2FA code',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify 2FA code for login
     */
    public function verifyTwoFactorCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|size:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $isValid = $this->twoFactorService->verifyTwoFactorCode($request->email, $request->code);
            
            if (!$isValid) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid 2FA code'
                ], 400);
            }

            return response()->json([
                'status' => 'success',
                'message' => '2FA code verified successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to verify 2FA code',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 