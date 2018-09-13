import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from '../shared/posts.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions: number[] = [1, 2, 5, 10];

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?ps=${postsPerPage}&p=${currentPage}`;
    this.http.get<{message: string, posts: any, postCounts: number}>('http://localhost:3030/api/posts' + queryParams)
      .pipe(map((postData) => {
        return {posts: postData.posts.map((post) => {
          return {
            name: post.name,
            email: post.email,
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
            creatorID: post.creatorID
          };
        }), postCount: postData.postCounts};
      }))
      .subscribe((transformedPostData) => {
        // the same posts that came after map
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.postCount});
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{post: Post}>('http://localhost:3030/api/posts/' + id);
  }

  addPost(post) {
    const postData = new FormData();
    postData.append('name', post.name);
    postData.append('email', post.email);
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image, post.title);
    this.http.post<{message: string, post: Post}>('http://localhost:3030/api/posts', postData)
      .subscribe((responseData) => {
        this.snackBar.open(responseData.message, 'Okay!', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/']);
    }, (error) => {
      /* Caught by error interceptor
      this.snackBar.open(error.error.message, 'Okay!', {
        duration: 2500,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      */
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, post) {
    let postData: Post | FormData;
    if (typeof(post.image) === 'object') {
      postData = new FormData();
      postData.append('name', post.name);
      postData.append('email', post.email);
      postData.append('id', id);
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', post.image, post.title);
    } else {
      postData = {
        name: post.name,
        email: post.email,
        id: id,
        title: post.title,
        content: post.content,
        imagePath: post.image,
        creatorID: null
      };
    }
    this.http.put<{message: string}>('http://localhost:3030/api/posts/' + id, postData)
      .subscribe((response) => {
        this.snackBar.open(response.message, 'Okay!', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/']);
    }, (error) => {
      /*
      this.snackBar.open(error.error.message, 'Okay!', {
        duration: 2500,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      */
      this.router.navigate(['/']);
    });
  }

  deletePost(id: string) {
    return this.http.delete<{message: string}>('http://localhost:3030/api/posts/' + id);
  }
}
