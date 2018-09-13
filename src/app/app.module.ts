import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from '../app/app-routing/app-routing.module';
import { AngularMaterialModule } from './angular-material.module';

import { AppComponent } from '../app/app.component';
import { CreatePostComponent } from '../app/posts/create-post/create-post.component';
import { HeaderComponent } from '../app/header/header.component';
import { ListPostsComponent } from '../app/posts/list-posts/list-posts.component';
import { LoginComponent } from '../app/authentication/login/login.component';
import { SignupComponent } from '../app/authentication/signup/signup.component';

import { PostsService } from '../app/services/posts.service';
import { UsersService } from '../app/services/users.service';

import { AuthenticationInterceptor } from '../app/interceptors/authentication-interceptor';
import { ErrorInterceptor } from '../app/interceptors/error-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    CreatePostComponent,
    HeaderComponent,
    ListPostsComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    AngularMaterialModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    PostsService,
    UsersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
