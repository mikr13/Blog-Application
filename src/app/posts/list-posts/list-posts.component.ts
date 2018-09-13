import { Component, OnInit, OnDestroy} from '@angular/core';
import { PageEvent, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from '../../shared/posts.model';
import { PostsService } from '../../services/posts.service';
import { UsersService } from './../../services/users.service';

@Component({
  selector: 'app-list-posts',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.css']
})
export class ListPostsComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  private postSub: Subscription;
  private authListenerSubs: Subscription;
  userAuthenticated = false;
  userData = null;
  userID: string = null;

  constructor(public postsService: PostsService, public snackBar: MatSnackBar, private userService: UsersService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsService.postsPerPage, this.postsService.currentPage);
    this.userID = this.userService.getUserID();
    this.postSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.postsService.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.userAuthenticated = this.userService.getIsUserAuthenticated();
    this.authListenerSubs = this.userService.getAuthStatusListener().subscribe(status => {
      this.userAuthenticated = status;
      if (this.userAuthenticated) {
        this.userData = this.userService.getUser();
        this.userID = this.userService.getUserID();
      }
    });
  }

  onPageChange(pageData: PageEvent) {
    this.isLoading = true;
    this.postsService.currentPage = pageData.pageIndex + 1;
    this.postsService.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsService.postsPerPage, this.postsService.currentPage);
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe((responsemsg) => {
      if (this.postsService.totalPosts - 1 === this.postsService.postsPerPage * (this.postsService.currentPage - 1)) {
        this.postsService.currentPage = 1;
      }
      this.postsService.getPosts(this.postsService.postsPerPage, this.postsService.currentPage);
      this.snackBar.open(responsemsg.message, 'Okay!', {
        duration: 2500,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }
}
