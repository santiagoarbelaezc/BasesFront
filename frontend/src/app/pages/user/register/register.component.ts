import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Para navegar a la página de login después del registro

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,FormsModule,], // Aquí puedes importar otros módulos si es necesario
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Propiedades que se enlazan con los campos del formulario
  nombre: string = '';
  rol: string = '';
  correo: string = '';
  password: string = '';
  grupo: string = '';

  isLoading: boolean = false;
  progressValue: number = 0;

  constructor(private router: Router) {}

  // Método que se ejecuta cuando el usuario envía el formulario
 onRegister(): void {
  // Aquí agregarías la lógica para enviar los datos al servidor, por ejemplo:
  // this.authService.register(this.nombre, this.rol, this.correo, this.password, this.grupo).subscribe(response => {
  //     console.log('Usuario registrado', response);
  // });

  // Activar barra de progreso
  this.isLoading = true;
  this.progressValue = 0;

  const interval = setInterval(() => {
    this.progressValue += 1;
    if (this.progressValue >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 500); // Pequeño delay para la animación de salida
    }
  }, 30); // Actualiza cada 30ms para completar en ~3 segundos
}

  // Método que redirige al login si el usuario ya tiene cuenta
  onLogin(): void {
    this.router.navigate(['/login']);
  }
}
