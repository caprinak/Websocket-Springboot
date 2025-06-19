import { Component, OnDestroy, OnInit } from '@angular/core';
import { RxStompService } from '../rx-stomp.service';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  receivedMessages: string[] = [];
  // @ts-ignore, to suppress warning related to being undefined
  private topicSubscription: Subscription;

  constructor(private rxStompService: RxStompService) {}

  ngOnInit() {
    this.topicSubscription = this.rxStompService
      .watch('/topic/price')
      .subscribe((message: Message) => {
        this.receivedMessages.push(message.body);
        console.log('Received message:', message.body);
      });
  }

  ngOnDestroy() {
    this.topicSubscription.unsubscribe();
  }

  onSendMessage() {
    const message = `aloha new day ${new Date()}`;
    this.rxStompService.publish({ destination: '/topic/price', body: message });
  }
}
