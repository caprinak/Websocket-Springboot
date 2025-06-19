import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Import provideHttpClient
import { AppComponent } from './app.component'; // Import AppComponent

// Define routes directly or import from app.routes.ts if you prefer to keep them separate
const routes: Routes = [
   { path: '', component: AppComponent }, // Or a dedicated HomeComponent if you refactor app.component
  // For now, let's make the original app component content not directly routable,
  // and it will just host the router-outlet and nav.
  // If you want the original content on a path, create a HomeComponent and route to it.
 // { path: 'websocket-test', component: WebsocketTestComponent }, // Ensure you import this component
  //{ path: '', redirectTo: '/websocket-test', pathMatch: 'full' } // Default route
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Correctly provide router
    provideHttpClient() // Add HttpClient provider
  ]
};