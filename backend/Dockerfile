# Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
# Description: Multi-stage Dockerfile for BuildPilot AI Pro Spring Boot backend

FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline -B || true
COPY src/ src/
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
EXPOSE 8080
COPY --from=builder /app/target/buildpilot-api-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
