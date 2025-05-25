import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private apiUrl = 'http://localhost:3000/api/roles';

  constructor() { }

  // Crear un nuevo rol
  async crearRol(nombre: string): Promise<{ mensaje: string }> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre }),
    });

    if (!response.ok) {
      throw new Error('Error al crear el rol');
    }

    return await response.json();
  }

  // Listar todos los roles
  async listarRoles(): Promise<{ ROL_ID: number; NOMBRE: string }[]> {
    const response = await fetch(this.apiUrl);

    if (!response.ok) {
      throw new Error('Error al obtener los roles');
    }

    const data = await response.json();
    console.log('Datos recibidos del API:', data); // <-- Agregar esto para debug
    return data;
  }

  // Actualizar un rol existente
  // Método para actualizar rol
  async actualizarRol(rolId: number, rolData: any): Promise<any> {
    try {
      // ✅ Validación previa
      if (!rolData.nombre || rolData.nombre.trim() === '') {
        throw new Error('El nombre del rol no puede estar vacío');
      }
      // 🔍 Mostrar datos para verificar
      console.log('📤 Enviando datos para actualizar:', rolData);
      const response = await fetch(`${this.apiUrl}/${rolId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(rolData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Detalles del error en backend:', errorData);
        throw new Error(errorData.message || 'Error al actualizar el rol');
      }
      return await response.json();
    } catch (error) {
      console.error('🚨 Error en la solicitud de actualización:', error);
      throw error;
    }
  }


  // Eliminar un rol
  // Método para eliminar rol
  async eliminarRol(rolId: number): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/${rolId}`, {
        method: 'DELETE',
        headers: {
          // Añade esto si tu API requiere autenticación
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Detalles del error:', errorData);
        throw new Error(errorData.message || 'Error al eliminar el rol');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en la solicitud:', error);
      throw error;
    }
  }

   // Obtener un rol por ID
  async obtenerRolPorId(rolId: number): Promise<{ ROL_ID: number; NOMBRE: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/${rolId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Rol no encontrado');
        }
        throw new Error('Error al obtener el rol');
      }

      const data = await response.json();
      console.log('Datos del rol recibidos:', data);
      return data;
    } catch (error) {
      console.error('Error al obtener el rol:', error);
      throw error;
    }
  }
}
