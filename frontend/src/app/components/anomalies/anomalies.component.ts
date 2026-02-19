import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Anomaly, Election } from '../../models/models';

@Component({
  selector: 'app-anomalies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div style="display:flex;align-items:center;gap:12px">
          <a routerLink="/dashboard" class="back-btn">← Back</a>
          <div>
            <h1>⚠️ Anomaly Reports</h1>
            <p>Monitor and report election irregularities</p>
          </div>
        </div>
        <button class="btn-primary" (click)="showForm = !showForm" *ngIf="canReport">
          + Report Anomaly
        </button>
      </div>

      <!-- Report Form -->
      <div class="form-card" *ngIf="showForm">
        <h3>Report New Anomaly</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Election</label>
            <select [(ngModel)]="newAnomaly.electionId">
              <option value="">Select election</option>
              <option *ngFor="let e of elections" [value]="e.id">{{ e.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Severity</label>
            <select [(ngModel)]="newAnomaly.severity">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div class="form-group">
            <label>Location</label>
            <input type="text" [(ngModel)]="newAnomaly.location" placeholder="Location of anomaly">
          </div>
          <div class="form-group full-width">
            <label>Description</label>
            <textarea [(ngModel)]="newAnomaly.description" rows="4" placeholder="Describe the anomaly..."></textarea>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-cancel" (click)="showForm = false">Cancel</button>
          <button class="btn-submit" (click)="submitAnomaly()">Submit Report</button>
        </div>
      </div>

      <!-- Anomaly List -->
      <div class="anomaly-list">
        <div *ngFor="let a of anomalies" class="anomaly-card">
          <div class="anomaly-header">
            <span class="severity-badge" [ngClass]="a.severity.toLowerCase()">{{ a.severity }}</span>
            <span class="status-badge" [ngClass]="a.status.toLowerCase().replace('_', '-')">{{ a.status }}</span>
          </div>
          <p class="anomaly-desc">{{ a.description }}</p>
          <div class="anomaly-meta">
            <span *ngIf="a.election">🏛️ {{ a.election.name }}</span>
            <span *ngIf="a.location">📍 {{ a.location }}</span>
            <span>📅 {{ a.createdAt | date:'medium' }}</span>
          </div>
          <div class="anomaly-actions" *ngIf="canResolve">
            <button class="btn-sm" (click)="updateStatus(a.id, 'UNDER_REVIEW')" *ngIf="a.status === 'REPORTED'">Review</button>
            <button class="btn-sm resolve" (click)="updateStatus(a.id, 'RESOLVED')" *ngIf="a.status !== 'RESOLVED'">Resolve</button>
            <button class="btn-sm dismiss" (click)="updateStatus(a.id, 'DISMISSED')" *ngIf="a.status !== 'DISMISSED'">Dismiss</button>
          </div>
        </div>
      </div>

      <div *ngIf="anomalies.length === 0" class="empty-state">
        <span class="empty-icon">✅</span>
        <h3>No anomalies reported</h3>
        <p>All elections are running smoothly.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 32px; max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .page-header h1 { color: #fff; margin: 0; font-size: 28px; }
    .page-header p { color: rgba(255,255,255,0.4); margin: 4px 0 0; }
    .btn-primary {
      padding: 10px 20px; background: linear-gradient(135deg, #6c5ce7, #a855f7); border: none;
      border-radius: 10px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s;
    }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(108,92,231,0.4); }

    .form-card {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px; padding: 24px; margin-bottom: 24px;
    }
    .form-card h3 { color: #fff; margin: 0 0 20px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { display: flex; flex-direction: column; }
    .form-group.full-width { grid-column: 1 / -1; }
    .form-group label { color: rgba(255,255,255,0.6); font-size: 13px; margin-bottom: 6px; }
    .form-group input, .form-group select, .form-group textarea {
      padding: 10px 14px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; color: #fff; font-size: 14px; outline: none; resize: vertical;
    }
    .form-group select option { background: #1a1a2e; }
    .form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; }
    .btn-cancel { padding: 10px 20px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; cursor: pointer; }
    .btn-submit { padding: 10px 20px; background: linear-gradient(135deg, #6c5ce7, #a855f7); border: none; border-radius: 10px; color: #fff; font-weight: 600; cursor: pointer; }

    .anomaly-list { display: flex; flex-direction: column; gap: 16px; }
    .anomaly-card {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px; padding: 20px; transition: all 0.3s;
    }
    .anomaly-card:hover { background: rgba(255,255,255,0.05); }
    .anomaly-header { display: flex; gap: 10px; margin-bottom: 12px; }
    .severity-badge {
      padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase;
    }
    .severity-badge.critical { background: rgba(255,0,0,0.15); color: #ff4444; }
    .severity-badge.high { background: rgba(255,107,107,0.15); color: #ff6b6b; }
    .severity-badge.medium { background: rgba(255,217,61,0.15); color: #ffd93d; }
    .severity-badge.low { background: rgba(78,205,196,0.15); color: #4ecdc4; }
    .status-badge {
      padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase;
    }
    .status-badge.reported { background: rgba(108,92,231,0.15); color: #6c5ce7; }
    .status-badge.under-review { background: rgba(255,217,61,0.15); color: #ffd93d; }
    .status-badge.resolved { background: rgba(0,184,148,0.15); color: #00b894; }
    .status-badge.dismissed { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.4); }
    .anomaly-desc { color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.5; margin: 0 0 12px; }
    .anomaly-meta { display: flex; gap: 20px; color: rgba(255,255,255,0.4); font-size: 13px; }
    .anomaly-actions { display: flex; gap: 8px; margin-top: 12px; }
    .btn-sm {
      padding: 6px 14px; border-radius: 8px; font-size: 12px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.06); color: #fff; transition: all 0.3s;
    }
    .btn-sm.resolve { border-color: rgba(0,184,148,0.3); color: #00b894; }
    .btn-sm.dismiss { border-color: rgba(255,107,107,0.3); color: #ff6b6b; }
    .btn-sm:hover { transform: translateY(-1px); }

    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-icon { font-size: 64px; }
    .empty-state h3 { color: #fff; margin: 16px 0 8px; }
    .empty-state p { color: rgba(255,255,255,0.4); }
    .back-btn{color:#a855f7;text-decoration:none;font-size:14px;font-weight:600;padding:8px 14px;background:rgba(168,85,247,.1);border-radius:10px;transition:all .3s;white-space:nowrap}
    .back-btn:hover{background:rgba(168,85,247,.2)}
  `]
})
export class AnomaliesComponent implements OnInit {
  anomalies: Anomaly[] = [];
  elections: Election[] = [];
  showForm = false;
  newAnomaly: any = { description: '', severity: 'MEDIUM', location: '', electionId: '' };
  canReport = false;
  canResolve = false;

  constructor(private apiService: ApiService, private authService: AuthService) { }

  ngOnInit() {
    const role = this.authService.getRole();
    this.canReport = ['ROLE_OBSERVER', 'ROLE_CITIZEN', 'ROLE_ADMIN'].includes(role);
    this.canResolve = ['ROLE_ADMIN', 'ROLE_OBSERVER'].includes(role);
    this.loadData();
  }

  loadData() {
    this.apiService.getAnomalies().subscribe({ next: (a) => this.anomalies = a });
    this.apiService.getElections().subscribe({ next: (e) => this.elections = e });
  }

  submitAnomaly() {
    if (!this.newAnomaly.description || !this.newAnomaly.electionId) return;
    this.apiService.createAnomaly(
      { description: this.newAnomaly.description, severity: this.newAnomaly.severity, location: this.newAnomaly.location },
      this.newAnomaly.electionId
    ).subscribe({
      next: () => { this.showForm = false; this.loadData(); this.newAnomaly = { description: '', severity: 'MEDIUM', location: '', electionId: '' }; },
      error: (err) => alert(err.error?.message || 'Failed to submit')
    });
  }

  updateStatus(id: number, status: string) {
    this.apiService.updateAnomalyStatus(id, status).subscribe({ next: () => this.loadData() });
  }
}
