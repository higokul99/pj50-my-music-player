<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    use ApiResponse;

    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(RegisterRequest $request)
    {
        try {
            $data = $this->authService->register($request->validated());
            
            return $this->successResponse([
                'user' => new UserResource($data['user']),
                'token' => $data['token']
            ], 'User registered successfully', 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Registration validation failed', ['errors' => $e->errors()]);
            return $this->errorResponse('Validation failed', $e->errors(), 422);
        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return $this->errorResponse($e->getMessage(), [], 500);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $data = $this->authService->login($request->validated());
            
            return $this->successResponse([
                'user' => new UserResource($data['user']),
                'token' => $data['token']
            ], 'User logged in successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Login validation failed', ['errors' => $e->errors()]);
            return $this->errorResponse('Validation failed', $e->errors(), 422);
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return $this->errorResponse('An error occurred during login', [], 500);
        }
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());
        return $this->successResponse([], 'Logged out successfully');
    }
}
