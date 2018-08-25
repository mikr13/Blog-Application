import { Component, OnInit, OnDestroy} from '@angular/core';
import { PageEvent, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from '../../shared/posts.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-list-posts',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.css']
})
export class ListPostsComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  pageSizeOptions: number[] = [1, 2, 5, 10];
  private postSub: Subscription;

  constructor(public postsService: PostsService, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsService.postsPerPage, this.postsService.currentPage);
    this.postSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.postsService.totalPosts = postData.postCount;
        this.posts = postData.posts;
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
  }
}
