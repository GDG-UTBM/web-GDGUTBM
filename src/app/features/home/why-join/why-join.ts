import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-why-join',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-join.html',
  styleUrls: ['./why-join.scss']
})
export class WhyJoinComponent {
  constructor(public languageService: LanguageService) {}
}
