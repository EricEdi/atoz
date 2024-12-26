import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-side',
  standalone: false,
  
  templateUrl: './side.component.html',
  styleUrl: './side.component.css'
})
export class SideComponent {
constructor(public authService: AuthService) {}
}
