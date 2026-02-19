package com.election.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ElectionRequest {
    @NotBlank
    private String name;
    private String description;
    @NotNull
    private LocalDate electionDate;
    @NotBlank
    private String region;
    private String status;
    private int totalRegisteredVoters;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getElectionDate() {
        return electionDate;
    }

    public void setElectionDate(LocalDate electionDate) {
        this.electionDate = electionDate;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getTotalRegisteredVoters() {
        return totalRegisteredVoters;
    }

    public void setTotalRegisteredVoters(int totalRegisteredVoters) {
        this.totalRegisteredVoters = totalRegisteredVoters;
    }
}
