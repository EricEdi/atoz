import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // Declare the form group
  loginForm: FormGroup = new FormGroup({});

  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Initialize the form group and form controls
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  login() {
    // Check if the form is valid before sending the request
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe(
        (response) => {
          this.router.navigate(['/home']);
        },
        (error) => {
          this.message = error;
        }
      );
    } else {
      this.message = 'Please fill in all fields correctly.';
    }
  }
}
