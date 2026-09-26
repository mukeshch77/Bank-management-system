# 🏦 Bank Management System

A full-stack web application built with **Spring Boot** (backend) and **React** (frontend), backed by **MySQL**. Designed to be beginner-friendly with clean, well-commented code perfect for learning and fresher interviews.

---

## ✨ Features

### Customer
- 🔐 3-step Signup & Login with JWT authentication
- 💰 Balance Enquiry (with show/hide toggle)
- ⬆️ Deposit Money (with PIN verification)
- ⬇️ Withdraw Money (with PIN verification)
- ⚡ Fast Cash (instant withdraw: ₹500 / ₹1000 / ₹2000 / ₹5000 / ₹10000)
- 📋 Transaction History (filterable by type)
- 👤 View & Edit Profile
- 🔑 Change ATM PIN

### Admin
- 🛡️ Secure admin login (same login page, different role)
- 📊 Dashboard with stats (customers, transactions, deposits, withdrawals)
- 👥 View & search all customers
- 🗑️ Delete customer accounts
- 📈 View all transactions across all accounts

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router v6, Axios, Bootstrap 5 |
| Backend | Java 21, Spring Boot 3, Spring Security, Spring Data JPA |
| Database | MySQL 8 |
| Auth | JWT (JSON Web Tokens), BCrypt |
| Build Tool | Maven (backend), Vite (frontend) |

---

## 📁 Project Structure

```
bank-management-system/
├── backend/
│   ├── src/main/java/com/bank/management/
│   │   ├── BankManagementApplication.java   ← Entry point
│   │   ├── config/
│   │   │   ├── JwtService.java              ← JWT create/verify
│   │   │   ├── JwtAuthFilter.java           ← Filter for every request
│   │   │   ├── SecurityConfig.java          ← Route protection rules
│   │   │   └── CorsConfig.java              ← Allow React to call backend
│   │   ├── controller/
│   │   │   ├── AuthController.java          ← /api/auth/*
│   │   │   ├── AccountController.java       ← /api/account/*
│   │   │   ├── AdminController.java         ← /api/admin/*
│   │   │   └── UserController.java          ← /api/user/*
│   │   ├── service/
│   │   │   ├── AuthService.java             ← Signup/Login logic
│   │   │   ├── AccountService.java          ← Banking operations
│   │   │   └── AdminService.java            ← Admin operations
│   │   ├── entity/
│   │   │   ├── User.java                    ← users table
│   │   │   ├── Account.java                 ← accounts table
│   │   │   └── Transaction.java             ← transactions table
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── AccountRepository.java
│   │   │   └── TransactionRepository.java
│   │   ├── dto/
│   │   │   ├── SignupRequest.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   ├── TransactionRequest.java
│   │   │   ├── ChangePinRequest.java
│   │   │   └── ApiResponse.java
│   │   └── exception/
│   │       └── GlobalExceptionHandler.java
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/
│   └── src/
│       ├── App.jsx                          ← Routes setup
│       ├── context/AuthContext.jsx          ← Global auth state
│       ├── services/
│       │   ├── api.js                       ← Axios config + interceptors
│       │   ├── authService.js
│       │   ├── accountService.js
│       │   └── adminService.js
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Signup.jsx                   ← 3-step form
│       │   ├── Dashboard.jsx
│       │   ├── Transaction.jsx              ← Deposit + Withdraw
│       │   ├── CustomerPages.jsx            ← Balance, FastCash, ChangePin, History, Profile
│       │   └── AdminPages.jsx               ← AdminDashboard, ManageUsers, AdminTransactions
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   └── Layout.jsx
│       └── routes/ProtectedRoute.jsx
│
└── database/
    └── schema.sql                           ← DB schema + sample data
```

---

## 🚀 Getting Started (Setup Guide)

### Prerequisites

| Tool | Download |
|------|----------|
| Java 21 JDK | https://adoptium.net/ |
| Maven | https://maven.apache.org/download.cgi (or use IntelliJ built-in) |
| MySQL 8 | https://dev.mysql.com/downloads/mysql/ |
| Node.js 18+ | https://nodejs.org/ |
| IntelliJ IDEA | https://www.jetbrains.com/idea/download/ |
| VS Code | https://code.visualstudio.com/ (for frontend) |

---

### Step 1: Set Up MySQL Database

1. Open **MySQL Workbench** or MySQL command line
2. Run the SQL file:

```sql
-- Option A: Via MySQL Workbench
-- File → Open SQL Script → select database/schema.sql → Run All

-- Option B: Via command line
mysql -u root -p < database/schema.sql
```

This creates the `bank_db` database with sample admin and customer users.

**Sample login credentials:**
- Admin: `admin@bank.com` / `admin123` / PIN: `1234`
- Customer: `john@example.com` / `password123` / PIN: `1234`

---

### Step 2: Configure the Backend

Open `backend/src/main/resources/application.properties`:

```properties
# Change this to YOUR MySQL password
spring.datasource.password=your_mysql_password_here
```

---

### Step 3: Run the Spring Boot Backend

**Option A: IntelliJ IDEA**
1. Open the `backend` folder in IntelliJ
2. Wait for Maven to download dependencies (bottom progress bar)
3. Open `BankManagementApplication.java`
4. Click the ▶️ green Run button

**Option B: Terminal / Command Line**
```bash
cd backend
mvn spring-boot:run
```

✅ You should see: `Bank Management System started on http://localhost:8080`

---

### Step 4: Run the React Frontend

```bash
# Navigate to frontend folder
cd frontend

# Install all npm packages (first time only)
npm install

# Start the development server
npm run dev
```

✅ Open your browser at: `http://localhost:5173`

---

### Step 5: Test the Application

1. Open `http://localhost:5173`
2. Click **"Create Account"** → Complete 3-step signup
3. Or use demo credentials:
   - Customer: `john@example.com` / `password123`
   - Admin: `admin@bank.com` / `admin123`

---

## 🌐 REST API Reference

All endpoints return this standard format:
```json
{
  "success": true,
  "message": "Operation message",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00"
}
```

### Authentication (No JWT needed)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user + create account |
| POST | `/api/auth/login` | Login and get JWT token |

### Account Operations (JWT required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/account/balance` | Get current balance |
| GET | `/api/account/details` | Get full account details |
| POST | `/api/account/deposit` | Deposit money |
| POST | `/api/account/withdraw` | Withdraw money |
| POST | `/api/account/fast-cash` | Fast cash (predefined amounts) |
| GET | `/api/account/mini-statement` | Last 5 transactions |
| GET | `/api/account/transactions` | Full transaction history |
| PUT | `/api/account/change-pin` | Change ATM PIN |

### User Profile (JWT required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get logged-in user's profile |
| PUT | `/api/user/profile` | Update phone and address |

### Admin (JWT + ADMIN role required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard statistics |
| GET | `/api/admin/users` | All customers |
| DELETE | `/api/admin/users/{id}` | Delete a user |
| PUT | `/api/admin/users/{id}/freeze` | Freeze account |
| PUT | `/api/admin/users/{id}/activate` | Activate account |
| GET | `/api/admin/transactions` | All transactions |

### Testing with Postman

1. Download Postman: https://www.postman.com/downloads/
2. **Login first**: POST `http://localhost:8080/api/auth/login`
   ```json
   { "email": "john@example.com", "password": "password123" }
   ```
3. Copy the `token` from the response
4. For protected routes, add header: `Authorization: Bearer <paste_token_here>`

---

## ☁️ Deployment Guide

### Database: Railway MySQL (Free)
1. Go to https://railway.app → Sign up
2. New Project → Add MySQL
3. Click MySQL service → Variables tab → Copy `DATABASE_URL`
4. Extract host, port, username, password, database name from it

### Backend: Render (Free)
1. Push your backend to GitHub
2. Go to https://render.com → Sign up → New Web Service
3. Connect your GitHub repo
4. Set these:
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/management-1.0.0.jar`
5. Add Environment Variables:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://<railway-host>:<port>/<db>
   SPRING_DATASOURCE_USERNAME=<railway-user>
   SPRING_DATASOURCE_PASSWORD=<railway-password>
   APP_JWT_SECRET=YourVeryLongSecretKeyForProductionUse
   ```

### Frontend: Vercel (Free)
1. Push your frontend to GitHub
2. Go to https://vercel.com → Sign up → New Project
3. Import your frontend folder
4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. Click Deploy!

---

## 🔧 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Access denied for user 'root'@'localhost'` | Wrong MySQL password in `application.properties` |
| `Communications link failure` | MySQL not running. Start MySQL service |
| `Port 8080 already in use` | Change `server.port=8081` in properties |
| `CORS error` in browser | Check `CorsConfig.java` has your React URL |
| `401 Unauthorized` | JWT token expired. Log out and log in again |
| `npm install` fails | Delete `node_modules` folder and run again |
| Tables not created | Ensure `ddl-auto=update` in properties and DB exists |

---

## 🎓 Top 30 Interview Questions

### About the Project

**Q1: Explain this project in simple terms.**
> "I built a Bank Management System where customers can sign up, log in, deposit/withdraw money, view their balance and transaction history, and change their PIN. Admins can view all users and transactions, and delete or manage accounts. The backend is Spring Boot with JWT security, and the frontend is React with Bootstrap."

**Q2: What is the flow when a user logs in?**
> "User submits email + password → Spring's AuthenticationManager verifies credentials against BCrypt hash in DB → If correct, we generate a JWT token → Token is returned to React → React stores it in localStorage → Every future request includes the token in the Authorization header → JwtAuthFilter validates it on every request."

**Q3: How does JWT authentication work?**
> "JWT (JSON Web Token) is a self-contained token that proves the user is authenticated. When a user logs in, we create a token signed with a secret key, embedding their email. The frontend sends this token with every request. The backend verifies the signature and extracts the email — no database lookup needed to verify identity."

**Q4: Why did you use BCrypt for passwords?**
> "BCrypt is a slow, adaptive hashing algorithm designed specifically for passwords. It automatically adds a random salt, so even if two users have the same password, their hashes are different. The slowness prevents brute-force attacks. Plain MD5/SHA is too fast and unsafe."

**Q5: What is the difference between @RestController and @Controller?**
> "@Controller returns views (HTML pages). @RestController = @Controller + @ResponseBody, which means every method automatically converts its return value to JSON. We use @RestController for REST APIs."

### Spring Boot Questions

**Q6: What is Spring Boot Auto-Configuration?**
> "Spring Boot automatically configures beans based on what's on the classpath. For example, if it sees `mysql-connector-j` in dependencies, it auto-configures a DataSource. We don't need to write `@Bean DataSource ds = new DataSource(...)` manually."

**Q7: What is @Transactional?**
> "It marks a method as a database transaction. If anything fails inside the method, all database changes made so far are rolled back. For example, in deposit(), if saving the Transaction fails after updating the balance, the balance update is also rolled back."

**Q8: What is the difference between @Entity and DTO?**
> "@Entity maps directly to a database table and is managed by JPA. DTO (Data Transfer Object) is a simple class used to transfer data between layers. We never expose entities directly in APIs — DTOs give us control over what data goes in/out and allow validation annotations."

**Q9: What is JpaRepository and what does it give us?**
> "JpaRepository is a Spring Data interface that provides ready-made CRUD operations: save(), findById(), findAll(), deleteById(), count(), etc. We extend it and Spring generates the implementation automatically. We can also declare custom query methods using naming conventions like findByEmail()."

**Q10: What is @OneToOne in JPA?**
> "It defines a one-to-one relationship between two entities. In our project, one User has one Account. @JoinColumn creates a foreign key column user_id in the accounts table pointing to users.id."

### React Questions

**Q11: What is Context API?**
> "Context API allows sharing state across all components without passing props manually through every level. We use AuthContext to share the logged-in user's info and JWT token across all components."

**Q12: What is useEffect and when does it run?**
> "useEffect runs after the component renders. The dependency array controls when it re-runs. useEffect(() => {...}, []) runs once when the component mounts, like componentDidMount. We use it to fetch data from the backend when a page loads."

**Q13: What is a ProtectedRoute?**
> "A component that checks if the user is logged in before rendering a page. If not logged in, it redirects to /login. This prevents unauthenticated access to pages like Dashboard or Deposit."

**Q14: How does Axios interceptor work?**
> "An interceptor is a function that runs before every request or after every response. Our request interceptor reads the JWT from localStorage and adds it to the Authorization header automatically, so we don't have to add it manually to every API call."

**Q15: What is React Router?**
> "React Router enables navigation between pages without full page reloads. It maps URL paths to components: /login → Login component, /dashboard → Dashboard component. This is called client-side routing."

### Database Questions

**Q16: Why use BigDecimal for money and not double?**
> "Floating-point numbers (double/float) can't represent all decimal fractions precisely. 0.1 + 0.2 = 0.30000000000000004 in double. For money, we need exact precision. BigDecimal provides arbitrary-precision arithmetic."

**Q17: What is @PrePersist?**
> "A JPA lifecycle callback that runs before an entity is saved for the first time (INSERT). We use it to automatically set createdAt and default values like status='ACTIVE'."

**Q18: What is the role of ON DELETE CASCADE?**
> "If a User is deleted, CASCADE automatically deletes their Account and Transactions too. Without it, deleting a User would fail because the accounts table still has a foreign key reference to that user."

**Q19: What is a foreign key?**
> "A column in one table that references the primary key of another table, creating a link between them. In our schema, accounts.user_id is a foreign key referencing users.id. This ensures every account belongs to an existing user."

**Q20: What is ddl-auto=update?**
> "Hibernate automatically creates or alters database tables based on your entity classes. In development, this is convenient. In production, we should use 'validate' (just checks) or 'none' (no changes) and manage schema with migration tools like Flyway."

### Security Questions

**Q21: What is CORS and why do we need it?**
> "Cross-Origin Resource Sharing. Browsers block JavaScript from making requests to a different domain by default. React runs on localhost:5173 and Spring Boot on localhost:8080 — different ports = different origins. Our CorsConfig tells the browser 'it's OK for localhost:5173 to call this server'."

**Q22: What is Spring Security?**
> "A framework that handles authentication (who are you?) and authorization (what can you do?). We configure it in SecurityConfig to protect routes, requiring JWT for most endpoints and allowing /api/auth/** publicly."

**Q23: Why is CSRF disabled?**
> "CSRF attacks exploit browser-managed sessions (cookies). Since we use JWT tokens (not cookies/sessions), we're not vulnerable to CSRF. Disabling it simplifies our stateless REST API."

**Q24: What is role-based access control?**
> "Different users have different permissions based on their role. CUSTOMER can access banking features. ADMIN can access admin features. Spring Security enforces this with .hasRole('ADMIN') on admin routes."

**Q25: Where is the password stored and how is it verified?**
> "The BCrypt hash is stored in the database. During login, Spring's DaoAuthenticationProvider calls passwordEncoder.matches(rawPassword, storedHash). BCrypt is designed so this comparison is slow and secure."

### General Java/Architecture Questions

**Q26: What is the Controller → Service → Repository pattern?**
> "A layered architecture. Controller handles HTTP (routing, request parsing). Service contains business logic. Repository handles database access. Each layer has one responsibility. Controller calls Service, Service calls Repository. This makes code testable and maintainable."

**Q27: What is Lombok and why use it?**
> "Lombok generates repetitive code at compile time via annotations. @Data generates getters, setters, toString, equals, hashCode. @Builder generates a builder pattern. @RequiredArgsConstructor generates constructor for final fields. This reduces boilerplate significantly."

**Q28: What is Optional<T> in Java?**
> "Optional is a container that either holds a value or is empty. It forces you to handle the 'not found' case explicitly instead of risking NullPointerException. findByEmail() returns Optional<User> — we call .orElseThrow() to get the user or throw an exception if not found."

**Q29: What is Maven?**
> "A build tool for Java projects. pom.xml lists all project dependencies. Maven downloads them from the internet (Maven Central) and compiles, tests, and packages the application. `mvn spring-boot:run` compiles and starts the Spring Boot application."

**Q30: How would you improve this project?**
> "Great follow-up question! I'd add: (1) Email verification on signup, (2) Transaction receipts/PDF download, (3) Money transfer between accounts, (4) Forgot password via email OTP, (5) Redis for token blacklisting on logout, (6) Unit tests with JUnit and Mockito, (7) Docker for easy deployment, (8) More robust input validation, (9) Pagination for large transaction lists."

---

## 🔮 Future Improvements

- [ ] Email verification on signup
- [ ] Forgot password with OTP
- [ ] Money transfer between accounts
- [ ] PDF mini statement download
- [ ] Interest calculation for savings accounts
- [ ] Notification system (email/SMS)
- [ ] Unit tests (JUnit + Mockito)
- [ ] API rate limiting
- [ ] Docker + Docker Compose
- [ ] CI/CD with GitHub Actions

---

## 📸 Screenshots

_(Add screenshots here after running the application)_

| Page | Screenshot |
|------|-----------|
| Login | _(placeholder)_ |
| Signup (3-step) | _(placeholder)_ |
| Customer Dashboard | _(placeholder)_ |
| Deposit | _(placeholder)_ |
| Admin Dashboard | _(placeholder)_ |
| Manage Users | _(placeholder)_ |

---

## 📄 License

This project is for learning and portfolio purposes.

---

*Built with ❤️ using Spring Boot + React — perfect for Java Full Stack Developer interviews*
