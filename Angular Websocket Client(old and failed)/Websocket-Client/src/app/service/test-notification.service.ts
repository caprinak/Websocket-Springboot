// // src/app/test-notification.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class TestNotificationService {
//   private baseUrl = 'http://localhost:8080/api/test-notifications'; // Adjust if your backend runs elsewhere

//   constructor(private http: HttpClient) { }

//   sendTestUserNotification(username: string): Observable<string> {
//     // The body for this POST request is empty as per the backend controller
//     return this.http.post(`${this.baseUrl}/user/${username}`, {}, { responseType: 'text' });
//   }

//   sendTestUserDtoNotification(username: string): Observable<string> {
//     // The body for this POST request is empty as per the backend controller
//     return this.http.post(`${this.baseUrl}/user-dto/${username}`, {}, { responseType: 'text' });
//   }
// }