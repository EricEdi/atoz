import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'atoz';
  router: any;
  constructor(public authService: AuthService) {}

  navigate() {
    if (this.authService.currentUserValue) {
      // If the user is logged in, navigate to home
      this.router.navigate(['/home']);
    } else {
      // If the user is not logged in, navigate to login
      this.router.navigate(['/login']);
    }
  }
}
