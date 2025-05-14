import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RolService } from '../../../services/rol.service';
import { UsuarioService } from '../../../services/usuario.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { UsuarioDTO } from '../../../models/usuario.dto';
import { firstValueFrom } from 'rxjs';
import {CrearUsuarioDTO} from '../../../models/crearUsuario.dto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // Propiedades del formulario
  nombre = '';
  apellido = '';
  correo = '';
  password = '';
  confirmPassword = '';
  rolSeleccionado: number | null = null;

  // Listados y estados
  rolesDisponibles: { ROL_ID: number, NOMBRE: string }[] = [];
  usuariosRegistrados: UsuarioDTO[] = []; // Corregido: Array de UsuarioDTO
  cargandoRoles = true;
  cargandoUsuarios = true;
  errorCargaRoles = false;
  errorCargaUsuarios = false;
  isLoading = false;
  progressValue = 0;
  isSubmitting = false;
  errorRegistro: string | null = null;
  registroExitoso = false;

  constructor(
    private router: Router,
    private rolService: RolService,
    private usuarioService: UsuarioService
  ) {}

  async ngOnInit() {
    await Promise.all([
      this.cargarRoles(),
      this.cargarUsuarios()
    ]);
  }

  async cargarRoles() {
    this.cargandoRoles = true;
    this.errorCargaRoles = false;

    try {
      this.rolesDisponibles = await this.rolService.listarRoles();
    } catch (error) {
      console.error('Error al cargar roles:', error);
      this.errorCargaRoles = true;
    } finally {
      this.cargandoRoles = false;
    }
  }

  async cargarUsuarios() {
    this.cargandoUsuarios = true;
    this.errorCargaUsuarios = false;

    try {
      const usuarios = await firstValueFrom(this.usuarioService.obtenerUsuarios());


      this.usuariosRegistrados = usuarios.map((u: any[]) => ({
        nombre: u[1],
        apellido: u[2],
        correo: u[3],
        contrasena: '',
        rol_id: u[4]
      }));

    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.errorCargaUsuarios = true;
    } finally {
      this.cargandoUsuarios = false;
    }
  }


  obtenerNombreRol(rolId: number): string {
    const rol = this.rolesDisponibles.find(r => r.ROL_ID === rolId);
    return rol ? rol.NOMBRE : 'Desconocido';
  }

  async onRegister(form: NgForm) {
    console.log('Intento de registro', form.valid, form.value);

    if (form.invalid || this.isSubmitting) return;

    if (this.password !== this.confirmPassword) {
      this.errorRegistro = 'Las contraseñas no coinciden';
      return;
    }

    if (!this.rolSeleccionado) {
      this.errorRegistro = 'Debe seleccionar un rol';
      return;
    }

    this.isSubmitting = true;
    this.isLoading = true;
    this.progressValue = 0;
    this.errorRegistro = null;
    this.registroExitoso = false;

    const usuarioData: CrearUsuarioDTO = {
      nombre: this.nombre.trim(),
      apellido: this.apellido.trim(),
      correo: this.correo.trim(),
      contrasena: this.password,
      rol_id: this.rolSeleccionado
    };

    try {
      const progressInterval = setInterval(() => {
        this.progressValue = Math.min(this.progressValue + 10, 90);
        if (this.progressValue >= 90) clearInterval(progressInterval);
      }, 300);

      await firstValueFrom(this.usuarioService.register(usuarioData));

      clearInterval(progressInterval);
      this.progressValue = 100;
      this.registroExitoso = true;

      // Recargar la lista de usuarios después de registrar uno nuevo
      await this.cargarUsuarios();

      setTimeout(() => {
        form.resetForm();
        this.rolSeleccionado = null;
        this.registroExitoso = false;
      }, 2000);

    } catch (error: any) {
      console.error('Error en registro:', error);
      this.progressValue = 0;
      this.errorRegistro = error?.error?.message || error?.message || 'Error desconocido al registrar usuario';
    } finally {
      this.isSubmitting = false;
      this.isLoading = false;
    }
  }

  editarUsuario(usuario: UsuarioDTO) {
    // Lógica para editar usuario
    console.log('Editar usuario:', usuario);
    // Puedes implementar:
    // - Abrir un modal de edición
    // - Redirigir a una página de edición
    // - Cargar los datos en el formulario principal
  }

  async eliminarUsuario(usuario: UsuarioDTO) {
    // Verificación robusta del ID
    if (typeof usuario.id !== 'number' || usuario.id <= 0) {
      console.error('ID de usuario inválido');
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar a ${usuario.nombre} ${usuario.apellido}?`)) {
      return;
    }

    try {
      this.isLoading = true;
      this.errorRegistro = null;

      // Llamada correcta al servicio
      const response = await firstValueFrom(
        this.usuarioService.eliminarUsuario(usuario.id)
      );

      console.log('Respuesta del servidor:', response);

      // Recargar lista y mostrar feedback
      await this.cargarUsuarios();
      this.registroExitoso = true;
      setTimeout(() => this.registroExitoso = false, 3000);

    } catch (error: any) {
      console.error('Error al eliminar usuario:', error);
      this.errorRegistro = error.error?.message ||
        error.message ||
        'Error al eliminar el usuario';
    } finally {
      this.isLoading = false;
    }
  }

}

