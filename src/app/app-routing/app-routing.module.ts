import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListPostsComponent } from '../posts/list-posts/list-posts.component';
import { CreatePostComponent } from '../posts/create-post/create-post.component';

import { AuthGuard } from '../interceptors/auth.guard';

const routes: Routes = [
    { path: '', component: ListPostsComponent },
    { path: 'create', component: CreatePostComponent, canActivate: [AuthGuard] },
    { path: 'edit/:postId', component: CreatePostComponent, canActivate: [AuthGuard] },
    /* lazy loading authentication part */
    { path: 'auth', loadChildren: '../authentication/authentication.module#AuthenticationModule'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}
