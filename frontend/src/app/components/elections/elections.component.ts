import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Election, ElectionResult } from '../../models/models';

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div style="display:flex;align-items:center;gap:12px">
          <a routerLink="/dashboard" class="back-btn">← Back</a>
          <div>
            <h1>🏛️ Elections</h1>
            <p>Browse and participate in elections</p>
          </div>
        </div>
        <div class="header-actions">
          <select [(ngModel)]="statusFilter" (change)="filterElections()" class="filter-select">
            <option value="ALL">All Elections</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div class="elections-grid">
        <div *ngFor="let e of filteredElections" class="election-card" [ngClass]="e.status.toLowerCase()">
          <div class="card-header">
            <span class="status-badge" [ngClass]="e.status.toLowerCase()">{{ e.status }}</span>
            <span class="region-tag">📍 {{ e.region }}</span>
          </div>
          <h3>{{ e.name }}</h3>
          <p class="description">{{ e.description }}</p>
          <div class="card-meta">
            <span>📅 {{ e.electionDate }}</span>
            <span>👥 {{ e.totalRegisteredVoters | number }} voters</span>
          </div>

          <!-- Candidates -->
          <div class="candidates-section" *ngIf="e.candidates && e.candidates.length > 0">
            <h4>Candidates</h4>
            <div class="candidates-list">
              <div *ngFor="let c of e.candidates" class="candidate-chip">
                <span class="candidate-name">{{ c.name }}</span>
                <span class="candidate-party">{{ c.party }}</span>
              </div>
            </div>
          </div>

          <!-- Vote Button for Citizens -->
          <div class="card-actions">
            <button *ngIf="isCitizen && e.status === 'ONGOING' && !votedElections[e.id]"
                    class="btn-vote" (click)="showVoteModal(e)">
              🗳️ Cast Vote
            </button>
            <span *ngIf="votedElections[e.id]" class="voted-badge">✅ Voted</span>
            <button class="btn-results" (click)="showResults(e)">
              📊 View Results
            </button>
          </div>

          <!-- Results -->
          <div class="results-section" *ngIf="electionResults[e.id]">
            <h4>Results</h4>
            <div *ngFor="let r of electionResults[e.id]" class="result-bar">
              <div class="result-info">
                <span class="result-name">{{ r.candidateName }} ({{ r.party }})</span>
                <span class="result-votes">{{ r.voteCount }} votes ({{ r.percentage | number:'1.1-1' }}%)</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="r.percentage"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vote Modal -->
      <div class="modal-overlay" *ngIf="selectedElection" (click)="selectedElection = null">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>🗳️ Cast Your Vote</h2>
          <h3>{{ selectedElection.name }}</h3>
          <div class="vote-options">
            <button *ngFor="let c of selectedElection.candidates"
                    class="vote-option" [class.selected]="selectedCandidate === c.id"
                    (click)="selectedCandidate = c.id">
              <span class="vote-name">{{ c.name }}</span>
              <span class="vote-party">{{ c.party }}</span>
            </button>
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" (click)="selectedElection = null">Cancel</button>
            <button class="btn-confirm" (click)="castVote()" [disabled]="!selectedCandidate">
              Confirm Vote
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="filteredElections.length === 0" class="empty-state">
        <span class="empty-icon">🏛️</span>
        <h3>No elections found</h3>
        <p>No elections match the selected filter.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .page-header h1 { color: #fff; margin: 0; font-size: 28px; }
    .page-header p { color: rgba(255,255,255,0.4); margin: 4px 0 0; }
    .filter-select {
      padding: 10px 16px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
      border-radius: 10px; color: #fff; font-size: 14px; outline: none;
    }
    .filter-select option { background: #1a1a2e; }

    .elections-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 20px; }
    .election-card {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px; padding: 24px; transition: all 0.3s;
    }
    .election-card:hover { background: rgba(255,255,255,0.06); transform: translateY(-2px); }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .status-badge {
      padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .status-badge.ongoing { background: rgba(0,184,148,0.15); color: #00b894; }
    .status-badge.upcoming { background: rgba(108,92,231,0.15); color: #6c5ce7; }
    .status-badge.completed { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); }
    .region-tag { color: rgba(255,255,255,0.5); font-size: 13px; }
    .election-card h3 { color: #fff; margin: 0 0 8px; font-size: 18px; }
    .description { color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.5; margin-bottom: 16px; }
    .card-meta { display: flex; gap: 20px; color: rgba(255,255,255,0.4); font-size: 13px; margin-bottom: 16px; }

    .candidates-section { margin-bottom: 16px; }
    .candidates-section h4 { color: rgba(255,255,255,0.6); font-size: 13px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px; }
    .candidates-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .candidate-chip {
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px; padding: 8px 12px; display: flex; flex-direction: column;
    }
    .candidate-name { color: #fff; font-size: 13px; font-weight: 600; }
    .candidate-party { color: rgba(255,255,255,0.4); font-size: 11px; }

    .card-actions { display: flex; gap: 10px; margin-top: 16px; }
    .btn-vote {
      padding: 10px 20px; background: linear-gradient(135deg, #6c5ce7, #a855f7);
      border: none; border-radius: 10px; color: #fff; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: all 0.3s;
    }
    .btn-vote:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(108,92,231,0.4); }
    .voted-badge { color: #00b894; font-weight: 600; display: flex; align-items: center; }
    .btn-results {
      padding: 10px 20px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; color: #fff; font-size: 14px; cursor: pointer; transition: all 0.3s;
    }
    .btn-results:hover { background: rgba(255,255,255,0.1); }

    .results-section { margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
    .results-section h4 { color: rgba(255,255,255,0.6); font-size: 13px; margin: 0 0 12px; text-transform: uppercase; }
    .result-bar { margin-bottom: 12px; }
    .result-info { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .result-name { color: #fff; font-size: 13px; }
    .result-votes { color: rgba(255,255,255,0.5); font-size: 12px; }
    .progress-bar { width: 100%; height: 8px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(135deg, #6c5ce7, #a855f7); border-radius: 4px; transition: width 0.5s; }

    /* Modal */
    .modal-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .modal-content {
      background: #1a1a2e; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px;
      padding: 32px; width: 90%; max-width: 500px;
    }
    .modal-content h2 { color: #fff; margin: 0 0 8px; }
    .modal-content h3 { color: rgba(255,255,255,0.6); margin: 0 0 24px; font-size: 16px; }
    .vote-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
    .vote-option {
      padding: 16px; background: rgba(255,255,255,0.03); border: 2px solid rgba(255,255,255,0.08);
      border-radius: 12px; cursor: pointer; transition: all 0.3s; text-align: left;
      display: flex; flex-direction: column; gap: 4px;
    }
    .vote-option:hover { border-color: rgba(108,92,231,0.3); }
    .vote-option.selected { border-color: #6c5ce7; background: rgba(108,92,231,0.1); }
    .vote-name { color: #fff; font-size: 16px; font-weight: 600; }
    .vote-party { color: rgba(255,255,255,0.4); font-size: 13px; }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; }
    .btn-cancel {
      padding: 10px 24px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; color: #fff; cursor: pointer; font-size: 14px;
    }
    .btn-confirm {
      padding: 10px 24px; background: linear-gradient(135deg, #6c5ce7, #a855f7);
      border: none; border-radius: 10px; color: #fff; cursor: pointer; font-size: 14px; font-weight: 600;
    }
    .btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-icon { font-size: 64px; }
    .empty-state h3 { color: #fff; margin: 16px 0 8px; }
    .empty-state p { color: rgba(255,255,255,0.4); }
    .back-btn{color:#a855f7;text-decoration:none;font-size:14px;font-weight:600;padding:8px 14px;background:rgba(168,85,247,.1);border-radius:10px;transition:all .3s;white-space:nowrap}
    .back-btn:hover{background:rgba(168,85,247,.2)}
  `]
})
export class ElectionsComponent implements OnInit {
  elections: Election[] = [];
  filteredElections: Election[] = [];
  statusFilter = 'ALL';
  selectedElection: Election | null = null;
  selectedCandidate: number | null = null;
  votedElections: { [key: number]: boolean } = {};
  electionResults: { [key: number]: ElectionResult[] } = {};
  isCitizen = false;

  constructor(private apiService: ApiService, private authService: AuthService) { }

  ngOnInit() {
    this.isCitizen = this.authService.getRole() === 'ROLE_CITIZEN';
    this.loadElections();
  }

  loadElections() {
    this.apiService.getElections().subscribe({
      next: (elections) => {
        this.elections = elections;
        this.filterElections();
        if (this.isCitizen) {
          elections.forEach(e => {
            this.apiService.hasVoted(e.id).subscribe({
              next: (res) => this.votedElections[e.id] = res.hasVoted,
              error: () => { }
            });
          });
        }
      }
    });
  }

  filterElections() {
    this.filteredElections = this.statusFilter === 'ALL'
      ? this.elections
      : this.elections.filter(e => e.status === this.statusFilter);
  }

  showVoteModal(election: Election) {
    this.selectedElection = election;
    this.selectedCandidate = null;
  }

  castVote() {
    if (!this.selectedElection || !this.selectedCandidate) return;
    this.apiService.castVote(this.selectedElection.id, this.selectedCandidate).subscribe({
      next: () => {
        this.votedElections[this.selectedElection!.id] = true;
        this.selectedElection = null;
        this.selectedCandidate = null;
      },
      error: (err) => alert(err.error?.message || 'Vote failed')
    });
  }

  showResults(election: Election) {
    if (this.electionResults[election.id]) {
      delete this.electionResults[election.id];
      return;
    }
    this.apiService.getResults(election.id).subscribe({
      next: (results) => this.electionResults[election.id] = results
    });
  }
}
