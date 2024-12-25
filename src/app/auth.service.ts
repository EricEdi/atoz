import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from './environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl; // Define the API URL in your environment.ts
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient, 
    private router: Router, 
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {
    // Use localStorage only in the browser
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      this.currentUserSubject = new BehaviorSubject<any>(
        storedUser ? JSON.parse(storedUser) : null
      );
    } else {
      this.currentUserSubject = new BehaviorSubject<any>(null);
    }

    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  // Register user
  register(username: string, email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/register`, { username, email, password })
      .pipe(catchError(this.handleError));
  }

  // Login user
  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/login`, { email, password })
      .pipe(
        catchError(this.handleError),
        // Store JWT token and user info in localStorage if in the browser
        tap((response: any) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(response));
          }
          this.currentUserSubject.next(response);
        })
      );
  }

  // Get user data from token
  getUser(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token provided');
    }

    const headers = new HttpHeaders().set('Authorization', token);
    return this.http
      .get(`${this.apiUrl}/user`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Logout user
  logout(): void {
    // Remove user and JWT token from localStorage if in the browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Helper method to get the token from localStorage
  private getToken() {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.token : null;
  }

  // Error handling
  private handleError(error: any) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
