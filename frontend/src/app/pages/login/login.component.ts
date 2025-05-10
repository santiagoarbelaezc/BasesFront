import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service'; // Ajusta el path si es necesario
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  onLogin(): void {
    this.usuarioService.login(this.username, this.password).subscribe({
      next: res => {
        console.log(res);
        this.router.navigate(['/home']);
      },
      error: err => {
        alert('Credenciales incorrectas');
        console.error(err);
      }
    });
  }

  onRegister(): void {
    this.usuarioService.register(this.username, this.password).subscribe({
      next: res => {
        alert('Usuario registrado');
      },
      error: err => {
        alert('Error al registrar');
        console.error(err);
      }
    });
  }
}
