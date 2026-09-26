package com.bank.management.controller;

import com.bank.management.dto.ApiResponse;
import com.bank.management.dto.ChangePinRequest;
import com.bank.management.dto.TransactionRequest;
import com.bank.management.entity.Account;
import com.bank.management.entity.Transaction;
import com.bank.management.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AccountController - REST API endpoints for banking operations.
 *
 * All endpoints here require JWT authentication (configured in SecurityConfig).
 *
 * HOW DO WE KNOW WHO IS LOGGED IN?
 * We use @AuthenticationPrincipal UserDetails userDetails.
 * Spring Security reads the JWT token from the Authorization header,
 * extracts the email, and injects it as UserDetails automatically.
 *
 * We then use userDetails.getUsername() to get the email,
 * and use that email to find the user in the database.
 *
 * ENDPOINTS:
 *   GET  /api/account/balance            → Get current balance
 *   GET  /api/account/details            → Get full account info
 *   POST /api/account/deposit            → Deposit money
 *   POST /api/account/withdraw           → Withdraw money
 *   POST /api/account/fast-cash          → Fast cash (predefined amounts)
 *   GET  /api/account/mini-statement     → Last 5 transactions
 *   GET  /api/account/transactions       → Full transaction history
 *   PUT  /api/account/change-pin         → Change ATM PIN
 */
@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    /**
     * GET /api/account/balance
     * Get the current balance of the logged-in user's account.
     *
     * Header required: Authorization: Bearer <jwt_token>
     *
     * Response:
     * {
     *   "success": true,
     *   "message": "Balance retrieved",
     *   "data": {
     *     "balance": 15000.00,
     *     "accountNumber": "1234567890",
     *     "accountType": "SAVINGS",
     *     "status": "ACTIVE"
     *   }
     * }
     */
    @GetMapping("/balance")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBalance(
            @AuthenticationPrincipal UserDetails userDetails) {

        Map<String, Object> balance = accountService.getBalance(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Balance retrieved successfully", balance));
    }

    /**
     * GET /api/account/details
     * Get full account details (account number, type, status, balance, created date).
     */
    @GetMapping("/details")
    public ResponseEntity<ApiResponse<Account>> getAccountDetails(
            @AuthenticationPrincipal UserDetails userDetails) {

        Account account = accountService.getAccountDetails(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Account details retrieved", account));
    }

    /**
     * POST /api/account/deposit
     * Deposit money into the account.
     *
     * Request Body:
     * { "amount": 5000, "pin": "1234" }
     *
     * Response:
     * {
     *   "success": true,
     *   "message": "Deposit successful",
     *   "data": { "balance": 15000.00, "message": "₹5000 deposited successfully!" }
     * }
     */
    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deposit(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TransactionRequest request) {

        Map<String, Object> result = accountService.deposit(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Deposit successful", result));
    }

    /**
     * POST /api/account/withdraw
     * Withdraw money from the account.
     *
     * Request Body:
     * { "amount": 2000, "pin": "1234" }
     */
    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<Map<String, Object>>> withdraw(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TransactionRequest request) {

        Map<String, Object> result = accountService.withdraw(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Withdrawal successful", result));
    }

    /**
     * POST /api/account/fast-cash
     * Quick withdrawal with standard amounts (500, 1000, 2000, 5000, 10000).
     *
     * Request Body:
     * { "amount": 2000, "pin": "1234" }
     */
    @PostMapping("/fast-cash")
    public ResponseEntity<ApiResponse<Map<String, Object>>> fastCash(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TransactionRequest request) {

        Map<String, Object> result = accountService.fastCash(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Fast cash successful", result));
    }

    /**
     * GET /api/account/mini-statement
     * Get the last 5 transactions for the mini-statement.
     */
    @GetMapping("/mini-statement")
    public ResponseEntity<ApiResponse<List<Transaction>>> getMiniStatement(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<Transaction> transactions = accountService.getMiniStatement(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Mini statement retrieved", transactions));
    }

    /**
     * GET /api/account/transactions
     * Get full transaction history (all transactions).
     */
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<Transaction>>> getTransactionHistory(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<Transaction> transactions = accountService.getTransactionHistory(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Transaction history retrieved", transactions));
    }

    /**
     * PUT /api/account/change-pin
     * Change the account's ATM PIN.
     *
     * Request Body:
     * { "currentPin": "1234", "newPin": "5678" }
     */
    @PutMapping("/change-pin")
    public ResponseEntity<ApiResponse<String>> changePin(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePinRequest request) {

        accountService.changePin(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("PIN changed successfully!"));
    }
}
