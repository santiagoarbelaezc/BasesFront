import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RolService} from '../../../services/rol.service';
import {NavbarComponent} from '../../shared/navbar/navbar.component';


@Component({
  selector: 'app-rol',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css'],
  providers: [RolService]
})
export class RolComponent implements OnInit {
  nombreRol: string = '';
  roles: any[] = [];
  rolSeleccionado: any = null;
  cargando: boolean = false;
  error: string | null = null;
  mensajeExito: String='';

  constructor(private rolService: RolService) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  async cargarRoles(): Promise<void> {
    this.cargando = true;
    this.error = null;
    try {
      const rolesData = await this.rolService.listarRoles();
      console.log('Datos de roles recibidos:', rolesData); // Debug adicional

      // Mapear los datos a la estructura esperada
      this.roles = rolesData.map((item: any) => ({
        ROL_ID: item.ROL_ID || item.id || item.roleId,
        NOMBRE: item.NOMBRE || item.nombre || item.name
      }));

    } catch (error) {
      this.error = 'Error al cargar los roles';
      console.error('Error completo:', error); // Más detalles del error
    } finally {
      this.cargando = false;
    }
  }

  seleccionarRol(rol: any): void {
    this.rolSeleccionado = rol;
    this.nombreRol = rol.NOMBRE;
  }

  async crearRol(): Promise<void> {
    if (!this.nombreRol) return;

    this.cargando = true;
    this.error = null;
    try {
      await this.rolService.crearRol(this.nombreRol);
      this.nombreRol = '';
      await this.cargarRoles();
    } catch (error) {
      this.error = 'Error al crear el rol';
      console.error(error);
    } finally {
      this.cargando = false;
    }
  }

  async actualizarRol() {
    if (!this.rolSeleccionado || !this.nombreRol) return;

    try {
      const rolActualizado = {
        NOMBRE: this.nombreRol
      };

      await this.rolService.actualizarRol(this.rolSeleccionado.ROL_ID, rolActualizado);

      // Cargar de nuevo todos los roles
      await this.cargarRoles();

      // Buscar el rol actualizado en la nueva lista
      const rolRecargado = this.roles.find(r => r.ROL_ID === this.rolSeleccionado.ROL_ID);
      if (rolRecargado) {
        this.seleccionarRol(rolRecargado);  // <-- vuelve a asignar nombreRol
      }

      this.mostrarMensaje('Rol actualizado correctamente');

    } catch (error) {
      console.error('Error al actualizar:', error);
      this.error = 'Error al actualizar el rol. Verifica la consola para más detalles.';
    }
  }


// Método para eliminar rol
  async eliminarRol() {
    if (!this.rolSeleccionado) return;

    if (!confirm(`¿Estás seguro de eliminar el rol "${this.rolSeleccionado.NOMBRE}"?`)) {
      return;
    }

    try {
      await this.rolService.eliminarRol(this.rolSeleccionado.ROL_ID);

      // Limpia la selección y actualiza la lista
      this.rolSeleccionado = null;
      this.nombreRol = '';
      this.cargarRoles();
      this.mostrarMensaje('Rol eliminado correctamente');

    } catch (error) {
      console.error('Error al eliminar:', error);
      this.error = 'Error al eliminar el rol. Verifica la consola para más detalles.';
    }
  }

// Método auxiliar para mostrar mensajes
  mostrarMensaje(mensaje: string) {
    // Implementa tu lógica para mostrar mensajes (puede ser un toast/snackbar)
    console.log(mensaje);
    // O usando una variable en el template:
    this.mensajeExito = mensaje;
    setTimeout(() => this.mensajeExito = '', 3000);
  }



}
