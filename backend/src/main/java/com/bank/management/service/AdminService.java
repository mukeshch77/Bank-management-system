package com.bank.management.service;

import com.bank.management.entity.Account;
import com.bank.management.entity.Transaction;
import com.bank.management.entity.User;
import com.bank.management.repository.AccountRepository;
import com.bank.management.repository.TransactionRepository;
import com.bank.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AdminService - Business logic for Admin operations.
 *
 * Only users with ROLE_ADMIN can access the AdminController which calls these methods.
 * The role check happens at the controller level via Spring Security.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    /**
     * Get ALL customers (users with role = CUSTOMER).
     * Returns list of all users in the system.
     */
    public List<User> getAllCustomers() {
        return userRepository.findAll().stream()
                .filter(u -> "CUSTOMER".equals(u.getRole()))
                .toList();
    }

    /**
     * Get ALL transactions across all accounts.
     * For admin dashboard to monitor all money movement.
     */
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }

    /**
     * FREEZE ACCOUNT - Prevent a user from doing any transactions.
     * Admin uses this to suspend suspicious accounts.
     */
    @Transactional
    public void freezeAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Account not found for user ID: " + userId));

        account.setStatus("FROZEN");
        accountRepository.save(account);
        log.info("Account frozen for user: {}", user.getEmail());
    }

    /**
     * ACTIVATE ACCOUNT - Re-enable a frozen account.
     */
    @Transactional
    public void activateAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Account not found for user ID: " + userId));

        account.setStatus("ACTIVE");
        accountRepository.save(account);
        log.info("Account activated for user: {}", user.getEmail());
    }

    /**
     * DELETE USER - Remove a customer and their account from the system.
     *
     * @Transactional ensures both user and account are deleted together.
     * If one fails, the other is rolled back.
     *
     * NOTE: In a real bank, you'd never delete; you'd just mark as CLOSED.
     * We delete here for simplicity.
     */
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Delete transactions first (foreign key constraint)
        accountRepository.findByUser(user).ifPresent(account -> {
            List<Transaction> transactions = transactionRepository.findByAccountOrderByCreatedAtDesc(account);
            transactionRepository.deleteAll(transactions);
            accountRepository.delete(account);
        });

        userRepository.delete(user);
        log.info("User deleted: {}", user.getEmail());
    }

    /**
     * DASHBOARD STATS - Summary numbers for admin dashboard.
     * Returns: total customers, total transactions, total deposits, total withdrawals.
     */
    public Map<String, Object> getDashboardStats() {
        long totalCustomers = userRepository.findAll().stream()
                .filter(u -> "CUSTOMER".equals(u.getRole()))
                .count();

        List<Transaction> allTransactions = transactionRepository.findAll();

        BigDecimal totalDeposits = allTransactions.stream()
                .filter(t -> "DEPOSIT".equals(t.getType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalWithdrawals = allTransactions.stream()
                .filter(t -> "WITHDRAWAL".equals(t.getType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCustomers", totalCustomers);
        stats.put("totalTransactions", allTransactions.size());
        stats.put("totalDeposits", totalDeposits);
        stats.put("totalWithdrawals", totalWithdrawals);

        return stats;
    }

    /**
     * GET USER DETAILS - Find a specific user by ID (for admin to view details).
     */
    public Map<String, Object> getUserDetails(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Map<String, Object> details = new HashMap<>();
        details.put("user", user);
        details.put("account", account);
        return details;
    }
}
