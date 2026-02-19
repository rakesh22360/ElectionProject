import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Discussion, Election } from '../../models/models';

@Component({
  selector: 'app-discussions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div style="display:flex;align-items:center;gap:12px">
          <a routerLink="/dashboard" class="back-btn">← Back</a>
          <div><h1>💬 Civic Discussions</h1><p>Engage in conversations about elections</p></div>
        </div>
        <button class="btn-primary" (click)="showForm = !showForm">+ New Discussion</button>
      </div>
      <div class="form-card" *ngIf="showForm">
        <h3>Start a Discussion</h3>
        <div class="form-row">
          <input type="text" [(ngModel)]="newD.title" placeholder="Title" class="input">
          <select [(ngModel)]="newD.electionId" class="input"><option value="">General</option><option *ngFor="let e of elections" [value]="e.id">{{e.name}}</option></select>
        </div>
        <textarea [(ngModel)]="newD.content" rows="4" placeholder="Share your thoughts..." class="input full"></textarea>
        <div class="form-actions"><button class="btn-cancel" (click)="showForm=false">Cancel</button><button class="btn-submit" (click)="submitDiscussion()">Post</button></div>
      </div>
      <div class="list">
        <div *ngFor="let d of discussions" class="card">
          <div class="card-top"><div class="author"><div class="avatar">{{d.user?.fullName?.charAt(0)||'?'}}</div><div><b>{{d.user?.fullName||'Anon'}}</b><br><small>{{d.createdAt|date:'medium'}}</small></div></div><span class="tag" *ngIf="d.election">🏛️ {{d.election.name}}</span></div>
          <h3>{{d.title}}</h3><p class="content">{{d.content}}</p>
          <div class="card-bottom"><div class="replies" *ngIf="d.replies?.length"><h4>Replies ({{d.replies.length}})</h4><div *ngFor="let r of d.replies" class="reply"><b>{{r.user?.fullName}}</b> <small>{{r.createdAt|date:'short'}}</small><p>{{r.content}}</p></div></div>
          <button *ngIf="d.user?.id === currentUserId" class="btn-delete" (click)="deleteDiscussion(d.id)">🗑️ Delete</button></div>
          <div class="reply-box"><input [(ngModel)]="rc[d.id]" placeholder="Write a reply..." (keyup.enter)="submitReply(d.id)" class="input"><button (click)="submitReply(d.id)" class="btn-reply">Reply</button></div>
        </div>
      </div>
      <div *ngIf="!discussions.length" class="empty"><span style="font-size:64px">💬</span><h3>No discussions yet</h3></div>
    </div>
  `,
  styles: [`
    .page-container{padding:32px;max-width:900px;margin:0 auto}.page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px}.page-header h1{color:#fff;margin:0;font-size:28px}.page-header p{color:rgba(255,255,255,.4);margin:4px 0 0}
    .btn-primary{padding:10px 20px;background:linear-gradient(135deg,#6c5ce7,#a855f7);border:none;border-radius:10px;color:#fff;font-size:14px;font-weight:600;cursor:pointer}
    .form-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:16px;padding:24px;margin-bottom:24px}.form-card h3{color:#fff;margin:0 0 16px}
    .form-row{display:flex;gap:12px;margin-bottom:12px}.input{padding:10px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fff;font-size:14px;outline:none;flex:1;box-sizing:border-box}.input.full{width:100%;resize:vertical;margin-bottom:12px}
    .input option{background:#1a1a2e}.form-actions{display:flex;gap:10px;justify-content:flex-end}.btn-cancel{padding:10px 20px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#fff;cursor:pointer}.btn-submit{padding:10px 20px;background:linear-gradient(135deg,#6c5ce7,#a855f7);border:none;border-radius:10px;color:#fff;font-weight:600;cursor:pointer}
    .list{display:flex;flex-direction:column;gap:20px}.card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:16px;padding:24px;transition:all .3s}.card:hover{background:rgba(255,255,255,.05)}
    .card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.author{display:flex;align-items:center;gap:10px;color:rgba(255,255,255,.6);font-size:14px}.author b{color:#fff}.avatar{width:36px;height:36px;background:linear-gradient(135deg,#6c5ce7,#a855f7);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px}
    .tag{color:rgba(255,255,255,.4);font-size:12px;background:rgba(255,255,255,.05);padding:4px 10px;border-radius:6px}.card h3{color:#fff;margin:0 0 8px;font-size:18px}.content{color:rgba(255,255,255,.6);font-size:14px;line-height:1.6;margin:0 0 16px}
    .replies{margin:16px 0;padding:16px;background:rgba(255,255,255,.02);border-radius:12px}.replies h4{color:rgba(255,255,255,.4);font-size:13px;margin:0 0 12px}.reply{padding:12px;border-left:2px solid rgba(108,92,231,.3);margin-bottom:10px;color:rgba(255,255,255,.6);font-size:13px}.reply b{color:#a855f7}.reply p{margin:4px 0 0}
    .reply-box{display:flex;gap:10px;margin-top:16px}.btn-reply{padding:10px 20px;background:rgba(108,92,231,.2);border:1px solid rgba(108,92,231,.3);border-radius:10px;color:#a855f7;font-size:13px;font-weight:600;cursor:pointer}
    .empty{text-align:center;padding:80px 20px}.empty h3{color:#fff;margin:16px 0 8px}
    .back-btn{color:#a855f7;text-decoration:none;font-size:14px;font-weight:600;padding:8px 14px;background:rgba(168,85,247,.1);border-radius:10px;transition:all .3s;white-space:nowrap}
    .back-btn:hover{background:rgba(168,85,247,.2)}
    .btn-delete{padding:6px 14px;background:rgba(255,107,107,.1);border:1px solid rgba(255,107,107,.2);border-radius:8px;color:#ff6b6b;font-size:12px;font-weight:600;cursor:pointer;transition:all .3s;margin-top:12px}
    .btn-delete:hover{background:rgba(255,107,107,.2)}
    .card-bottom{display:flex;flex-direction:column}
  `]
})
export class DiscussionsComponent implements OnInit {
  discussions: Discussion[] = [];
  elections: Election[] = [];
  showForm = false;
  newD: any = { title: '', content: '', electionId: '' };
  rc: { [key: number]: string } = {};
  currentUserId: number | null = null;
  constructor(private api: ApiService, private auth: AuthService) { }
  ngOnInit() {
    const user = this.auth.getCurrentUser();
    this.currentUserId = user ? user.id : null;
    this.load();
  }
  load() {
    this.api.getDiscussions().subscribe({ next: d => this.discussions = d });
    this.api.getElections().subscribe({ next: e => this.elections = e });
  }
  submitDiscussion() {
    if (!this.newD.title || !this.newD.content) return;
    this.api.createDiscussion({ title: this.newD.title, content: this.newD.content }, this.newD.electionId || undefined).subscribe({
      next: () => { this.showForm = false; this.load(); this.newD = { title: '', content: '', electionId: '' }; }
    });
  }
  submitReply(pid: number) {
    if (!this.rc[pid]) return;
    this.api.addReply(pid, { title: 'Reply', content: this.rc[pid] }).subscribe({
      next: () => { this.rc[pid] = ''; this.load(); }
    });
  }
  deleteDiscussion(id: number) {
    if (!confirm('Are you sure you want to delete this discussion?')) return;
    this.api.deleteDiscussion(id).subscribe({
      next: () => this.load()
    });
  }
}
