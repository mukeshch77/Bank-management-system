package com.bank.management.repository;

import com.bank.management.entity.Account;
import com.bank.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * AccountRepository - Database operations for Account entity.
 *
 * Spring Data JPA gives us all CRUD operations automatically.
 * We only add custom query methods below.
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    /**
     * Find an account by its user.
     * Translates to: SELECT * FROM accounts WHERE user_id = ? LIMIT 1
     *
     * Used after login to load the user's account details.
     */
    Optional<Account> findByUser(User user);

    /**
     * Find account by account number.
     * Translates to: SELECT * FROM accounts WHERE account_number = ? LIMIT 1
     *
     * Used during transfers to find the recipient's account.
     */
    Optional<Account> findByAccountNumber(String accountNumber);

    /**
     * Check if an account number already exists in the database.
     * Used when generating a new account number to avoid duplicates.
     */
    boolean existsByAccountNumber(String accountNumber);
}
