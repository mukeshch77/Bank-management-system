CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL PRIMARY KEY,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(15),
    address     VARCHAR(255),
    role        VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
    created_at  TIMESTAMP,
    updated_at  TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accounts (
    id              BIGSERIAL PRIMARY KEY,
    account_number  VARCHAR(20) NOT NULL UNIQUE,
    balance         DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    pin             VARCHAR(255) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    account_type    VARCHAR(20) NOT NULL DEFAULT 'SAVINGS',
    created_at      TIMESTAMP,
    user_id         BIGINT NOT NULL,
    CONSTRAINT fk_account_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
    id              BIGSERIAL PRIMARY KEY,
    type            VARCHAR(20) NOT NULL,
    amount          DECIMAL(15, 2) NOT NULL,
    balance_after   DECIMAL(15, 2),
    description     VARCHAR(255),
    created_at      TIMESTAMP,
    account_id      BIGINT NOT NULL,
    CONSTRAINT fk_transaction_account
        FOREIGN KEY (account_id)
        REFERENCES accounts(id)
        ON DELETE CASCADE
);

INSERT INTO users (first_name, last_name, email, password, phone, address, role, created_at, updated_at)
VALUES (
    'Admin', 'User', 'admin@bank.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    '9999999999', 'Bank Headquarters, Mumbai', 'ADMIN', NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO users (first_name, last_name, email, password, phone, address, role, created_at, updated_at)
VALUES (
    'John', 'Doe', 'john@example.com',
    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
    '9876543210', '123 Main Street, Bangalore', 'CUSTOMER', NOW(), NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO accounts (account_number, balance, pin, status, account_type, created_at, user_id)
SELECT '1234567890', 50000.00,
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ACTIVE', 'SAVINGS', NOW(), id
FROM users WHERE email = 'john@example.com'
ON CONFLICT (account_number) DO NOTHING;