package com.bank.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * ApiResponse - A standard wrapper for ALL API responses from our backend.
 *
 * WHY use a standard response wrapper?
 * - Consistency: Every API returns the same structure, making frontend code simpler
 * - Debugging: Always know if request succeeded and what the message was
 *
 * Example success response:
 * {
 *   "success": true,
 *   "message": "Deposit successful",
 *   "data": { "balance": 15000.00 },
 *   "timestamp": "2024-01-15T10:30:00"
 * }
 *
 * Example error response:
 * {
 *   "success": false,
 *   "message": "Insufficient balance",
 *   "data": null,
 *   "timestamp": "2024-01-15T10:30:00"
 * }
 *
 * The generic type <T> means 'data' can be any type:
 *   ApiResponse<String>       - data is a String
 *   ApiResponse<AccountDto>   - data is an AccountDto object
 *   ApiResponse<List<...>>    - data is a list
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    // Convenience factory methods

    /** Create a success response with data */
    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /** Create a success response without data */
    public static <T> ApiResponse<T> success(String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /** Create an error response */
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
