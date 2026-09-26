package com.bank.management.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * User Entity - Represents a row in the 'users' table in MySQL.
 *
 * @Entity tells JPA this class should be stored in the database.
 * @Table(name = "users") maps this class to the 'users' table.
 *
 * Lombok annotations used:
 * @Data          = generates getters, setters, toString, equals, hashCode
 * @Builder       = allows User.builder().email("x").build() pattern
 * @NoArgsConstructor = generates empty constructor (required by JPA)
 * @AllArgsConstructor = generates constructor with all fields
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    // PRIMARY KEY - auto-incremented by MySQL
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Personal Information
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    // UNIQUE means no two users can have the same email
    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    // Password stored as BCrypt hash (never plain text)
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "address", length = 255)
    private String address;

    // Role determines if this person is CUSTOMER or ADMIN
    @Column(name = "role", nullable = false, length = 20)
    private String role; // "CUSTOMER" or "ADMIN"

    // Timestamps - automatically set when user is created/updated
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * @PrePersist runs BEFORE inserting a new row into the database.
     * We use it to automatically set createdAt and updatedAt.
     */
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * @PreUpdate runs BEFORE updating an existing row.
     * We use it to keep updatedAt current.
     */
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
