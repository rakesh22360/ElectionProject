import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
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
          <p>Create your account</p>
        </div>

        <form (ngSubmit)="onRegister()" class="auth-form">
          <div class="form-group">
            <label>Username</label>
            <input type="text" [(ngModel)]="user.username" name="username" placeholder="Choose a username" required>
          </div>
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="user.fullName" name="fullName" placeholder="Enter your full name" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="user.email" name="email" placeholder="Enter your email" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="user.password" name="password" placeholder="Create a password" required>
          </div>
          <div class="form-group">
            <label>Role</label>
            <select [(ngModel)]="user.role" name="role" required>
              <option value="">Select your role</option>
              <option value="CITIZEN">Citizen</option>
              <option value="OBSERVER">Election Observer</option>
              <option value="ANALYST">Data Analyst</option>
            </select>
          </div>
          <div class="error-message" *ngIf="error">{{ error }}</div>
          <div class="success-message" *ngIf="success">{{ success }}</div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-container {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); padding: 20px;
    }
    .auth-card {
      background: rgba(255,255,255,0.05); backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 24px;
      padding: 40px; width: 100%; max-width: 440px; box-shadow: 0 25px 50px rgba(0,0,0,0.3);
    }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .logo { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 8px; }
    .logo-icon { font-size: 36px; }
    .logo h1 { font-size: 28px; color: #fff; margin: 0; font-weight: 700; }
    .auth-header p { color: rgba(255,255,255,0.5); font-size: 14px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; color: rgba(255,255,255,0.7); margin-bottom: 6px; font-size: 14px; font-weight: 500; }
    .form-group input, .form-group select {
      width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; color: #fff;
      font-size: 15px; transition: all 0.3s; outline: none; box-sizing: border-box;
    }
    .form-group select option { background: #1a1a2e; color: #fff; }
    .form-group input:focus, .form-group select:focus { border-color: #6c5ce7; background: rgba(255,255,255,0.12); }
    .form-group input::placeholder { color: rgba(255,255,255,0.3); }
    .btn-primary {
      width: 100%; padding: 14px; background: linear-gradient(135deg, #6c5ce7, #a855f7);
      border: none; border-radius: 12px; color: #fff; font-size: 16px; font-weight: 600;
      cursor: pointer; transition: all 0.3s; margin-top: 8px;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(108,92,231,0.4); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .error-message { color: #ff6b6b; font-size: 14px; margin-bottom: 12px; text-align: center; padding: 10px; background: rgba(255,107,107,0.1); border-radius: 8px; }
    .success-message { color: #4ecdc4; font-size: 14px; margin-bottom: 12px; text-align: center; padding: 10px; background: rgba(78,205,196,0.1); border-radius: 8px; }
    .auth-footer { text-align: center; margin-top: 24px; }
    .auth-footer p { color: rgba(255,255,255,0.5); font-size: 14px; }
    .auth-footer a { color: #a855f7; text-decoration: none; font-weight: 600; }
  `]
})
export class RegisterComponent {
    user = { username: '', fullName: '', email: '', password: '', role: '' };
    error = '';
    success = '';
    loading = false;

    constructor(private authService: AuthService, private router: Router) { }

    onRegister() {
        this.loading = true;
        this.error = '';
        this.success = '';
        this.authService.register(this.user).subscribe({
            next: () => {
                this.success = 'Account created! Redirecting to login...';
                setTimeout(() => this.router.navigate(['/login']), 2000);
            },
            error: (err) => {
                this.error = err.error?.message || 'Registration failed';
                this.loading = false;
            }
        });
    }
}
