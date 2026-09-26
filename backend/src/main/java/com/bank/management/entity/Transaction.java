package com.bank.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Transaction Entity - Records every money movement in the 'transactions' table.
 *
 * Every deposit, withdrawal, and transfer creates a new Transaction row.
 * This gives us a complete audit trail / history.
 *
 * Transaction types: DEPOSIT, WITHDRAWAL, TRANSFER
 */
@Entity
@Table(name = "transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Type of transaction: DEPOSIT, WITHDRAWAL, TRANSFER
    @Column(name = "type", nullable = false, length = 20)
    private String type;

    // Amount involved in this transaction
    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    // Balance AFTER this transaction completed (useful for mini-statement)
    @Column(name = "balance_after", precision = 15, scale = 2)
    private BigDecimal balanceAfter;

    // Human-readable description (e.g., "Deposit of ₹5000")
    @Column(name = "description", length = 255)
    private String description;

    // When did this transaction happen?
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * ManyToOne = Many transactions can belong to ONE account.
     * (One account can have many transactions over time)
     *
     * @JoinColumn creates foreign key 'account_id' in transactions table.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
