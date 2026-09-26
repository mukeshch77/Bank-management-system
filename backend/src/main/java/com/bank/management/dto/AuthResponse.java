package com.bank.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AuthResponse DTO - What the backend sends BACK to the frontend after successful login.
 *
 * The frontend stores the JWT token and uses it for all subsequent requests.
 * The frontend stores the user info to display (name, role, etc.)
 *
 * Backend sends:
 * {
 *   "token": "eyJhbGciOiJIUzI1NiJ9...",
 *   "type": "Bearer",
 *   "id": 1,
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "email": "john@example.com",
 *   "role": "CUSTOMER",
 *   "accountNumber": "1234567890"
 * }
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String accountNumber;
}
