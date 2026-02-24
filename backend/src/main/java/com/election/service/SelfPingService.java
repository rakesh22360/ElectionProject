package com.election.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SelfPingService {

    private static final Logger logger = LoggerFactory.getLogger(SelfPingService.class);
    private final RestTemplate restTemplate;

    @Value("${RENDER_EXTERNAL_URL:http://localhost:${server.port:8080}}")
    private String selfUrl;

    public SelfPingService() {
        this.restTemplate = new RestTemplate();
    }

    // Ping every 14 minutes (840000 ms) to keep Render alive
    @Scheduled(fixedRate = 840000)
    public void pingSelf() {
        try {
            String pingUrl = selfUrl + "/api/health";
            logger.info("Pinging self to prevent sleep: {}", pingUrl);
            String response = restTemplate.getForObject(pingUrl, String.class);
            logger.info("Ping response: {}", response);
        } catch (Exception e) {
            logger.error("Failed to ping self: {}", e.getMessage());
        }
    }
}
