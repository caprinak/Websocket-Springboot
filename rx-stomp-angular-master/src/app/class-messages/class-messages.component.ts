import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RxStompService } from '../rx-stomp.service';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-class-messages',
  templateUrl: './class-messages.component.html',
  styleUrls: ['./class-messages.component.css']
})

export class ClassMessagesComponent implements OnInit, OnDestroy {
  public teacherUsername: string | null = null;
  public receivedEnrollmentMessages: string[] = [];
  private enrollmentSubscription: Subscription | undefined;

  
  constructor(
    private rxStompService: RxStompService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.enrollmentSubscription = this.route.paramMap.pipe(
      switchMap(params => {
        this.teacherUsername = params.get('teacherUsername');
        this.receivedEnrollmentMessages = []; // Clear messages when username changes

        if (!this.teacherUsername) {
          console.warn('Teacher username is not present in the route.');
          return []; // Return an empty observable or handle error appropriately
        }

        const destination = `/user/${this.teacherUsername}/queue/enrollments`;
        console.log(`Subscribing to user-specific queue: ${destination}`);
        return this.rxStompService.watch(destination);
      })
    ).subscribe(
      (message: Message) => {
        this.receivedEnrollmentMessages.push(`Enrollment for ${this.teacherUsername}: ${message.body}`);
        console.log('Received message on user queue:', message.body);
      },
      (error) => {
        console.error(`Error receiving message on user queue for ${this.teacherUsername}:`, error);
      }
    );
  }

  ngOnDestroy(): void {
    this.enrollmentSubscription?.unsubscribe();
  }
}
