import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Election } from '../../models/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header"><div style="display:flex;align-items:center;gap:12px"><a routerLink="/dashboard" class="back-btn">← Back</a><div><h1>⚙️ Admin Panel</h1><p>Manage users and elections</p></div></div></div>
      <!-- Users Section -->
      <div class="section">
        <h2>👥 User Management</h2>
        <div class="table-container">
          <table><thead><tr><th>Username</th><th>Full Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody><tr *ngFor="let u of users">
            <td>{{u.username}}</td><td>{{u.fullName}}</td><td>{{u.email}}</td>
            <td><span class="role-tag">{{u.role?.replace('ROLE_','')}}</span></td>
            <td><span class="status-dot" [class.active]="u.enabled">{{u.enabled?'Active':'Disabled'}}</span></td>
            <td><button class="btn-sm" (click)="toggleUser(u.id)">{{u.enabled?'Disable':'Enable'}}</button></td>
          </tr></tbody></table>
        </div>
      </div>
      <!-- Elections Section -->
      <div class="section">
        <h2>🏛️ Election Management</h2>
        <button class="btn-primary" (click)="showElectionForm=!showElectionForm">+ Add Election</button>
        <div class="form-card" *ngIf="showElectionForm">
          <div class="form-row">
            <input [(ngModel)]="newEl.name" placeholder="Election Name" class="input">
            <input [(ngModel)]="newEl.region" placeholder="Region" class="input">
          </div>
          <div class="form-row">
            <input type="date" [(ngModel)]="newEl.electionDate" class="input">
            <select [(ngModel)]="newEl.status" class="input"><option value="UPCOMING">Upcoming</option><option value="ONGOING">Ongoing</option><option value="COMPLETED">Completed</option></select>
            <input type="number" [(ngModel)]="newEl.totalRegisteredVoters" placeholder="Registered Voters" class="input">
          </div>
          <textarea [(ngModel)]="newEl.description" placeholder="Description" rows="3" class="input full"></textarea>
          <div class="form-actions"><button class="btn-cancel" (click)="showElectionForm=false">Cancel</button><button class="btn-submit" (click)="createElection()">Create</button></div>
        </div>
        <div class="election-admin-list">
          <div *ngFor="let e of elections" class="admin-card">
            <div class="ac-header"><h3>{{e.name}}</h3><span class="status-badge" [ngClass]="e.status.toLowerCase()">{{e.status}}</span></div>
            <p>{{e.region}} · {{e.electionDate}} · {{e.totalRegisteredVoters|number}} voters</p>
            <button class="btn-sm danger" (click)="deleteElection(e.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container{padding:32px;max-width:1200px;margin:0 auto}.page-header{margin-bottom:32px}.page-header h1{color:#fff;margin:0;font-size:28px}.page-header p{color:rgba(255,255,255,.4);margin:4px 0 0}
    .section{margin-bottom:40px}.section h2{color:#fff;font-size:20px;margin:0 0 16px}
    .table-container{overflow-x:auto}table{width:100%;border-collapse:collapse;background:rgba(255,255,255,.03);border-radius:12px;overflow:hidden}
    th{background:rgba(255,255,255,.06);color:rgba(255,255,255,.6);font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:14px 16px;text-align:left}
    td{padding:14px 16px;color:rgba(255,255,255,.7);font-size:14px;border-bottom:1px solid rgba(255,255,255,.04)}
    .role-tag{background:rgba(108,92,231,.15);color:#6c5ce7;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600}
    .status-dot{font-size:13px}.status-dot.active{color:#00b894}
    .btn-sm{padding:6px 14px;border-radius:8px;font-size:12px;cursor:pointer;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.06);color:#fff;transition:all .3s}
    .btn-sm.danger{border-color:rgba(255,107,107,.3);color:#ff6b6b}
    .btn-primary{padding:10px 20px;background:linear-gradient(135deg,#6c5ce7,#a855f7);border:none;border-radius:10px;color:#fff;font-size:14px;font-weight:600;cursor:pointer;margin-bottom:16px}
    .form-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:16px;padding:24px;margin-bottom:24px}
    .form-row{display:flex;gap:12px;margin-bottom:12px}.input{padding:10px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fff;font-size:14px;outline:none;flex:1;box-sizing:border-box}
    .input.full{width:100%;resize:vertical;margin-bottom:12px}.input option{background:#1a1a2e}
    .form-actions{display:flex;gap:10px;justify-content:flex-end}.btn-cancel{padding:10px 20px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fff;cursor:pointer}
    .btn-submit{padding:10px 20px;background:linear-gradient(135deg,#6c5ce7,#a855f7);border:none;border-radius:10px;color:#fff;font-weight:600;cursor:pointer}
    .election-admin-list{display:flex;flex-direction:column;gap:12px}.admin-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:16px}
    .ac-header{display:flex;justify-content:space-between;align-items:center}.ac-header h3{color:#fff;margin:0;font-size:16px}
    .status-badge{padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;text-transform:uppercase}
    .status-badge.ongoing{background:rgba(0,184,148,.15);color:#00b894}.status-badge.upcoming{background:rgba(108,92,231,.15);color:#6c5ce7}.status-badge.completed{background:rgba(255,255,255,.06);color:rgba(255,255,255,.5)}
    .admin-card p{color:rgba(255,255,255,.4);font-size:13px;margin:8px 0}
    .back-btn{color:#a855f7;text-decoration:none;font-size:14px;font-weight:600;padding:8px 14px;background:rgba(168,85,247,.1);border-radius:10px;transition:all .3s;white-space:nowrap}
    .back-btn:hover{background:rgba(168,85,247,.2)}
  `]
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  elections: Election[] = [];
  showElectionForm = false;
  newEl: any = { name: '', description: '', electionDate: '', region: '', status: 'UPCOMING', totalRegisteredVoters: 0 };
  constructor(private api: ApiService) { }
  ngOnInit() { this.load(); }
  load() {
    this.api.getUsers().subscribe({ next: u => this.users = u, error: () => { } });
    this.api.getElections().subscribe({ next: e => this.elections = e });
  }
  toggleUser(id: number) { this.api.toggleUser(id).subscribe({ next: () => this.load() }); }
  deleteElection(id: number) { this.api.deleteElection(id).subscribe({ next: () => this.load() }); }
  createElection() {
    if (!this.newEl.name) return;
    this.api.createElection(this.newEl).subscribe({ next: () => { this.showElectionForm = false; this.load(); this.newEl = { name: '', description: '', electionDate: '', region: '', status: 'UPCOMING', totalRegisteredVoters: 0 }; } });
  }
}
