package com.bank.management.exception;

import com.bank.management.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * GlobalExceptionHandler - Catches ALL exceptions thrown anywhere in the app.
 *
 * @RestControllerAdvice = intercepts exceptions from all controllers.
 *
 * WITHOUT this class:
 * - An exception would show a huge ugly stack trace in the API response
 * - The frontend would get a 500 Internal Server Error with confusing HTML
 *
 * WITH this class:
 * - Every exception returns a clean JSON response
 * - HTTP status codes are correct (400 for bad request, 401 for unauthorized, etc.)
 * - Beginner-friendly error messages
 *
 * This is a best practice called "centralized exception handling".
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle custom RuntimeExceptions we throw in service classes.
     * Example: throw new RuntimeException("Insufficient balance")
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * Handle Spring Validation errors.
     * Triggered when @Valid fails on a DTO.
     *
     * Example: If email field is empty, returns:
     * {
     *   "success": false,
     *   "message": "Validation failed",
     *   "data": { "email": "Email is required", "password": "Password is required" }
     * }
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        // Collect all field errors into a map
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.<Map<String, String>>builder()
                        .success(false)
                        .message("Validation failed. Please check your input.")
                        .data(errors)
                        .build());
    }

    /**
     * Handle wrong email/password during login.
     * Spring Security throws this when credentials don't match.
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Invalid email or password. Please try again."));
    }

    /**
     * Handle any other unexpected exceptions.
     * This is a catch-all for anything we didn't specifically handle.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Something went wrong: " + ex.getMessage()));
    }
}
