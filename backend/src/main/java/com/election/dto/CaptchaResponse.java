package com.election.dto;

public class CaptchaResponse {
    private String captchaId;
    private String question;

    public CaptchaResponse() {}

    public CaptchaResponse(String captchaId, String question) {
        this.captchaId = captchaId;
        this.question = question;
    }

    public String getCaptchaId() { return captchaId; }
    public void setCaptchaId(String captchaId) { this.captchaId = captchaId; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
}
