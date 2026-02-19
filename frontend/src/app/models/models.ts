export interface User {
    id: number;
    username: string;
    fullName: string;
    email: string;
    role: string;
    enabled: boolean;
    createdAt: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    fullName: string;
    email: string;
    password: string;
    role: string;
}

export interface JwtResponse {
    token: string;
    type: string;
    id: number;
    username: string;
    fullName: string;
    email: string;
    role: string;
}

export interface Election {
    id: number;
    name: string;
    description: string;
    electionDate: string;
    status: string;
    region: string;
    totalRegisteredVoters: number;
    candidates: Candidate[];
    createdAt: string;
    updatedAt: string;
}

export interface Candidate {
    id: number;
    name: string;
    party: string;
    manifesto: string;
    photoUrl: string;
}

export interface ElectionResult {
    candidateId: number;
    candidateName: string;
    party: string;
    voteCount: number;
    percentage: number;
}

export interface Report {
    id: number;
    title: string;
    content: string;
    type: string;
    election: Election;
    createdBy: User;
    createdAt: string;
}

export interface Anomaly {
    id: number;
    description: string;
    severity: string;
    status: string;
    location: string;
    election: Election;
    reportedBy: User;
    createdAt: string;
    resolvedAt: string;
}

export interface Discussion {
    id: number;
    title: string;
    content: string;
    election: Election;
    user: User;
    replies: Discussion[];
    createdAt: string;
}

export interface DashboardStats {
    totalElections: number;
    activeElections: number;
    totalVotesCast: number;
    totalUsers: number;
    totalAnomalies: number;
    pendingAnomalies: number;
    totalReports: number;
    totalDiscussions: number;
}
