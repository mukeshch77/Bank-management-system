package com.bank.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Account Entity - Represents a bank account in the 'accounts' table.
 *
 * Each User has ONE Account (One-to-One relationship).
 * This stores balance, account number, PIN, and account status.
 *
 * We use BigDecimal for money (never use double for money - floating point errors!)
 * Example: 0.1 + 0.2 = 0.30000000000000004 in double. BigDecimal avoids this.
 */
@Entity
@Table(name = "accounts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The unique bank account number (e.g., 1234567890)
    @Column(name = "account_number", nullable = false, unique = true, length = 20)
    private String accountNumber;

    // Account balance - BigDecimal is the correct type for money in Java
    @Column(name = "balance", nullable = false, precision = 15, scale = 2)
    private BigDecimal balance;

    // BCrypt hashed 4-digit PIN (we never store plain PIN)
    @Column(name = "pin", nullable = false)
    private String pin;

    // ACTIVE or FROZEN
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    // Account type: SAVINGS or CURRENT
    @Column(name = "account_type", nullable = false, length = 20)
    private String accountType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * @OneToOne means one User has one Account
     * @JoinColumn creates a foreign key column 'user_id' in the accounts table
     *   pointing to the users table's id column.
     *
     * FetchType.LAZY = don't load User data automatically when you fetch Account.
     * This improves performance (loads User data only when you explicitly access it).
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        // New accounts start as ACTIVE with ₹0 balance by default
        if (this.status == null) this.status = "ACTIVE";
        if (this.balance == null) this.balance = BigDecimal.ZERO;
        if (this.accountType == null) this.accountType = "SAVINGS";
    }
}
