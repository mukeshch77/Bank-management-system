package com.bank.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * ChangePinRequest DTO - Used when user wants to change their ATM PIN.
 *
 * Frontend sends:
 * {
 *   "currentPin": "1234",
 *   "newPin": "5678"
 * }
 */
@Data
public class ChangePinRequest {

    @NotBlank(message = "Current PIN is required")
    @Pattern(regexp = "^[0-9]{4}$", message = "PIN must be exactly 4 digits")
    private String currentPin;

    @NotBlank(message = "New PIN is required")
    @Pattern(regexp = "^[0-9]{4}$", message = "PIN must be exactly 4 digits")
    private String newPin;
}
