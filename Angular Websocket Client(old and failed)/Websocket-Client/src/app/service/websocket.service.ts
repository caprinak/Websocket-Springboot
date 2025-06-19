// // src/app/websocket.service.ts
// import { Injectable } from '@angular/core';
// import { Observable, Subject } from 'rxjs';
// import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebsocketService2 {
//   private socket$!: WebSocketSubject<any>;
//   private messagesSubject = new Subject<any>();
//   public messages$: Observable<any> = this.messagesSubject.asObservable();

//   // Replace with your actual WebSocket endpoint URL
//   private readonly WS_ENDPOINT = 'ws://localhost:8080/your-websocket-endpoint';

//   constructor() {}

//   public connect(): void {
//     if (!this.socket$ || this.socket$.closed) {
//       this.socket$ = webSocket(this.WS_ENDPOINT); // Uses RxJS WebSocketSubject

//       this.socket$.subscribe({
//         next: (msg) => {
//           console.log('Received message:', msg);
//           this.messagesSubject.next(msg);
//         },
//         error: (err) => {
//           console.error('WebSocket error:', err);
//           // Optionally, you can try to reconnect here or notify the user
//         },
//         complete: () => {
//           console.log('WebSocket connection closed');
//           // Optionally, handle completion, e.g., by trying to reconnect
//         }
//       });
//     }
//   }

//   public sendMessage(message: any): void {
//     if (this.socket$) {
//       this.socket$.next(message);
//       console.log('Sent message:', message);
//     } else {
//       console.error('WebSocket is not connected.');
//     }
//   }

//   public closeConnection(): void {
//     if (this.socket$) {
//       this.socket$.complete(); // Closes the connection
//     }
//   }
// }