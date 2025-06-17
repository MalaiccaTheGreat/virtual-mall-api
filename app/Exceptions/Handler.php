<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        $this->renderable(function (Throwable $e, $request) {
            if ($request->expectsJson()) {
                return $this->handleApiException($e);
            }
        });
    }

    /**
     * Handle API exceptions and return JSON responses
     */
    private function handleApiException(Throwable $e)
    {
        if ($e instanceof ValidationException) {
            return response()->json([
                'error' => 'Validation failed',
                'message' => $e->getMessage(),
                'errors' => $e->errors()
            ], 422);
        }

        if ($e instanceof AuthenticationException) {
            return response()->json([
                'error' => 'Unauthenticated',
                'message' => $e->getMessage()
            ], 401);
        }

        if ($e instanceof HttpException) {
            return response()->json([
                'error' => 'HTTP Error',
                'message' => $e->getMessage()
            ], $e->getStatusCode());
        }

        // Handle all other exceptions
        $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
        
        return response()->json([
            'error' => 'Server Error',
            'message' => $e->getMessage()
        ], $statusCode);
    }
} 