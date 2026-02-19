import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Report, Election } from '../../models/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div style="display:flex;align-items:center;gap:12px">
          <a routerLink="/dashboard" class="back-btn">← Back</a>
          <div>
            <h1>📄 Reports</h1>
            <p>Election analysis and reports</p>
          </div>
        </div>
        <button class="btn-primary" (click)="showForm = !showForm" *ngIf="canCreate">
          + Create Report
        </button>
      </div>

      <!-- Report Form -->
      <div class="form-card" *ngIf="showForm">
        <h3>Create New Report</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Title</label>
            <input type="text" [(ngModel)]="newReport.title" placeholder="Report title">
          </div>
          <div class="form-group">
            <label>Type</label>
            <select [(ngModel)]="newReport.type">
              <option value="ANALYSIS">Analysis</option>
              <option value="TURNOUT">Turnout</option>
              <option value="FRAUD">Fraud</option>
              <option value="GENERAL">General</option>
            </select>
          </div>
          <div class="form-group">
            <label>Election (optional)</label>
            <select [(ngModel)]="newReport.electionId">
              <option value="">None</option>
              <option *ngFor="let e of elections" [value]="e.id">{{ e.name }}</option>
            </select>
          </div>
          <div class="form-group full-width">
            <label>Content</label>
            <textarea [(ngModel)]="newReport.content" rows="6" placeholder="Write your report..."></textarea>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-cancel" (click)="showForm = false">Cancel</button>
          <button class="btn-submit" (click)="submitReport()">Publish</button>
        </div>
      </div>

      <!-- Reports List -->
      <div class="reports-grid">
        <div *ngFor="let r of reports" class="report-card">
          <div class="report-header">
            <span class="type-badge" [ngClass]="r.type.toLowerCase()">{{ r.type }}</span>
            <span class="report-date">{{ r.createdAt | date:'mediumDate' }}</span>
          </div>
          <h3>{{ r.title }}</h3>
          <p class="report-content">{{ r.content }}</p>
          <div class="report-meta">
            <span *ngIf="r.election">🏛️ {{ r.election.name }}</span>
            <span *ngIf="r.createdBy">👤 {{ r.createdBy.fullName }}</span>
          </div>
        </div>
      </div>

      <div *ngIf="reports.length === 0" class="empty-state">
        <span class="empty-icon">📄</span>
        <h3>No reports yet</h3>
        <p>Create the first election report.</p>
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
      border-radius: 10px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer;
    }
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

    .reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 16px; }
    .report-card {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px; padding: 20px; transition: all 0.3s;
    }
    .report-card:hover { background: rgba(255,255,255,0.05); }
    .report-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .type-badge {
      padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase;
    }
    .type-badge.analysis { background: rgba(108,92,231,0.15); color: #6c5ce7; }
    .type-badge.turnout { background: rgba(0,184,148,0.15); color: #00b894; }
    .type-badge.fraud { background: rgba(255,107,107,0.15); color: #ff6b6b; }
    .type-badge.general { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); }
    .report-date { color: rgba(255,255,255,0.3); font-size: 12px; }
    .report-card h3 { color: #fff; margin: 0 0 8px; font-size: 16px; }
    .report-content { color: rgba(255,255,255,0.5); font-size: 14px; line-height: 1.5; margin: 0 0 12px; }
    .report-meta { display: flex; gap: 16px; color: rgba(255,255,255,0.3); font-size: 12px; }

    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-icon { font-size: 64px; }
    .empty-state h3 { color: #fff; margin: 16px 0 8px; }
    .empty-state p { color: rgba(255,255,255,0.4); }
    .back-btn{color:#a855f7;text-decoration:none;font-size:14px;font-weight:600;padding:8px 14px;background:rgba(168,85,247,.1);border-radius:10px;transition:all .3s;white-space:nowrap}
    .back-btn:hover{background:rgba(168,85,247,.2)}
  `]
})
export class ReportsComponent implements OnInit {
  reports: Report[] = [];
  elections: Election[] = [];
  showForm = false;
  newReport: any = { title: '', content: '', type: 'ANALYSIS', electionId: '' };
  canCreate = false;

  constructor(private apiService: ApiService, private authService: AuthService) { }

  ngOnInit() {
    const role = this.authService.getRole();
    this.canCreate = ['ROLE_ANALYST', 'ROLE_ADMIN', 'ROLE_OBSERVER'].includes(role);
    this.loadData();
  }

  loadData() {
    this.apiService.getReports().subscribe({ next: (r) => this.reports = r });
    this.apiService.getElections().subscribe({ next: (e) => this.elections = e });
  }

  submitReport() {
    if (!this.newReport.title || !this.newReport.content) return;
    const electionId = this.newReport.electionId || undefined;
    this.apiService.createReport(
      { title: this.newReport.title, content: this.newReport.content, type: this.newReport.type },
      electionId
    ).subscribe({
      next: () => { this.showForm = false; this.loadData(); this.newReport = { title: '', content: '', type: 'ANALYSIS', electionId: '' }; }
    });
  }
}
