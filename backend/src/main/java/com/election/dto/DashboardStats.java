package com.election.dto;

public class DashboardStats {
    private long totalElections;
    private long activeElections;
    private long totalVotesCast;
    private long totalUsers;
    private long totalAnomalies;
    private long pendingAnomalies;
    private long totalReports;
    private long totalDiscussions;

    public DashboardStats() {
    }

    public DashboardStats(long totalElections, long activeElections, long totalVotesCast, long totalUsers,
            long totalAnomalies, long pendingAnomalies, long totalReports, long totalDiscussions) {
        this.totalElections = totalElections;
        this.activeElections = activeElections;
        this.totalVotesCast = totalVotesCast;
        this.totalUsers = totalUsers;
        this.totalAnomalies = totalAnomalies;
        this.pendingAnomalies = pendingAnomalies;
        this.totalReports = totalReports;
        this.totalDiscussions = totalDiscussions;
    }

    public long getTotalElections() {
        return totalElections;
    }

    public void setTotalElections(long totalElections) {
        this.totalElections = totalElections;
    }

    public long getActiveElections() {
        return activeElections;
    }

    public void setActiveElections(long activeElections) {
        this.activeElections = activeElections;
    }

    public long getTotalVotesCast() {
        return totalVotesCast;
    }

    public void setTotalVotesCast(long totalVotesCast) {
        this.totalVotesCast = totalVotesCast;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalAnomalies() {
        return totalAnomalies;
    }

    public void setTotalAnomalies(long totalAnomalies) {
        this.totalAnomalies = totalAnomalies;
    }

    public long getPendingAnomalies() {
        return pendingAnomalies;
    }

    public void setPendingAnomalies(long pendingAnomalies) {
        this.pendingAnomalies = pendingAnomalies;
    }

    public long getTotalReports() {
        return totalReports;
    }

    public void setTotalReports(long totalReports) {
        this.totalReports = totalReports;
    }

    public long getTotalDiscussions() {
        return totalDiscussions;
    }

    public void setTotalDiscussions(long totalDiscussions) {
        this.totalDiscussions = totalDiscussions;
    }
}
