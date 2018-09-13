import { Injectable, Compiler } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';

import { User } from '../shared/users.model';

import { environment } from '../../environments/environment';
const BACKEND_URL = `${environment.apiURL}/users`;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private token: string;
  private authStatusListener = new Subject<boolean>();
  private userData: any;
  private userName: string;
  private userEmail: string;
  private userImage: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private userID: string;

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router, private _compiler: Compiler) { }

  getToken() {
    if (this.token) {
      return this.token;
    }
  }

  getIsUserAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserID() {
    if (this.userID && this.isAuthenticated) {
      return this.userID;
    }
  }

  getUser() {
    if (localStorage.getItem('userName') && localStorage.getItem('userEmail') && localStorage.getItem('userImage') && this.isAuthenticated) {
      return {name: localStorage.getItem('userName'), email: localStorage.getItem('userEmail'), image: localStorage.getItem('userImage')}
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
    return this.http.post<{message: string, user: User}>(`${BACKEND_URL}/signup`, userData)
      .subscribe((responseData) => {
          this.snackBar.open(responseData.message, 'Okay!', {
            duration: 2500,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/login']);
        },
        (error) => {
          /* caught by error interceptor
          this.snackBar.open(error.error.message || error.error.error, 'Okay!', {
            duration: 2500,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          */
          if(error) {
            this.authStatusListener.next(false);
          }
        }
      );
  }

  login(email: string, password: string) {
    const loginData: {email: string, password: string} = {email: email, password: password};
    this.http.post<{ user: any, message: string, token: string, expiresIn: number}>(`${BACKEND_URL}/login`, loginData)
      .subscribe((responseData) => {
        if (responseData) {
          const token = responseData.token;
          this.token = token;
          this.snackBar.open(responseData.message, 'Okay!', {
            duration: 2500,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          if (token) {
            const expiresInDuration = responseData.expiresIn;
            this.userID = responseData.user.userID;
            const user = responseData.user;
            this.userData = user;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(token, expirationDate, this.userID, this.userData);
            this.router.navigate(['/']);
          }
        }
        },
        (error) => {
          /* caught by error interceptor
          this.snackBar.open(error.error.message, 'Okay!', {
            duration: 2500,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          */
          if(error) {
            this.authStatusListener.next(false);
          }
        }
      );
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token,
      this.isAuthenticated = true;
      this.userID = authInfo.userID;
      this.userName = authInfo.userName;
      this.userEmail = authInfo.userEmail;
      this.userImage = authInfo.userImage;
      this.setAuthTimer(expiresIn / 1000);
      this.snackBar.open('Welcome back ' + this.userName, 'Okay!', {
        duration: 2500,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userID = null;
    this.userName = null;
    this.userEmail = null;
    this.userImage = null;
    this.userData = null;
    this._compiler.clearCache();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userID: string, userData: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userID', userID);
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userImage', userData.imagePath);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userID = localStorage.getItem('userID');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userImage = localStorage.getItem('userImage');
    if (!token && !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userID: userID,
      userName: userName,
      userEmail: userEmail,
      userImage: userImage
    };
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userID');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userImage');
  }

}
