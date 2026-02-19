import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Election, Candidate, ElectionResult, DashboardStats, Anomaly, Report, Discussion } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Elections
    getElections(): Observable<Election[]> {
        return this.http.get<Election[]>(`${this.apiUrl}/elections`);
    }

    getElection(id: number): Observable<Election> {
        return this.http.get<Election>(`${this.apiUrl}/elections/${id}`);
    }

    getElectionsByStatus(status: string): Observable<Election[]> {
        return this.http.get<Election[]>(`${this.apiUrl}/elections/status/${status}`);
    }

    createElection(election: any): Observable<Election> {
        return this.http.post<Election>(`${this.apiUrl}/elections`, election);
    }

    updateElection(id: number, election: any): Observable<Election> {
        return this.http.put<Election>(`${this.apiUrl}/elections/${id}`, election);
    }

    deleteElection(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/elections/${id}`);
    }

    // Candidates
    getCandidates(electionId: number): Observable<Candidate[]> {
        return this.http.get<Candidate[]>(`${this.apiUrl}/elections/${electionId}/candidates`);
    }

    addCandidate(electionId: number, candidate: any): Observable<Candidate> {
        return this.http.post<Candidate>(`${this.apiUrl}/elections/${electionId}/candidates`, candidate);
    }

    deleteCandidate(candidateId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/elections/candidates/${candidateId}`);
    }

    // Voting
    castVote(electionId: number, candidateId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/elections/${electionId}/vote`, { candidateId });
    }

    hasVoted(electionId: number): Observable<{ hasVoted: boolean }> {
        return this.http.get<{ hasVoted: boolean }>(`${this.apiUrl}/elections/${electionId}/has-voted`);
    }

    // Results
    getResults(electionId: number): Observable<ElectionResult[]> {
        return this.http.get<ElectionResult[]>(`${this.apiUrl}/elections/${electionId}/results`);
    }

    // Analytics
    getDashboardStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.apiUrl}/analytics/dashboard`);
    }

    getVoterTurnout(electionId: number): Observable<{ turnout: number }> {
        return this.http.get<{ turnout: number }>(`${this.apiUrl}/analytics/turnout/${electionId}`);
    }

    // Anomalies
    getAnomalies(): Observable<Anomaly[]> {
        return this.http.get<Anomaly[]>(`${this.apiUrl}/anomalies`);
    }

    getAnomaliesByElection(electionId: number): Observable<Anomaly[]> {
        return this.http.get<Anomaly[]>(`${this.apiUrl}/anomalies/election/${electionId}`);
    }

    createAnomaly(anomaly: any, electionId: number): Observable<Anomaly> {
        return this.http.post<Anomaly>(`${this.apiUrl}/anomalies?electionId=${electionId}`, anomaly);
    }

    updateAnomalyStatus(id: number, status: string): Observable<Anomaly> {
        return this.http.put<Anomaly>(`${this.apiUrl}/anomalies/${id}/status`, { status });
    }

    // Reports
    getReports(): Observable<Report[]> {
        return this.http.get<Report[]>(`${this.apiUrl}/reports`);
    }

    createReport(report: any, electionId?: number): Observable<Report> {
        const url = electionId ? `${this.apiUrl}/reports?electionId=${electionId}` : `${this.apiUrl}/reports`;
        return this.http.post<Report>(url, report);
    }

    deleteReport(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/reports/${id}`);
    }

    // Discussions
    getDiscussions(): Observable<Discussion[]> {
        return this.http.get<Discussion[]>(`${this.apiUrl}/discussions`);
    }

    getDiscussionsByElection(electionId: number): Observable<Discussion[]> {
        return this.http.get<Discussion[]>(`${this.apiUrl}/discussions/election/${electionId}`);
    }

    createDiscussion(discussion: any, electionId?: number): Observable<Discussion> {
        const url = electionId ? `${this.apiUrl}/discussions?electionId=${electionId}` : `${this.apiUrl}/discussions`;
        return this.http.post<Discussion>(url, discussion);
    }

    addReply(parentId: number, reply: any): Observable<Discussion> {
        return this.http.post<Discussion>(`${this.apiUrl}/discussions/${parentId}/replies`, reply);
    }

    deleteDiscussion(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/discussions/${id}`);
    }

    // Admin
    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/admin/users`);
    }

    toggleUser(id: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/admin/users/${id}/toggle`, {});
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/admin/users/${id}`);
    }
}
