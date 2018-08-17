import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from '../shared/posts.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

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

  addPost(post) {
    this.http.post<{message: string, postId: string}>('http://localhost:3030/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(id: string) {
    this.http.delete<{message: string}>('http://localhost:3030/api/posts/' + id)
      .subscribe((responsemsg) => {
        const updatedPosts = this.posts.filter(post => post.id !== id);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        console.log(responsemsg.message);
      });
  }
}
