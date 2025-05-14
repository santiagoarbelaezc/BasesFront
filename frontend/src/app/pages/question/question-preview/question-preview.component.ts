import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-question-preview',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './question-preview.component.html',
  styleUrl: './question-preview.component.css'
})
export class QuestionPreviewComponent {

}
