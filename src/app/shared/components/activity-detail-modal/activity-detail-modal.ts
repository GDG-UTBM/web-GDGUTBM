import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import {Activity} from '../../../core/models/Activity.model';

@Component({
  selector: 'app-activity-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-detail-modal.html',
  styleUrls: ['./activity-detail-modal.scss']
})
export class ActivityDetailModalComponent {
  @Input() activity!: Activity;
  @Output() close = new EventEmitter<void>();
  constructor(public languageService: LanguageService) {}
}
