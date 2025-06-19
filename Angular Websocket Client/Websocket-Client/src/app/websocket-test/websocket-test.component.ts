// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Subscription } from 'rxjs';
// import { NotificationService } from '../service/notification.service'; // Import the STOMP service
// import { TestNotificationService } from '../service/test-notification.service'; // To trigger notifications

// @Component({
//   selector: 'app-websocket-test',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './websocket-test.component.html',
//   styleUrls: ['./websocket-test.component.css'],
//   // No local providers needed for NotificationService as it's root-provided
// })
// export class WebsocketTestComponent implements OnInit, OnDestroy {
//   connectionStatus: boolean = false;
//   userEnrollmentMessages: any[] = [];
//   groupEnrollmentMessages: any[] = [];
  
//   usernameToTrigger: string = 'testUser';
//   groupIdToSubscribe: string = 'group1';
//   subscribedGroupId: string | null = null;

//   private connectionSubscription: Subscription | undefined;
//   private userMessagesSubscription: Subscription | undefined;
//   private groupMessagesSubscription: Subscription | undefined;

//   constructor(
//     public notificationService: NotificationService, // Made public for template access if needed
//     private testNotificationService: TestNotificationService
//   ) {}

//   ngOnInit(): void {
//     // Connect to the STOMP service
//     this.notificationService.connect();

//     this.connectionSubscription = this.notificationService.connected$.subscribe(status => {
//       this.connectionStatus = status;
//       if (status) {
//         console.log('WebsocketTestComponent: Connected to NotificationService');
//         // NotificationService automatically subscribes to user enrollments on connect
//       } else {
//         console.log('WebsocketTestComponent: Disconnected from NotificationService');
//       }
//     });

//     this.userMessagesSubscription = this.notificationService.userEnrollmentMessages$.subscribe(message => {
//       if (message) {
//         console.log('WebsocketTestComponent: Received user enrollment message:', message);
//         this.userEnrollmentMessages.push(message);
//       }
//     });

//     this.groupMessagesSubscription = this.notificationService.groupEnrollmentMessages$.subscribe(message => {
//       if (message) {
//         console.log('WebsocketTestComponent: Received group enrollment message:', message);
//         this.groupEnrollmentMessages.push(message);
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     this.connectionSubscription?.unsubscribe();
//     this.userMessagesSubscription?.unsubscribe();
//     this.groupMessagesSubscription?.unsubscribe();
//     // Disconnect from STOMP service when component is destroyed
//     this.notificationService.disconnect();
//   }

//   triggerTestUserNotification(): void {
//     if (!this.usernameToTrigger) {
//       alert('Please enter a username to trigger the notification.');
//       return;
//     }
//     this.testNotificationService.sendTestUserNotification(this.usernameToTrigger).subscribe({
//       next: response => console.log('Test user notification sent:', response),
//       error: err => console.error('Error sending test user notification:', err)
//     });
//   }

//   subscribeToGroup(): void {
//     if (!this.groupIdToSubscribe) {
//       alert('Please enter a Group ID to subscribe.');
//       return;
//     }
//     this.notificationService.subscribeToGroupEnrollments(this.groupIdToSubscribe);
//     this.subscribedGroupId = this.groupIdToSubscribe;
//     this.groupEnrollmentMessages = []; // Clear previous messages
//   }

//   clearMessages(): void {
//     this.userEnrollmentMessages = [];
//     this.groupEnrollmentMessages = [];
//   }
// }