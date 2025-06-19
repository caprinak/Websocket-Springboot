// // src/app/notification.service.ts (or your relevant service)

// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { Client, IMessage, StompSubscription, IStompSocket } from '@stomp/stompjs';
// import SockJS from 'sockjs-client'; // If you are using SockJS
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class NotificationService {
//   private stompClient: Client | null = null;
//   public connectionStatus$ = new BehaviorSubject<boolean>(false);
//   // ... other subjects for messages

//   // Example WebSocket URL
//   private readonly webSocketUrl = 'http://localhost:8080/ws'; // Replace with your actual backend WebSocket endpoint

//   constructor(@Inject(PLATFORM_ID) private platformId: Object) {
//     // Only initialize and connect if in the browser
//     if (isPlatformBrowser(this.platformId)) {
//       this.initializeStompClient();
//       this.activate();
//     } else {
//       console.log('NotificationService: Skipping WebSocket initialization on the server.');
//       this.connectionStatus$.next(false);
//     }
//   }

//   private initializeStompClient(): void {
//     this.stompClient = new Client({
//       // brokerURL: 'ws://localhost:8080/ws', // Use this if not using SockJS
//       webSocketFactory: () => {
//         // Ensure SockJS is only instantiated in the browser as well
//         if (isPlatformBrowser(this.platformId)) {
//           return new SockJS(this.webSocketUrl);
//         }
//         // Return a dummy or no-op object if on server,
//         // though the outer check should prevent this from being called on server.
//         // However, for robustness:
//         return {
//           close: () => {},
//           send: () => {},
//           onmessage: null,
//           onopen: null,
//           onclose: null,
//           onerror: null,
//           readyState: 3 // CLOSED
//          } as any; // Type assertion for dummy object
//       },
//       connectHeaders: {
//         // login: 'guest', // Add your auth headers if needed
//         // passcode: 'guest'
//       },
//       debug: (str) => {
//         console.log('STOMP DEBUG:', str);
//       },
//       reconnectDelay: 5000,
//       heartbeatIncoming: 4000,
//       heartbeatOutgoing: 4000,
//       onConnect: (frame) => {
//         console.log('NotificationService: Connected to STOMP server', frame);
//         this.connectionStatus$.next(true);
//         // Now subscribe to topics, e.g., in your component or here
//         // this.subscribeToUserNotifications('someUser');
//         // this.subscribeToGroupNotifications('someGroup');
//       },
//       onStompError: (frame) => {
//         console.error('NotificationService: STOMP error', frame.headers['message'], frame.body);
//         this.connectionStatus$.next(false);
//       },
//       onWebSocketError: (event) => {
//         console.error('NotificationService: WebSocket error', event);
//         this.connectionStatus$.next(false);
//       },
//       onDisconnect: (frame) => {
//         console.log('NotificationService: Disconnected from STOMP server', frame);
//         this.connectionStatus$.next(false);
//       }
//     });
//   }

//   public activate(): void {
//     if (isPlatformBrowser(this.platformId) && this.stompClient && !this.stompClient.active) {
//       console.log('NotificationService: Activating STOMP client...');
//       this.stompClient.activate();
//     } else if (!isPlatformBrowser(this.platformId)) {
//       console.log('NotificationService: Cannot activate STOMP client on the server.');
//     } else if (!this.stompClient) {
//       console.warn('NotificationService: STOMP client not initialized before activate call.');
//     }
//   }

//   public deactivate(): void {
//     if (isPlatformBrowser(this.platformId) && this.stompClient && this.stompClient.active) {
//       console.log('NotificationService: Deactivating STOMP client...');
//       this.stompClient.deactivate();
//       this.connectionStatus$.next(false);
//     }
//   }

//   // Example subscription methods (adapt as needed)
//   public subscribeToUserNotifications(username: string, callback: (message: IMessage) => void): StompSubscription | null {
//     if (isPlatformBrowser(this.platformId) && this.stompClient && this.stompClient.active) {
//       const destination = `/user/${username}/queue/enrollments`; // Or your specific user destination
//       console.log(`NotificationService: Subscribing to ${destination}`);
//       return this.stompClient.subscribe(destination, callback);
//     }
//     console.warn('NotificationService: Cannot subscribe. Client not active or not in browser.');
//     return null;
//   }

//   public subscribeToGroupNotifications(groupId: string, callback: (message: IMessage) => void): StompSubscription | null {
//     if (isPlatformBrowser(this.platformId) && this.stompClient && this.stompClient.active) {
//       const destination = `/topic/group/${groupId}/enrollments`; // Or your specific group topic
//       console.log(`NotificationService: Subscribing to ${destination}`);
//       return this.stompClient.subscribe(destination, callback);
//     }
//     console.warn('NotificationService: Cannot subscribe. Client not active or not in browser.');
//     return null;
//   }

//   // Method to send messages (e.g., if your client needs to send STOMP messages)
//   // public sendMessage(destination: string, body: string): void {
//   //   if (isPlatformBrowser(this.platformId) && this.stompClient && this.stompClient.active) {
//   //     this.stompClient.publish({ destination, body });
//   //   } else {
//   //     console.warn('NotificationService: Cannot send message. Client not active or not in browser.');
//   //   }
//   // }
// }