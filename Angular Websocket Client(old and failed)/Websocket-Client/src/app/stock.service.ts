import { Injectable } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { Stock } from './stock.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private stompClient: Client | null = null;
  private stockUpdatesSubject = new BehaviorSubject<Stock[]>([]);
  public stockUpdates$: Observable<Stock[]> = this.stockUpdatesSubject.asObservable();
  
  private connectionStatusSubject = new BehaviorSubject<string>('Disconnected');
  public connectionStatus$: Observable<string> = this.connectionStatusSubject.asObservable();

  private readonly GUEST_LOGIN = 'guest';
  private readonly GUEST_PASSCODE = 'guest';
  private readonly TOPIC_PRICE = '/topic/price';
  private readonly APP_ADD_STOCK = '/app/addStock';

  private priceSubscription: StompSubscription | undefined;

  constructor() {}

  connect(stompEndpointUrl: string): void {
    if (this.stompClient?.active) {
      console.log('Already connected or attempting to connect.');
      return;
    }

    this.connectionStatusSubject.next('Connecting');
    
    this.stompClient = new Client({
      webSocketFactory: () => {
        // Ensure the URL is absolute if your Angular app is served from a different port than the backend
        // For example, if backend is on 8080 and Angular on 4200:
        // const backendUrl = 'http://localhost:8080'; // Or your actual backend URL
        // return new SockJS(`${backendUrl}${stompEndpointUrl}`);
        return new SockJS(stompEndpointUrl); // Assumes same origin or properly configured proxy
      },
      connectHeaders: {
        login: this.GUEST_LOGIN,
        passcode: this.GUEST_PASSCODE,
      },
      debug: (str) => {
        console.log('STOMP DEBUG: ' + str);
      },
      reconnectDelay: 5000, // Try to reconnect every 5 seconds
      
      onConnect: (frame) => {
        this.connectionStatusSubject.next('Connected');
        console.log('STOMP Connected: ' + frame);
        
        this.priceSubscription = this.stompClient?.subscribe(this.TOPIC_PRICE, (message: IMessage) => {
          try {
            const stocks: Stock[] = JSON.parse(message.body);
            this.stockUpdatesSubject.next(stocks);
          } catch (e) {
            console.error('Error parsing stock data:', e, message.body);
          }
        });
      },
      onDisconnect: (frame) => {
        console.log('STOMP Disconnected: ' + frame);
        // Avoid overriding an error status if disconnect was due to an error
        if (!this.connectionStatusSubject.value.startsWith('Error')) {
            this.connectionStatusSubject.next('Disconnected');
        }
        this.stockUpdatesSubject.next([]); // Clear stocks on disconnect
        this.priceSubscription = undefined;
      },
      onStompError: (frame) => {
        const errorMessage = frame.headers['message'] || 'Unknown STOMP error';
        console.error('Broker reported STOMP error: ' + errorMessage, frame.body);
        this.connectionStatusSubject.next('Error: STOMP - ' + errorMessage);
      },
      onWebSocketError: (errorEvent) => {
        console.error('WebSocket error observed:', errorEvent);
        if (!this.connectionStatusSubject.value.startsWith('Error: STOMP')) {
             this.connectionStatusSubject.next('Error: WebSocket connection failed');
        }
      },
    });

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient?.active) {
      this.stompClient.deactivate(); 
    } else {
      console.log('STOMP client not active or not initialized. Ensuring disconnected state.');
      if (!this.connectionStatusSubject.value.startsWith('Error')) {
        this.connectionStatusSubject.next('Disconnected');
      }
      this.stockUpdatesSubject.next([]);
      this.priceSubscription = undefined;
    }
  }

  addStock(stock: { code: string; price: number }): void {
    if (this.stompClient?.active) {
      this.stompClient.publish({
        destination: this.APP_ADD_STOCK,
        body: JSON.stringify(stock),
      });
    } else {
      console.error('Cannot add stock, STOMP client not connected.');
      alert('Cannot add stock: Not connected to the server.');
    }
  }
}