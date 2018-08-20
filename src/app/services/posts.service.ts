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
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, public snackBar: MatSnackBar, private router: Router) { }

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3030/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            name: post.name,
            age: post.age,
            email: post.email,
            id: post._id,
            title: post.title,
            content: post.content
          };
        });
      }))
      .subscribe((posts) => {
        // the same posts that came after map
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{post: Post}>('http://localhost:3030/api/posts/' + id);
  }

  updatePost(id: string, post: any) {
    const postUpdated: Post = {
      name: post.name,
      age: post.age,
      email: post.email,
      id: id,
      title: post.title,
      content: post.content
    };
    this.http.put<{message: string}>('http://localhost:3030/api/posts/' + id, postUpdated)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.snackBar.open(response.message, 'Okay!', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
    });
  }

  addPost(post) {
    this.http.post<{message: string, postId: string}>('http://localhost:3030/api/posts', post)
      .subscribe((responseData) => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.snackBar.open(responseData.message, 'Okay!', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/']);
    });
  }

  deletePost(id: string) {
    this.http.delete<{message: string}>('http://localhost:3030/api/posts/' + id)
      .subscribe((responsemsg) => {
        const updatedPosts = this.posts.filter(post => post.id !== id);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        console.log(responsemsg.message);
        this.snackBar.open(responsemsg.message, 'Okay!', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
    });
  }
}
