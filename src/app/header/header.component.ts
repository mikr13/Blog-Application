import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from './../services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  userAuthenticated = false;
  userData = null;

  constructor(private userService: UsersService) { }

  ngOnInit() {
    this.userAuthenticated = this.userService.getIsUserAuthenticated();
    this.authListenerSubs = this.userService.getAuthStatusListener().subscribe(status => {
      this.userAuthenticated = status;
      if (this.userAuthenticated) {
        this.userData = this.userService.getUser();
      }
    });
  }

  onLogout() {
    this.userService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
