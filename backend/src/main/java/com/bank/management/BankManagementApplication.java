package com.bank.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * BankManagementApplication - The starting point of our Spring Boot application.
 *
 * @SpringBootApplication is a shortcut for 3 annotations:
 *   1. @Configuration      - This class can define Spring beans
 *   2. @EnableAutoConfiguration - Spring Boot auto-configures itself based on what's on the classpath
 *   3. @ComponentScan      - Scans all classes in this package and sub-packages for annotations
 *
 * When you run this class, Spring Boot:
 *   1. Starts an embedded Tomcat server on port 8080
 *   2. Connects to MySQL using settings in application.properties
 *   3. Creates all database tables automatically (because ddl-auto=update)
 *   4. Makes all REST APIs available
 */
@SpringBootApplication
public class BankManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(BankManagementApplication.class, args);
        System.out.println("✅ Bank Management System started on http://localhost:8080");
    }
}
