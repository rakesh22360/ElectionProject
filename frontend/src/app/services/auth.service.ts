import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtResponse, LoginRequest, RegisterRequest } from '../models/models';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private currentUserSubject = new BehaviorSubject<JwtResponse | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            this.currentUserSubject.next(JSON.parse(stored));
        }
    }

    login(request: LoginRequest): Observable<JwtResponse> {
        return this.http.post<JwtResponse>(`${this.apiUrl}/login`, request).pipe(
            tap(response => {
                localStorage.setItem('currentUser', JSON.stringify(response));
                localStorage.setItem('token', response.token);
                this.currentUserSubject.next(response);
            })
        );
    }

    register(request: RegisterRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, request);
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    getCurrentUser(): JwtResponse | null {
        return this.currentUserSubject.value;
    }

    getRole(): string {
        const user = this.getCurrentUser();
        return user ? user.role : '';
    }

    hasRole(role: string): boolean {
        return this.getRole() === role;
    }
}
