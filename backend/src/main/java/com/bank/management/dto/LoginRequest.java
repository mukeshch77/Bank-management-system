package com.bank.management.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * LoginRequest DTO - Carries email and password from frontend for login.
 *
 * Frontend sends:
 * {
 *   "email": "john@example.com",
 *   "password": "Secret123"
 * }
 */
@Data
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
