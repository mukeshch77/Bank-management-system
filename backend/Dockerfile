# ================================
# Stage 1: Build karo Maven se
# ================================
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Working directory set karo
WORKDIR /app

# pom.xml copy karo pehle (dependencies cache ke liye)
COPY pom.xml .

# Dependencies download karo
RUN mvn dependency:go-offline -B

# Poora source code copy karo
COPY src ./src

# Build karo (tests skip karo - faster)
RUN mvn clean package -DskipTests

# ================================
# Stage 2: Run karo
# ================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Build se JAR file copy karo
COPY --from=build /app/target/management-1.0.0.jar app.jar

# Port expose karo
EXPOSE 8080

# App start karo
ENTRYPOINT ["java", "-jar", "app.jar"]