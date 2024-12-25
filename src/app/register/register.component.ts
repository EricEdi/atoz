import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Initialize form controls with validators
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  register() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;

      this.authService.register(username, email, password).subscribe(
        (response) => {
          this.router.navigate(['/login']);
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
