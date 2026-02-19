import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { DashboardStats } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <span class="logo-icon">🗳️</span>
          <h2>ElectiVote</h2>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" class="nav-item active">
            <span class="nav-icon">📊</span> Dashboard
          </a>
          <a routerLink="/elections" class="nav-item">
            <span class="nav-icon">🏛️</span> Elections
          </a>

          <!-- Admin links -->
          <ng-container *ngIf="isAdmin">
            <div class="nav-section">Admin</div>
            <a routerLink="/admin/users" class="nav-item">
              <span class="nav-icon">👥</span> User Management
            </a>
            <a routerLink="/admin/elections" class="nav-item">
              <span class="nav-icon">⚙️</span> Manage Elections
            </a>
          </ng-container>

          <!-- Citizen links -->
          <ng-container *ngIf="isCitizen">
            <div class="nav-section">Citizen</div>
            <a routerLink="/discussions" class="nav-item">
              <span class="nav-icon">💬</span> Discussions
            </a>
          </ng-container>

          <!-- Observer links -->
          <ng-container *ngIf="isObserver">
            <div class="nav-section">Observer</div>
            <a routerLink="/anomalies" class="nav-item">
              <span class="nav-icon">⚠️</span> Anomalies
            </a>
          </ng-container>

          <!-- Analyst links -->
          <ng-container *ngIf="isAnalyst">
            <div class="nav-section">Analyst</div>
            <a routerLink="/reports" class="nav-item">
              <span class="nav-icon">📄</span> Reports
            </a>
          </ng-container>

          <!-- Common links -->
          <div class="nav-section">More</div>
          <a routerLink="/discussions" class="nav-item" *ngIf="!isCitizen">
            <span class="nav-icon">💬</span> Discussions
          </a>
          <a routerLink="/anomalies" class="nav-item" *ngIf="!isObserver">
            <span class="nav-icon">⚠️</span> Anomalies
          </a>
          <a routerLink="/reports" class="nav-item" *ngIf="!isAnalyst">
            <span class="nav-icon">📄</span> Reports
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">{{ userInitial }}</div>
            <div class="user-details">
              <span class="user-name">{{ userName }}</span>
              <span class="user-role">{{ userRoleDisplay }}</span>
            </div>
          </div>
          <button class="logout-btn" (click)="logout()">🚪 Logout</button>
        </div>
      </aside>

      <!-- Main content -->
      <main class="main-content">
        <header class="top-bar">
          <div class="welcome">
            <h1>Welcome, {{ userName }}!</h1>
            <p>{{ todayDate }}</p>
          </div>
          <div class="role-badge" [ngClass]="roleBadgeClass">{{ userRoleDisplay }}</div>
        </header>

        <!-- Stats Cards -->
        <div class="stats-grid" *ngIf="stats">
          <div class="stat-card" style="--accent: #6c5ce7">
            <div class="stat-icon">🏛️</div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.totalElections }}</span>
              <span class="stat-label">Total Elections</span>
            </div>
          </div>
          <div class="stat-card" style="--accent: #00b894">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.activeElections }}</span>
              <span class="stat-label">Active Elections</span>
            </div>
          </div>
          <div class="stat-card" style="--accent: #e17055">
            <div class="stat-icon">🗳️</div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.totalVotesCast | number }}</span>
              <span class="stat-label">Votes Cast</span>
            </div>
          </div>
          <div class="stat-card" style="--accent: #fdcb6e" *ngIf="isAdmin">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.totalUsers }}</span>
              <span class="stat-label">Total Users</span>
            </div>
          </div>
          <div class="stat-card" style="--accent: #ff6b6b" *ngIf="!isCitizen">
            <div class="stat-icon">⚠️</div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.pendingAnomalies }}</span>
              <span class="stat-label">Pending Anomalies</span>
            </div>
          </div>
          <div class="stat-card" style="--accent: #a29bfe" *ngIf="!isCitizen">
            <div class="stat-icon">📄</div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.totalReports }}</span>
              <span class="stat-label">Reports</span>
            </div>
          </div>
          <div class="stat-card" style="--accent: #55efc4">
            <div class="stat-icon">💬</div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.totalDiscussions }}</span>
              <span class="stat-label">Discussions</span>
            </div>
          </div>
          <div class="stat-card" style="--accent: #fab1a0" *ngIf="!isCitizen">
            <div class="stat-icon">🔒</div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.totalAnomalies }}</span>
              <span class="stat-label">Total Anomalies</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <a routerLink="/elections" class="action-card">
              <span class="action-icon">🏛️</span>
              <span class="action-text">View Elections</span>
            </a>
            <a routerLink="/discussions" class="action-card" *ngIf="isCitizen || isAdmin">
              <span class="action-icon">💬</span>
              <span class="action-text">Join Discussion</span>
            </a>
            <a routerLink="/anomalies" class="action-card" *ngIf="isObserver || isAdmin">
              <span class="action-icon">⚠️</span>
              <span class="action-text">Report Anomaly</span>
            </a>
            <a routerLink="/reports" class="action-card" *ngIf="isAnalyst || isAdmin">
              <span class="action-icon">📊</span>
              <span class="action-text">View Reports</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout { display: flex; min-height: 100vh; background: #0a0a1a; }

    /* Sidebar */
    .sidebar {
      width: 260px; background: rgba(255,255,255,0.03); border-right: 1px solid rgba(255,255,255,0.06);
      display: flex; flex-direction: column; padding: 0; position: fixed; height: 100vh; overflow-y: auto;
    }
    .sidebar-header {
      display: flex; align-items: center; gap: 10px; padding: 24px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .sidebar-header .logo-icon { font-size: 28px; }
    .sidebar-header h2 { color: #fff; font-size: 20px; margin: 0; font-weight: 700; }
    .sidebar-nav { flex: 1; padding: 16px 12px; }
    .nav-section { color: rgba(255,255,255,0.3); font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; padding: 16px 12px 8px; font-weight: 600; }
    .nav-item {
      display: flex; align-items: center; gap: 12px; padding: 12px 16px; color: rgba(255,255,255,0.6);
      text-decoration: none; border-radius: 10px; margin-bottom: 2px; transition: all 0.2s; font-size: 14px;
    }
    .nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
    .nav-item.active { background: linear-gradient(135deg, rgba(108,92,231,0.2), rgba(168,85,247,0.2)); color: #a855f7; font-weight: 600; }
    .nav-icon { font-size: 18px; }
    .sidebar-footer { padding: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
    .user-info { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .user-avatar {
      width: 36px; height: 36px; background: linear-gradient(135deg, #6c5ce7, #a855f7);
      border-radius: 10px; display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 700; font-size: 16px;
    }
    .user-details { display: flex; flex-direction: column; }
    .user-name { color: #fff; font-size: 13px; font-weight: 600; }
    .user-role { color: rgba(255,255,255,0.4); font-size: 11px; }
    .logout-btn {
      width: 100%; padding: 10px; background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.2);
      border-radius: 10px; color: #ff6b6b; cursor: pointer; font-size: 13px; transition: all 0.3s;
    }
    .logout-btn:hover { background: rgba(255,107,107,0.2); }

    /* Main Content */
    .main-content { flex: 1; margin-left: 260px; padding: 32px; }
    .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .welcome h1 { color: #fff; margin: 0 0 4px; font-size: 24px; font-weight: 700; }
    .welcome p { color: rgba(255,255,255,0.4); margin: 0; font-size: 14px; }
    .role-badge {
      padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .role-badge.admin { background: rgba(255,107,107,0.15); color: #ff6b6b; }
    .role-badge.citizen { background: rgba(78,205,196,0.15); color: #4ecdc4; }
    .role-badge.observer { background: rgba(255,217,61,0.15); color: #ffd93d; }
    .role-badge.analyst { background: rgba(108,92,231,0.15); color: #6c5ce7; }

    /* Stats Grid */
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat-card {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 16px;
      transition: all 0.3s; border-left: 3px solid var(--accent);
    }
    .stat-card:hover { background: rgba(255,255,255,0.06); transform: translateY(-2px); }
    .stat-icon { font-size: 32px; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { color: #fff; font-size: 24px; font-weight: 700; }
    .stat-label { color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 2px; }

    /* Quick Actions */
    .quick-actions h2 { color: #fff; font-size: 18px; margin-bottom: 16px; }
    .actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .action-card {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px; padding: 24px; text-align: center; text-decoration: none;
      transition: all 0.3s; display: flex; flex-direction: column; align-items: center; gap: 12px;
    }
    .action-card:hover { background: rgba(108,92,231,0.1); border-color: rgba(108,92,231,0.3); transform: translateY(-3px); }
    .action-icon { font-size: 36px; }
    .action-text { color: #fff; font-size: 14px; font-weight: 500; }

    @media (max-width: 1200px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .actions-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .main-content { margin-left: 0; }
      .stats-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  userName = '';
  userInitial = '';
  userRoleDisplay = '';
  roleBadgeClass = '';
  todayDate = '';
  isAdmin = false;
  isCitizen = false;
  isObserver = false;
  isAnalyst = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.userName = user.fullName || user.username;
    this.userInitial = this.userName.charAt(0).toUpperCase();
    this.todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const role = user.role;
    this.isAdmin = role === 'ROLE_ADMIN';
    this.isCitizen = role === 'ROLE_CITIZEN';
    this.isObserver = role === 'ROLE_OBSERVER';
    this.isAnalyst = role === 'ROLE_ANALYST';

    const roleMap: any = { ROLE_ADMIN: 'Admin', ROLE_CITIZEN: 'Citizen', ROLE_OBSERVER: 'Observer', ROLE_ANALYST: 'Analyst' };
    this.userRoleDisplay = roleMap[role] || role;
    this.roleBadgeClass = role.replace('ROLE_', '').toLowerCase();

    this.apiService.getDashboardStats().subscribe({
      next: (s) => this.stats = s,
      error: () => { }
    });
  }

  logout() {
    this.authService.logout();
  }
}
