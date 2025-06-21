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
  public teacherId: string | null = null;
  public receivedEnrollmentMessages: string[] = [];
  private enrollmentSubscription: Subscription | undefined;

  
  constructor(
    private rxStompService: RxStompService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.enrollmentSubscription = this.route.paramMap.pipe(
      switchMap(params => {
        this.teacherId = params.get('teacherId');
        this.receivedEnrollmentMessages = []; // Clear messages when username changes

        if (!this.teacherId) {
          console.warn('Teacher username is not present in the route.');
          return []; // Return an empty observable or handle error appropriately
        }

        const destination = `/user/${this.teacherId}/queue/enrollments`;
        console.log(`Subscribing to user-specific queue: ${destination}`);
        return this.rxStompService.watch(destination);
      })
    ).subscribe(
      (message: Message) => {
  try {
    // The backend sends a JSON string, so we parse it into an object
    const notificationPayload = JSON.parse(message.body);

    // Now you can work with the object's properties
    console.log('Received notification object:', notificationPayload);
    this.receivedEnrollmentMessages.push(JSON.stringify(notificationPayload)); // Store the whole object

  } catch (e) {
    console.error('Could not parse incoming message as JSON:', message.body);
    // Fallback for non-JSON messages if needed
    this.receivedEnrollmentMessages.push(message.body);
  }
},
      (error) => {
        console.error(`Error receiving message on user queue for ${this.teacherId}:`, error);
      }
    );

    
  }

  ngOnDestroy(): void {
    this.enrollmentSubscription?.unsubscribe();
  }
}
