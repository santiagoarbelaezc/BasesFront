import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isLoading: boolean = false;
  progressValue: number = 0;

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  onLogin(): void {
    this.isLoading = true;
    this.progressValue = 0;

    // Llamada al backend
    this.usuarioService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        console.log('✅ Login exitoso:', response);

        // Opcional: almacenar datos del usuario
        localStorage.setItem('usuario', JSON.stringify(response.usuario));

        // Inicia animación de carga
        const interval = setInterval(() => {
          this.progressValue += 1;
          if (this.progressValue >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 500);
          }
        }, 30);
      },
      error: (error) => {
        this.isLoading = false;
        this.progressValue = 0;
        alert(error.error?.error || '❌ Error al iniciar sesión');
        console.error('Login error:', error);
      }
    });
  }

}
