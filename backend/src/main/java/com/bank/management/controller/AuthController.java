package com.bank.management.controller;

import com.bank.management.dto.ApiResponse;
import com.bank.management.dto.AuthResponse;
import com.bank.management.dto.LoginRequest;
import com.bank.management.dto.SignupRequest;
import com.bank.management.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController - REST API endpoints for authentication.
 *
 * @RestController = @Controller + @ResponseBody
 *   - @Controller: marks this as an MVC controller
 *   - @ResponseBody: automatically converts return values to JSON
 *
 * @RequestMapping("/api/auth") = all endpoints in this controller start with /api/auth
 *
 * These routes are PUBLIC (no JWT required) - configured in SecurityConfig:
 *   .requestMatchers("/api/auth/**").permitAll()
 *
 * ENDPOINTS:
 *   POST /api/auth/signup  → Register new user
 *   POST /api/auth/login   → Login existing user
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/signup
     *
     * Request Body (JSON):
     * {
     *   "firstName": "John",
     *   "lastName": "Doe",
     *   "email": "john@example.com",
     *   "password": "Secret123",
     *   "phone": "9876543210",
     *   "address": "123 Main Street",
     *   "pin": "1234"
     * }
     *
     * Response (201 Created):
     * {
     *   "success": true,
     *   "message": "Account created successfully!",
     *   "data": {
     *     "token": "eyJhbGciOiJIUzI1NiJ9...",
     *     "firstName": "John",
     *     "role": "CUSTOMER",
     *     "accountNumber": "1234567890"
     *   }
     * }
     *
     * @Valid triggers all the validation annotations on SignupRequest (@NotBlank, @Email, etc.)
     * @RequestBody reads the JSON body from the request and converts it to SignupRequest
     */
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(
            @Valid @RequestBody SignupRequest request) {

        AuthResponse authResponse = authService.signup(request);

        return ResponseEntity
                .status(HttpStatus.CREATED) // 201 Created
                .body(ApiResponse.success("Account created successfully! Welcome to the bank.", authResponse));
    }

    /**
     * POST /api/auth/login
     *
     * Request Body (JSON):
     * {
     *   "email": "john@example.com",
     *   "password": "Secret123"
     * }
     *
     * Response (200 OK):
     * {
     *   "success": true,
     *   "message": "Login successful!",
     *   "data": {
     *     "token": "eyJhbGciOiJIUzI1NiJ9...",
     *     "firstName": "John",
     *     "role": "CUSTOMER",
     *     "accountNumber": "1234567890"
     *   }
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse authResponse = authService.login(request);

        return ResponseEntity.ok(ApiResponse.success("Login successful! Welcome back.", authResponse));
    }
}
