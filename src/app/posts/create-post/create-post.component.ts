import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { Post } from '../../shared/posts.model';
import { PostsService } from '../../services/posts.service';
import { UsersService } from '../../services/users.service';

import { mimeType } from '../../shared/mime-type.validator';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit, OnDestroy {

  private mode = 'create';
  private postId: string;
  private post: Post;
  isLoading = false;
  form: FormGroup;
  protected imagePreview: string;
  private userData = null;
  private authListenerSubs: Subscription;

  constructor(public postService: PostsService, public route: ActivatedRoute, private userService: UsersService) { }

  ngOnInit() {
    
    this.authListenerSubs = this.userService.getAuthStatusListener().subscribe(status => {
        this.isLoading = false;
    });

    this.form = new FormGroup({
      name: new FormControl(null, {validators: [
        Validators.required,
        Validators.minLength(3),
        // tslint:disable-next-line:quotemark
        Validators.pattern("^[a-zA-Z ]{3,30}$")
      ]}),
      email: new FormControl(null, {validators: [
        Validators.required,
        // tslint:disable-next-line:max-line-length quotemark
        Validators.pattern("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
      ]}),
      title: new FormControl(null, {validators: [
        Validators.required,
        // tslint:disable-next-line:quotemark
        Validators.pattern("^[0-9a-zA-Z!.&:?@,\'\"() ]{3,60}$")
      ]}),
      content: new FormControl(null, {validators: [
        Validators.required,
        // tslint:disable-next-line:quotemark
        Validators.pattern("^[0-9a-zA-Z!.&:?@,\'\"() ]{300,}$")
      ]}),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId)
          .subscribe(postData => {
            this.isLoading = false;
            this.post = postData.post;
            this.form.setValue({
              name: this.post.name,
              email: this.post.email,
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });
          }, (error) => {
            this.isLoading = false;
          });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.userData = this.userService.getUser();
        if (this.userData) {
          this.form.setValue({
            name: this.userData.name,
            email: this.userData.email,
            title: '',
            content: '',
            image: ''
          });
        }
      }
    });
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

  onImagePicker(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = <string>reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.userData = this.userService.getUser();
    const post = {
      name: this.userData.name,
      email: this.userData.email,
      title: this.form.value.title,
      content: this.form.value.content,
      image: this.form.value.image
    };
    if (this.mode === 'create') {
      this.postService.addPost(post);
    } else {
      this.postService.updatePost(this.postId, post);
    }
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
