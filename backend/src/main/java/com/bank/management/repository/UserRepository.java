package com.bank.management.repository;

import com.bank.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository - Interface for all database operations on the User entity.
 *
 * We extend JpaRepository<User, Long> which means:
 *   - User = the entity class we're working with
 *   - Long = the type of the primary key (id field in User)
 *
 * By extending JpaRepository, we automatically get these methods FOR FREE:
 *   - save(user)           → INSERT or UPDATE a user
 *   - findById(id)         → SELECT * FROM users WHERE id = ?
 *   - findAll()            → SELECT * FROM users
 *   - deleteById(id)       → DELETE FROM users WHERE id = ?
 *   - count()              → SELECT COUNT(*) FROM users
 *   - existsById(id)       → true if user exists
 *
 * We also write CUSTOM methods below using Spring's "method name magic":
 * Spring reads the method name and automatically generates the SQL query!
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Spring Data JPA translates this method name to:
     * SELECT * FROM users WHERE email = ? LIMIT 1
     *
     * Optional<User> means: either a User is returned, or nothing (empty Optional).
     * This is safer than returning null, which can cause NullPointerException.
     */
    Optional<User> findByEmail(String email);

    /**
     * Translates to: SELECT COUNT(*) > 0 FROM users WHERE email = ?
     * Returns true if a user with this email already exists.
     * Used during signup to prevent duplicate accounts.
     */
    boolean existsByEmail(String email);
}
