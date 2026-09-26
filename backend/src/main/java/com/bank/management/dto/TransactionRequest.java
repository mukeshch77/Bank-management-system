package com.bank.management.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;

/**
 * TransactionRequest DTO - Used for deposit, withdrawal, and fast cash.
 *
 * Frontend sends:
 * {
 *   "amount": 5000.00,
 *   "pin": "1234"
 * }
 */
@Data
public class TransactionRequest {

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00", message = "Amount must be at least ₹1")
    private BigDecimal amount;

    @NotBlank(message = "PIN is required")
    @Pattern(regexp = "^[0-9]{4}$", message = "PIN must be exactly 4 digits")
    private String pin;

    // Optional: used only for transfers, ignored for deposit/withdraw
    private String targetAccountNumber;
}
