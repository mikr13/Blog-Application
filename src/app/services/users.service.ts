import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';

import { User } from '../shared/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private token: string;
  private authStatusListener = new Subject<boolean>();
  private userData: any;
  private isAuthenticated = false;
  private tokenTimer: any;

  constructor(private http: HttpClient, public snackBar: MatSnackBar, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsUserAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUser() {
    if (this.userData) {
      return this.userData;
    }
  }

  createUser(user) {
    const userData = new FormData();
    userData.append('name', user.name);
    userData.append('dob', user.dob);
    userData.append('email', user.email);
    userData.append('password', user.password);
    userData.append('phone', user.phone);
    userData.append('tagline', user.tagline);
    userData.append('content', user.content);
    userData.append('image', user.image, user.name);
    this.http.post<{message: string, user: User}>('http://localhost:3030/api/users/signup', userData)
      .subscribe((responseData) => {
        if (responseData.user) {
          console.log(responseData.user);
        }
        this.snackBar.open(responseData.message, 'Okay!', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/login']);
    });
  }

  login(email: string, password: string) {
    const loginData: {email: string, password: string} = {email: email, password: password};
    this.http.post<{ user: any, message: string, token: string, expiresIn: number}>('http://localhost:3030/api/users/login', loginData)
      .subscribe((responseData) => {
        const token = responseData.token;
        this.token = token;
        const user = responseData.user;
        this.userData = user;
        this.snackBar.open(responseData.message, 'Okay!', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        if (token) {
          const expiresInDuration = responseData.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if(!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token,
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn/ 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token && !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

}
