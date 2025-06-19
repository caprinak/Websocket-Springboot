import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngIf, json pipe
import { FormsModule } from '@angular/forms';   // Required for [(ngModel)]
import { RouterModule } from '@angular/router';
import { StockTrackerComponent } from "./stock-tracker/stock-tracker.component"; // Import RouterModule

@Component({
  selector: 'app-root', // This matches the tag in index.html
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule // Add RouterModule here
    ,
    StockTrackerComponent
],
  templateUrl: './app.component.html', // Points to your renamed HTML file
  styleUrls: ['./app.component.css'] // You can create an app.component.css file for styles
})
export class AppComponent {
  isConnected: boolean = false; // Example initial value
  userEnrollment: any = null;   // Example initial value
  groupIdToSubscribe: string = '';
  groupEnrollment: any = null;  // Example initial value

  constructor() {
    // Initialize WebSocket connection logic here
    // For now, let's simulate a connection
    setTimeout(() => {
      this.isConnected = true;
      this.userEnrollment = { message: "User specific data received!" };
    }, 2000);
  }

  subscribeToGroup(): void {
    console.log(`Subscribing to group: ${this.groupIdToSubscribe}`);
    // Add actual subscription logic here
    this.groupEnrollment = { message: `Data for group ${this.groupIdToSubscribe}!` };
  }
}