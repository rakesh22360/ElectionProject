package com.election;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ElectionMonitoringApplication {
    public static void main(String[] args) {
        SpringApplication.run(ElectionMonitoringApplication.class, args);
    }
}
