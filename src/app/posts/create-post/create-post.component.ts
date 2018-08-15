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

  constructor(public postService: PostsService) {}

  ngOnInit() {
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const post: Post = {
      name: form.value.name,
      age: parseInt(form.value.age, 10),
      email: form.value.email,
      title: form.value.title,
      content: form.value.content
    };

    this.postService.addPost(post);
  }

}
