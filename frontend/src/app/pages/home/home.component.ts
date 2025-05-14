import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [FormsModule,CommonModule, NavbarComponent], // Aquí puedes importar otros módulos si es necesario
  standalone: true,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
}
