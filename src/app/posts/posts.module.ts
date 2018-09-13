import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from './../angular-material.module';

import { ListPostsComponent } from './list-posts/list-posts.component';
import { CreatePostComponent } from './create-post/create-post.component';


@NgModule({
  declarations: [
    ListPostsComponent,
    CreatePostComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AngularMaterialModule
  ]
})
export class PostsModule { }
