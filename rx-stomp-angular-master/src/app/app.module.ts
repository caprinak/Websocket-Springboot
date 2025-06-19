import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Keep FormsModule if MessagesComponent still uses it

import { AppRoutingModule } from './app-routing.module'; // Import AppRoutingModule
import { AppComponent } from './app.component';
import { RxStompService } from './rx-stomp.service';
import { rxStompServiceFactory } from './rx-stomp-service-factory';
import { MessagesComponent } from './messages/messages.component';
import { ClassMessagesComponent } from './class-messages/class-messages.component'; // Ensure this is imported

@NgModule({
  declarations: [AppComponent, MessagesComponent, ClassMessagesComponent], // Add ClassMessagesComponent
  imports: [BrowserModule, AppRoutingModule, FormsModule], // Add AppRoutingModule and FormsModule
  providers: [
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
