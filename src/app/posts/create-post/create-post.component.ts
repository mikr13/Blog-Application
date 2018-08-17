import { Component, OnInit} from '@angular/core';

import { NgForm } from '@angular/forms';

import { Post } from '../../shared/posts.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  step = 1;
  enteredName = '';
  enteredAge = '';
  enteredEmail = '';
  enteredTitle = '';
  enteredContent = '';
  text = '';

  constructor(public postService: PostsService) {}

  ngOnInit() {
  }

/*
  makeid() {
    this.text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      this.text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return this.text;
  }
*/

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const post = {
      name: form.value.name,
      age: parseInt(form.value.age, 10),
      email: form.value.email,
      title: form.value.title,
      content: form.value.content
    };

    this.postService.addPost(post);
  }

}
