import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';

import { UsersService } from './../../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authListenerSubs: Subscription;

  constructor(public userService: UsersService) { }

  ngOnInit() {
    this.authListenerSubs = this.userService.getAuthStatusListener().subscribe(status => {
      if (!status) {
        this.isLoading = false;
      }
    });
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.userService.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
