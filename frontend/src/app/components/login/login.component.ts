import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <span class="logo-icon">🗳️</span>
            <h1>ElectiVote</h1>
          </div>
          <p>Election Monitoring System</p>
        </div>

        <form (ngSubmit)="onLogin()" class="auth-form">
          <div class="form-group">
            <label>Username</label>
            <input type="text" [(ngModel)]="credentials.username" name="username"
                   placeholder="Enter your username" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="credentials.password" name="password"
                   placeholder="Enter your password" required>
          </div>
          <div class="error-message" *ngIf="error">{{ error }}</div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Register here</a></p>
        </div>

        <div class="demo-credentials">
          <h4>Demo Credentials</h4>
          <div class="cred-grid">
            <button (click)="fillCredentials('admin', 'admin123')" class="cred-btn admin">👨‍💼 Admin</button>
            <button (click)="fillCredentials('citizen1', 'citizen123')" class="cred-btn citizen">👤 Citizen</button>
            <button (click)="fillCredentials('observer1', 'observer123')" class="cred-btn observer">👁️ Observer</button>
            <button (click)="fillCredentials('analyst1', 'analyst123')" class="cred-btn analyst">📊 Analyst</button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      padding: 20px;
    }
    .auth-card {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 24px;
      padding: 40px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.3);
    }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .logo { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 8px; }
    .logo-icon { font-size: 36px; }
    .logo h1 { font-size: 28px; color: #fff; margin: 0; font-weight: 700; }
    .auth-header p { color: rgba(255,255,255,0.5); font-size: 14px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; color: rgba(255,255,255,0.7); margin-bottom: 8px; font-size: 14px; font-weight: 500; }
    .form-group input {
      width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; color: #fff;
      font-size: 15px; transition: all 0.3s; outline: none; box-sizing: border-box;
    }
    .form-group input:focus { border-color: #6c5ce7; background: rgba(255,255,255,0.12); box-shadow: 0 0 0 3px rgba(108,92,231,0.2); }
    .form-group input::placeholder { color: rgba(255,255,255,0.3); }
    .btn-primary {
      width: 100%; padding: 14px; background: linear-gradient(135deg, #6c5ce7, #a855f7);
      border: none; border-radius: 12px; color: #fff; font-size: 16px; font-weight: 600;
      cursor: pointer; transition: all 0.3s; margin-top: 8px;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(108,92,231,0.4); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .error-message { color: #ff6b6b; font-size: 14px; margin-bottom: 12px; text-align: center; padding: 10px; background: rgba(255,107,107,0.1); border-radius: 8px; }
    .auth-footer { text-align: center; margin-top: 24px; }
    .auth-footer p { color: rgba(255,255,255,0.5); font-size: 14px; }
    .auth-footer a { color: #a855f7; text-decoration: none; font-weight: 600; }
    .demo-credentials {
      margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);
    }
    .demo-credentials h4 { color: rgba(255,255,255,0.5); font-size: 13px; text-align: center; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .cred-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .cred-btn {
      padding: 10px; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
      background: rgba(255,255,255,0.05); color: #fff; cursor: pointer; font-size: 13px;
      transition: all 0.3s;
    }
    .cred-btn:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); }
    .cred-btn.admin:hover { border-color: #ff6b6b; }
    .cred-btn.citizen:hover { border-color: #4ecdc4; }
    .cred-btn.observer:hover { border-color: #ffd93d; }
    .cred-btn.analyst:hover { border-color: #6c5ce7; }
  `]
})
export class LoginComponent {
    credentials = { username: '', password: '' };
    error = '';
    loading = false;

    constructor(private authService: AuthService, private router: Router) { }

    fillCredentials(username: string, password: string) {
        this.credentials = { username, password };
    }

    onLogin() {
        this.loading = true;
        this.error = '';
        this.authService.login(this.credentials).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.error = err.error?.message || 'Invalid credentials';
                this.loading = false;
            }
        });
    }
}
