import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { ClassMessagesComponent } from './class-messages/class-messages.component';

const routes: Routes = [
  { path: 'messages', component: MessagesComponent },
  { path: 'class-messages/:teacherUsername', component: ClassMessagesComponent },
  // Optional: Add a default route or a redirect
  { path: '', redirectTo: '/messages', pathMatch: 'full' },
  // Optional: Add a wildcard route for 404
  // { path: '**', component: PageNotFoundComponent }, // You'd need to create PageNotFoundComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }