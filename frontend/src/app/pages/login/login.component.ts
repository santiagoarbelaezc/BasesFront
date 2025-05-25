import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolService } from '../../services/rol.service';
import { EstudianteService } from '../../services/estudiante.service';
import { ProfesorService } from '../../services/profesor.service';

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

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private estudianteService: EstudianteService,
    private profesorService: ProfesorService 
  ) {}

  onLogin(): void {
  this.isLoading = true;
  this.progressValue = 0;

  this.usuarioService.login(this.username, this.password).subscribe({
    next: async (response: any) => {
      console.log('✅ Login exitoso:', response);
      const usuarioLogin = response.usuario;

      try {
        // 1. Obtener el usuario completo por correo
        const usuarioCompleto = await this.usuarioService.obtenerUsuarioPorCorreo(this.username).toPromise();
        console.log('📩 Usuario obtenido por correo:', usuarioCompleto);

        // 2. Guardar usuario completo en localStorage
        localStorage.setItem('usuario', JSON.stringify(usuarioCompleto));

        // 3. Obtener rol por ID
        const rol = await this.rolService.obtenerRolPorId(usuarioCompleto.rol_id);
        console.log('🔐 Rol obtenido:', rol);

        // 4. Animación de carga y redirección según rol
        const interval = setInterval(() => {
          this.progressValue += 1;
          if (this.progressValue >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              switch (rol.NOMBRE.toUpperCase()) {
                case 'ADMINISTRADOR':
                  this.router.navigate(['/home']);
                  break;
                case 'DOCENTE':
                  this.profesorService.setProfesor(usuarioCompleto);
                  this.router.navigate(['/profesor']);
                  break;

                case 'ESTUDIANTE':

                   // Guardar usuario en el servicio EstudianteService
                  this.estudianteService.setUsuario(usuarioCompleto);
      
                  this.router.navigate(['/presentar']);
                  break;
                default:
                  alert('⚠️ Rol no reconocido. Contacte al administrador.');
                  this.isLoading = false;
                  this.progressValue = 0;
                  break;
              }
            }, 500);
          }
        }, 30);
      } catch (error) {
        console.error('❌ Error al procesar el login:', error);
        alert('Error al verificar el rol o recuperar el usuario.');
        this.isLoading = false;
        this.progressValue = 0;
      }
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
