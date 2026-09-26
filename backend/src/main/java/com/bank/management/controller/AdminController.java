package com.bank.management.controller;

import com.bank.management.dto.ApiResponse;
import com.bank.management.entity.Transaction;
import com.bank.management.entity.User;
import com.bank.management.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AdminController - REST API endpoints accessible ONLY by ADMIN users.
 *
 * Spring Security checks the user's role before allowing access:
 * .requestMatchers("/api/admin/**").hasRole("ADMIN")
 *
 * If a CUSTOMER tries to access /api/admin/**, they get 403 Forbidden.
 *
 * ENDPOINTS:
 *   GET    /api/admin/dashboard          → Dashboard stats
 *   GET    /api/admin/users              → All customers
 *   GET    /api/admin/users/{id}         → Specific user details
 *   DELETE /api/admin/users/{id}         → Delete a user
 *   PUT    /api/admin/users/{id}/freeze  → Freeze account
 *   PUT    /api/admin/users/{id}/activate → Activate account
 *   GET    /api/admin/transactions       → All transactions
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /**
     * GET /api/admin/dashboard
     * Returns summary stats for the admin dashboard:
     * total customers, total transactions, deposits, withdrawals.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }

    /**
     * GET /api/admin/users
     * Returns a list of all registered customers.
     */
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllCustomers() {
        List<User> users = adminService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.success("All customers retrieved", users));
    }

    /**
     * GET /api/admin/users/{id}
     * Get details of a specific user by their ID.
     *
     * @PathVariable Long id → reads the {id} from the URL path.
     * Example: GET /api/admin/users/5 → id = 5
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserDetails(
            @PathVariable Long id) {

        Map<String, Object> details = adminService.getUserDetails(id);
        return ResponseEntity.ok(ApiResponse.success("User details retrieved", details));
    }

    /**
     * DELETE /api/admin/users/{id}
     * Delete a user and their account from the system.
     *
     * Example: DELETE /api/admin/users/5 → deletes user with id=5
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }

    /**
     * PUT /api/admin/users/{id}/freeze
     * Freeze a user's account (prevent all transactions).
     */
    @PutMapping("/users/{id}/freeze")
    public ResponseEntity<ApiResponse<String>> freezeAccount(@PathVariable Long id) {
        adminService.freezeAccount(id);
        return ResponseEntity.ok(ApiResponse.success("Account frozen successfully"));
    }

    /**
     * PUT /api/admin/users/{id}/activate
     * Activate a previously frozen account.
     */
    @PutMapping("/users/{id}/activate")
    public ResponseEntity<ApiResponse<String>> activateAccount(@PathVariable Long id) {
        adminService.activateAccount(id);
        return ResponseEntity.ok(ApiResponse.success("Account activated successfully"));
    }

    /**
     * GET /api/admin/transactions
     * Get all transactions across all accounts (admin monitoring).
     */
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<Transaction>>> getAllTransactions() {
        List<Transaction> transactions = adminService.getAllTransactions();
        return ResponseEntity.ok(ApiResponse.success("All transactions retrieved", transactions));
    }
}
