import { Component, OnDestroy, OnInit } from '@angular/core';
import { StockService } from './stock.service';
import { Stock } from './stock.model';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common'; // For ngFor, ngIf, and number pipe

@Component({
  selector: 'app-stock-tracker',
  standalone: true,
  imports: [FormsModule, CommonModule, DecimalPipe],
  templateUrl: './stock-tracker.component.html',
  styleUrls: ['./stock-tracker.component.css'], 
})
export class StockTrackerComponent implements OnInit, OnDestroy {
  stocks: Stock[] = [];
  connectionStatus: string = 'Disconnected';
  stompEndpoint: string = 'http://localhost:8080/ws'; // Default endpoint, can be changed in UI

  newStockCode: string = '';
  newStockPrice: number | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.stockService.stockUpdates$.subscribe((stocks) => {
        this.stocks = stocks;
      })
    );

    this.subscriptions.add(
      this.stockService.connectionStatus$.subscribe((status) => {
        this.connectionStatus = status;
      })
    );
  }

  connect(): void {
    if (this.stompEndpoint) {
      this.stockService.connect(this.stompEndpoint);
    } else {
      alert('Please provide a STOMP endpoint URL.');
    }
  }

  disconnect(): void {
    this.stockService.disconnect();
  }

  handleAddStock(): void {
    if (this.newStockCode && this.newStockPrice !== null && this.newStockPrice > 0) {
      this.stockService.addStock({
        code: this.newStockCode.toUpperCase(),
        price: this.newStockPrice,
      });
      this.newStockCode = '';
      this.newStockPrice = null;
    } else {
      alert('Please enter a valid stock code and a price greater than 0.');
    }
  }

  get isConnecting(): boolean {
    return this.connectionStatus === 'Connecting';
  }

  get isConnected(): boolean {
    return this.connectionStatus === 'Connected';
  }
  
  get isDisconnected(): boolean {
    return this.connectionStatus === 'Disconnected' || this.connectionStatus.startsWith('Error');
  }

  get isAddStockDisabled(): boolean {
    return !this.isConnected || !this.newStockCode || this.newStockPrice === null || this.newStockPrice <= 0;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.stockService.disconnect(); 
  }
}