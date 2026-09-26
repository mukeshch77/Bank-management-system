package com.bank.management.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * SignupRequest DTO - Data Transfer Object for user registration.
 *
 * DTO = Data Transfer Object.
 * It's a simple class that carries data from the frontend to the backend.
 *
 * WHY use DTOs instead of sending the Entity directly?
 * 1. Security: we don't want the frontend to control internal fields like 'role', 'createdAt'
 * 2. Validation: we can add @NotBlank, @Email etc. directly on DTO fields
 * 3. Flexibility: DTO can have different fields than the entity
 *
 * The frontend sends a JSON body like:
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "email": "john@example.com",
 *   "password": "Secret123",
 *   "phone": "9876543210",
 *   "address": "123 Main St",
 *   "pin": "1234"
 * }
 */
@Data  // Lombok: generates getters, setters, toString automatically
public class SignupRequest {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;

    private String address;

    @NotBlank(message = "PIN is required")
    @Pattern(regexp = "^[0-9]{4}$", message = "PIN must be exactly 4 digits")
    private String pin;
}
