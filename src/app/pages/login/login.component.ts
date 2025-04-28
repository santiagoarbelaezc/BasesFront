import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin(): void {
    this.router.navigate(['/home']); // Redirige después de login exitoso
  }

  onRegister(): void {
    this.router.navigate(['/register']); // Redirige al componente de registro
  }

}
