package com.bank.management.repository;

import com.bank.management.entity.Account;
import com.bank.management.entity.Transaction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * TransactionRepository - Database operations for Transaction entity.
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    /**
     * Get ALL transactions for a given account, newest first.
     *
     * Translates to:
     * SELECT * FROM transactions WHERE account_id = ?
     * ORDER BY created_at DESC
     *
     * Used for full transaction history page.
     */
    List<Transaction> findByAccountOrderByCreatedAtDesc(Account account);

    /**
     * Get only the LAST 5 transactions for mini-statement.
     *
     * Pageable allows us to pass in "give me only the top 5" instruction.
     * Example call: findTop5ByAccountOrderByCreatedAtDesc(account, PageRequest.of(0, 5))
     *
     * Translates to:
     * SELECT * FROM transactions WHERE account_id = ?
     * ORDER BY created_at DESC LIMIT 5
     */
    List<Transaction> findByAccountOrderByCreatedAtDesc(Account account, Pageable pageable);

    /**
     * Count total number of transactions across ALL accounts.
     * Used in Admin Dashboard.
     */
    long count();
}
