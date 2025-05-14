import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './question-bank.component.html',
  styleUrl: './question-bank.component.css'
})
export class QuestionBankComponent {

}
