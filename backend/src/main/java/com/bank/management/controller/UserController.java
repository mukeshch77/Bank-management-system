package com.bank.management.controller;

import com.bank.management.dto.ApiResponse;
import com.bank.management.entity.User;
import com.bank.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * UserController - Endpoints for user profile management.
 *
 * ENDPOINTS:
 *   GET  /api/user/profile         → Get logged-in user's profile
 *   PUT  /api/user/profile         → Update profile (phone, address)
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /**
     * GET /api/user/profile
     * Get the logged-in user's profile information.
     *
     * The @AuthenticationPrincipal gives us the currently authenticated user.
     * We use their email (username) to fetch from DB.
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", user));
    }

    /**
     * PUT /api/user/profile
     * Update the logged-in user's phone and address.
     *
     * Request Body (only fields you want to update):
     * {
     *   "phone": "9876543210",
     *   "address": "456 New Street"
     * }
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> updates) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only allow updating phone and address (not email or role for security)
        if (updates.containsKey("phone")) {
            user.setPhone(updates.get("phone"));
        }
        if (updates.containsKey("address")) {
            user.setAddress(updates.get("address"));
        }

        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", user));
    }
}
