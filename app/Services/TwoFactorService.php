<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\TwoFactorCode;
use App\Mail\VerificationCode;

class TwoFactorService
{
    public function generateAndSendVerificationCode(User $user): void
    {
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = now()->addMinutes(10);

        $user->update([
            'verification_code' => $code,
            'verification_code_expires_at' => $expiresAt
        ]);

        Mail::to($user->email)->send(new VerificationCode($code));
    }

    public function generateAndSendTwoFactorCode(User $user): void
    {
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = now()->addMinutes(10);

        $user->update([
            'two_factor_code' => $code,
            'two_factor_expires_at' => $expiresAt
        ]);

        Mail::to($user->email)->send(new TwoFactorCode($code));
    }

    public function verifyCode(User $user, string $code): bool
    {
        if (!$user->verification_code || !$user->verification_code_expires_at) {
            return false;
        }

        if ($user->verification_code_expires_at->isPast()) {
            return false;
        }

        return $user->verification_code === $code;
    }

    public function verifyTwoFactorCode(User $user, string $code): bool
    {
        if (!$user->two_factor_code || !$user->two_factor_expires_at) {
            return false;
        }

        if ($user->two_factor_expires_at->isPast()) {
            return false;
        }

        return $user->two_factor_code === $code;
    }

    public function clearVerificationCode(User $user): void
    {
        $user->update([
            'verification_code' => null,
            'verification_code_expires_at' => null
        ]);
    }

    public function clearTwoFactorCode(User $user): void
    {
        $user->update([
            'two_factor_code' => null,
            'two_factor_expires_at' => null
        ]);
    }
} 