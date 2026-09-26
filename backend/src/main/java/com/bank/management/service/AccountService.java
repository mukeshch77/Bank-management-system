package com.bank.management.service;

import com.bank.management.dto.ApiResponse;
import com.bank.management.dto.ChangePinRequest;
import com.bank.management.dto.TransactionRequest;
import com.bank.management.entity.Account;
import com.bank.management.entity.Transaction;
import com.bank.management.entity.User;
import com.bank.management.repository.AccountRepository;
import com.bank.management.repository.TransactionRepository;
import com.bank.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * AccountService - All banking operations: deposit, withdraw, balance check, etc.
 *
 * SECURITY NOTE:
 * Every method receives the logged-in user's email (from JWT token).
 * We use that email to find the user in the database, then their account.
 * This ensures users can ONLY access their OWN account data.
 *
 * We never trust account numbers sent from the frontend for "self" operations.
 * The account is always looked up via the authenticated user's email.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get balance for the logged-in user.
     * Returns just the balance amount wrapped in a Map.
     */
    public Map<String, Object> getBalance(String email) {
        Account account = getAccountByEmail(email);
        return Map.of(
                "balance", account.getBalance(),
                "accountNumber", account.getAccountNumber(),
                "accountType", account.getAccountType(),
                "status", account.getStatus()
        );
    }

    /**
     * DEPOSIT - Add money to the account.
     *
     * Steps:
     * 1. Find the account using the logged-in user's email
     * 2. Verify the PIN
     * 3. Add the amount to the balance
     * 4. Save the updated account
     * 5. Record the transaction
     *
     * @Transactional = if step 5 fails, step 4 is rolled back (atomicity)
     */
    @Transactional
    public Map<String, Object> deposit(String email, TransactionRequest request) {
        Account account = getAccountByEmail(email);

        // Check account is not frozen
        if ("FROZEN".equals(account.getStatus())) {
            throw new RuntimeException("Your account is frozen. Please contact the bank.");
        }

        // Verify PIN
        if (!passwordEncoder.matches(request.getPin(), account.getPin())) {
            throw new RuntimeException("Invalid PIN. Please try again.");
        }

        // Validate amount
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Deposit amount must be greater than ₹0.");
        }

        // Update balance
        BigDecimal newBalance = account.getBalance().add(request.getAmount());
        account.setBalance(newBalance);
        accountRepository.save(account);

        // Record transaction
        Transaction transaction = Transaction.builder()
                .account(account)
                .type("DEPOSIT")
                .amount(request.getAmount())
                .balanceAfter(newBalance)
                .description("Deposit of ₹" + request.getAmount())
                .build();
        transactionRepository.save(transaction);

        log.info("Deposit of {} for account {}", request.getAmount(), account.getAccountNumber());

        return Map.of(
                "balance", newBalance,
                "message", "₹" + request.getAmount() + " deposited successfully!"
        );
    }

    /**
     * WITHDRAW - Remove money from the account.
     *
     * Steps:
     * 1. Find account
     * 2. Verify PIN
     * 3. Check sufficient balance
     * 4. Deduct amount
     * 5. Save and record transaction
     */
    @Transactional
    public Map<String, Object> withdraw(String email, TransactionRequest request) {
        Account account = getAccountByEmail(email);

        // Check account is not frozen
        if ("FROZEN".equals(account.getStatus())) {
            throw new RuntimeException("Your account is frozen. Please contact the bank.");
        }

        // Verify PIN
        if (!passwordEncoder.matches(request.getPin(), account.getPin())) {
            throw new RuntimeException("Invalid PIN. Please try again.");
        }

        // Check sufficient balance
        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance. Available balance: ₹" + account.getBalance());
        }

        // Deduct amount
        BigDecimal newBalance = account.getBalance().subtract(request.getAmount());
        account.setBalance(newBalance);
        accountRepository.save(account);

        // Record transaction
        Transaction transaction = Transaction.builder()
                .account(account)
                .type("WITHDRAWAL")
                .amount(request.getAmount())
                .balanceAfter(newBalance)
                .description("Withdrawal of ₹" + request.getAmount())
                .build();
        transactionRepository.save(transaction);

        log.info("Withdrawal of {} for account {}", request.getAmount(), account.getAccountNumber());

        return Map.of(
                "balance", newBalance,
                "message", "₹" + request.getAmount() + " withdrawn successfully!"
        );
    }

    /**
     * FAST CASH - Quick withdrawal with predefined amounts (500, 1000, 2000, 5000).
     * This is just a withdrawal with pre-set amounts. Same logic applies.
     */
    @Transactional
    public Map<String, Object> fastCash(String email, TransactionRequest request) {
        // Validate fast cash amounts (only allow predefined amounts)
        List<BigDecimal> allowedAmounts = List.of(
                new BigDecimal("500"),
                new BigDecimal("1000"),
                new BigDecimal("2000"),
                new BigDecimal("5000"),
                new BigDecimal("10000")
        );

        if (!allowedAmounts.contains(request.getAmount())) {
            throw new RuntimeException("Invalid fast cash amount. Allowed: ₹500, ₹1000, ₹2000, ₹5000, ₹10000");
        }

        // Reuse withdrawal logic
        return withdraw(email, request);
    }

    /**
     * GET MINI STATEMENT - Last 5 transactions.
     */
    public List<Transaction> getMiniStatement(String email) {
        Account account = getAccountByEmail(email);
        // PageRequest.of(0, 5) = page 0, size 5 = first 5 results
        return transactionRepository.findByAccountOrderByCreatedAtDesc(
                account, PageRequest.of(0, 5)
        );
    }

    /**
     * GET FULL TRANSACTION HISTORY - All transactions.
     */
    public List<Transaction> getTransactionHistory(String email) {
        Account account = getAccountByEmail(email);
        return transactionRepository.findByAccountOrderByCreatedAtDesc(account);
    }

    /**
     * CHANGE PIN - Update the account's ATM PIN.
     *
     * Steps:
     * 1. Find account
     * 2. Verify current PIN
     * 3. Hash new PIN with BCrypt
     * 4. Save
     */
    @Transactional
    public void changePin(String email, ChangePinRequest request) {
        Account account = getAccountByEmail(email);

        // Verify current PIN
        if (!passwordEncoder.matches(request.getCurrentPin(), account.getPin())) {
            throw new RuntimeException("Current PIN is incorrect. Please try again.");
        }

        // Ensure new PIN is different from old PIN
        if (request.getCurrentPin().equals(request.getNewPin())) {
            throw new RuntimeException("New PIN must be different from current PIN.");
        }

        // Hash and save new PIN
        account.setPin(passwordEncoder.encode(request.getNewPin()));
        accountRepository.save(account);

        log.info("PIN changed for account: {}", account.getAccountNumber());
    }

    /**
     * GET ACCOUNT DETAILS - Full account info for profile page.
     */
    public Account getAccountDetails(String email) {
        return getAccountByEmail(email);
    }

    // ===== PRIVATE HELPER =====

    /**
     * Helper: Find account by the logged-in user's email.
     * Used by all methods above to get the current user's account.
     */
    private Account getAccountByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return accountRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }
}
