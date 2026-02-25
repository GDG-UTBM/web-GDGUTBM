import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {LanguageService} from '../../../core/services/language.service';
import {AuthService} from '../../../core/services/auth.service';
import {JoinModalComponent} from '../../../shared/components/join-modal/join-modal';
import {TopicModalComponent} from '../../../shared/components/topic-modal/topic-modal';

@Component({
  selector: 'app-final-cta',
  standalone: true,
  imports: [
    CommonModule,
    JoinModalComponent,
    TopicModalComponent
  ],
  templateUrl: 'final-cta.html',
  styleUrls: ['./final-cta.scss']
})
export class FinalCtaComponent{
  showJoinModal = signal(false);
  showTopicModal = signal(false);

  constructor(public languageService: LanguageService,  public authService: AuthService,) {
  }

  openJoinModal() {
    this.showJoinModal.set(true);
  }

  openTopicModal() {
    this.showTopicModal.set(true);
  }

  closeJoinModal() {
    this.showJoinModal.set(false);
  }

  closeTopicModal() {
    this.showTopicModal.set(false);
  }

  onRegisterSuccess() {
    // hook for future behavior; keep modal flow consistent with header
  }
}
