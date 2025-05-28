import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CategoriaService } from '../../../services/categoria.service';
import { CategoriaDTO } from '../../../models/categoria.dto';
import { NavbarProfesorComponent } from '../../shared/navbar-profesor/navbar-profesor.component';


@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarProfesorComponent],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent implements OnInit {
  categorias: CategoriaDTO[] = [];
  categoriaSeleccionada: CategoriaDTO | null = null;
  nombreCategoria: string = '';
  cargando = false;
  error = '';

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.cargando = true;
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las categorías.';
        this.cargando = false;
      }
    });
  }

  seleccionarCategoria(cat: CategoriaDTO) {
    this.categoriaSeleccionada = { ...cat };
    this.nombreCategoria = cat.nombre;
  }

  crearCategoria() {
    const nueva = { nombre: this.nombreCategoria };
    this.categoriaService.insertarCategoria(nueva).subscribe(() => {
      this.nombreCategoria = '';
      this.obtenerCategorias();
    });
  }

actualizarCategoria() {
  if (this.categoriaSeleccionada?.categoria_id !== undefined && this.nombreCategoria) {
    const actualizada = { nombre: this.nombreCategoria };
    this.categoriaService.actualizarCategoria(this.categoriaSeleccionada.categoria_id, actualizada)
      .subscribe(() => {
        this.nombreCategoria = '';
        this.categoriaSeleccionada = null;
        this.obtenerCategorias();
      });
  }
}


eliminarCategoria() {
  if (this.categoriaSeleccionada?.categoria_id !== undefined) {
    this.categoriaService.eliminarCategoria(this.categoriaSeleccionada.categoria_id).subscribe(() => {
      this.nombreCategoria = '';
      this.categoriaSeleccionada = null;
      this.obtenerCategorias();
    });
    }
  }
}
