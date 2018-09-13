import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from '../app/app-routing/app-routing.module';
import { AngularMaterialModule } from './angular-material.module';
import { PostsModule } from './posts/posts.module';
import { AuthenticationModule } from './authentication/authentication.module';

import { AppComponent } from '../app/app.component';
import { HeaderComponent } from '../app/header/header.component';

import { PostsService } from '../app/services/posts.service';
import { UsersService } from '../app/services/users.service';

import { AuthenticationInterceptor } from '../app/interceptors/authentication-interceptor';
import { ErrorInterceptor } from '../app/interceptors/error-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularMaterialModule,
    PostsModule,
    AuthenticationModule
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
