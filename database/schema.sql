-- ============================================================
-- BANK MANAGEMENT SYSTEM - Database Schema
-- Run this in MySQL Workbench or MySQL command line
-- ============================================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS bank_db;

-- 2. Use the database
USE bank_db;

-- ============================================================
-- TABLE 1: users
-- Stores all user accounts (customers and admins)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,       -- BCrypt hashed
    phone       VARCHAR(15),
    address     VARCHAR(255),
    role        VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',  -- CUSTOMER or ADMIN
    created_at  DATETIME,
    updated_at  DATETIME
);

-- ============================================================
-- TABLE 2: accounts
-- Stores bank account details linked to each user
-- ============================================================
CREATE TABLE IF NOT EXISTS accounts (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_number  VARCHAR(20) NOT NULL UNIQUE,
    balance         DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    pin             VARCHAR(255) NOT NULL,   -- BCrypt hashed
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE or FROZEN
    account_type    VARCHAR(20) NOT NULL DEFAULT 'SAVINGS', -- SAVINGS or CURRENT
    created_at      DATETIME,
    user_id         BIGINT NOT NULL,

    -- Foreign Key: links account to its owner
    CONSTRAINT fk_account_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE  -- If user is deleted, their account is also deleted
);

-- ============================================================
-- TABLE 3: transactions
-- Records every deposit, withdrawal, and transfer
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    type            VARCHAR(20) NOT NULL,        -- DEPOSIT, WITHDRAWAL, TRANSFER
    amount          DECIMAL(15, 2) NOT NULL,
    balance_after   DECIMAL(15, 2),              -- Balance after this transaction
    description     VARCHAR(255),
    created_at      DATETIME,
    account_id      BIGINT NOT NULL,

    -- Foreign Key: links transaction to its account
    CONSTRAINT fk_transaction_account
        FOREIGN KEY (account_id)
        REFERENCES accounts(id)
        ON DELETE CASCADE
);

-- ============================================================
-- SAMPLE DATA
-- Insert an admin user and a sample customer for testing
--
-- IMPORTANT: Passwords are BCrypt hashed.
-- admin@bank.com password is: "admin123"
-- john@example.com password is: "password123"
-- Both PINs are: "1234"
--
-- To generate your own BCrypt hashes, use: https://bcrypt-generator.com/
-- ============================================================

-- Insert admin user
INSERT INTO users (first_name, last_name, email, password, phone, address, role, created_at, updated_at)
VALUES (
    'Admin',
    'User',
    'admin@bank.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',  -- admin123
    '9999999999',
    'Bank Headquarters, Mumbai',
    'ADMIN',
    NOW(),
    NOW()
);

-- Insert sample customer
INSERT INTO users (first_name, last_name, email, password, phone, address, role, created_at, updated_at)
VALUES (
    'John',
    'Doe',
    'john@example.com',
    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',  -- password123
    '9876543210',
    '123 Main Street, Bangalore',
    'CUSTOMER',
    NOW(),
    NOW()
);

-- Insert account for John (user_id = 2 because admin was inserted first)
INSERT INTO accounts (account_number, balance, pin, status, account_type, created_at, user_id)
VALUES (
    '1234567890',
    50000.00,
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',  -- PIN: 1234
    'ACTIVE',
    'SAVINGS',
    NOW(),
    2  -- John's user_id
);

-- Insert some sample transactions for John's account
INSERT INTO transactions (type, amount, balance_after, description, created_at, account_id)
VALUES
    ('DEPOSIT',    50000.00, 50000.00, 'Initial deposit',       NOW() - INTERVAL 30 DAY, 1),
    ('WITHDRAWAL',  5000.00, 45000.00, 'Withdrawal of ₹5000',   NOW() - INTERVAL 20 DAY, 1),
    ('DEPOSIT',    10000.00, 55000.00, 'Deposit of ₹10000',     NOW() - INTERVAL 10 DAY, 1),
    ('WITHDRAWAL',  5000.00, 50000.00, 'Withdrawal of ₹5000',   NOW() - INTERVAL 5 DAY,  1);

-- ============================================================
-- VERIFY: Check all tables
-- ============================================================
-- SELECT * FROM users;
-- SELECT * FROM accounts;
-- SELECT * FROM transactions;
