# Use an official Maven image to build the app
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
# Copy the pom.xml and source code
COPY backend/pom.xml .
COPY backend/src ./src
# Build the application
RUN mvn clean package -DskipTests

# Use an official Java runtime as a parent image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy the built jar from the build stage
COPY --from=build /app/target/election-monitoring-system-1.0.0.jar app.jar
# Expose port 8080
EXPOSE 8080
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
