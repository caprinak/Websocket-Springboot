import { Component } from '@angular/core';
import { StockTrackerComponent } from './stock-tracker/stock-tracker.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [StockTrackerComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stock-trader-app';
}
