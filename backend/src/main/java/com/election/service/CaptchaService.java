package com.election.service;

import com.election.dto.CaptchaResponse;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CaptchaService {

    private final Map<String, CaptchaEntry> captchaStore = new ConcurrentHashMap<>();
    private final Random random = new Random();

    private static final long CAPTCHA_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

    public CaptchaResponse generateMathCaptcha() {
        // Clean up expired entries
        cleanExpired();

        int a = random.nextInt(20) + 1;  // 1-20
        int b = random.nextInt(20) + 1;  // 1-20

        String question;
        int answer;

        int operation = random.nextInt(3);
        switch (operation) {
            case 0: // Addition
                question = a + " + " + b + " = ?";
                answer = a + b;
                break;
            case 1: // Subtraction (ensure positive result)
                if (a < b) { int tmp = a; a = b; b = tmp; }
                question = a + " - " + b + " = ?";
                answer = a - b;
                break;
            case 2: // Multiplication (smaller numbers)
                a = random.nextInt(9) + 2;  // 2-10
                b = random.nextInt(9) + 2;  // 2-10
                question = a + " × " + b + " = ?";
                answer = a * b;
                break;
            default:
                question = a + " + " + b + " = ?";
                answer = a + b;
        }

        String captchaId = UUID.randomUUID().toString();
        captchaStore.put(captchaId, new CaptchaEntry(answer, System.currentTimeMillis()));

        return new CaptchaResponse(captchaId, question);
    }

    public boolean verifyCaptcha(String captchaToken) {
        if (captchaToken == null || captchaToken.isEmpty()) {
            return false;
        }

        // Parse the token format: "captchaId:answer"
        String[] parts = captchaToken.split(":");
        if (parts.length != 2) {
            return false;
        }

        String captchaId = parts[0];
        int userAnswer;
        try {
            userAnswer = Integer.parseInt(parts[1].trim());
        } catch (NumberFormatException e) {
            return false;
        }

        CaptchaEntry entry = captchaStore.remove(captchaId);
        if (entry == null) {
            return false;
        }

        // Check expiry
        if (System.currentTimeMillis() - entry.createdAt > CAPTCHA_EXPIRY_MS) {
            return false;
        }

        return entry.answer == userAnswer;
    }

    private void cleanExpired() {
        long now = System.currentTimeMillis();
        captchaStore.entrySet().removeIf(e -> now - e.getValue().createdAt > CAPTCHA_EXPIRY_MS);
    }

    private static class CaptchaEntry {
        final int answer;
        final long createdAt;

        CaptchaEntry(int answer, long createdAt) {
            this.answer = answer;
            this.createdAt = createdAt;
        }
    }
}
