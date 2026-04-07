package com.election.controller;

import com.election.dto.CaptchaResponse;
import com.election.service.CaptchaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class CaptchaController {

    private final CaptchaService captchaService;

    public CaptchaController(CaptchaService captchaService) {
        this.captchaService = captchaService;
    }

    @GetMapping("/captcha")
    public ResponseEntity<CaptchaResponse> generateCaptcha() {
        return ResponseEntity.ok(captchaService.generateMathCaptcha());
    }
}
