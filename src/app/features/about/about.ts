import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import {TeamMember} from '../../core/models/TeamMember.model';
import {RouterLink} from '@angular/router';
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer';



@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteFooterComponent],
  templateUrl: 'about.html',
  styleUrls: ['./about.scss']
})
export class AboutComponent implements OnInit {
  team: TeamMember[] = [
    {
      name: 'Steeven Yiemtsa',
      role: 'Lead Technique',
      linkedin: 'https://www.linkedin.com/in/steeven-yiemtsa-846515310/',
      github: 'https://github.com/steeven481?tab=repositories'
    },
    {
      name: 'Guillaume Schneider',
      role: 'Responsable Événements',
      linkedin: '#'
    },
    {
      name: 'Faycal Bijji',
      role: 'Community Manage',
      github: '#'
    },
  ];

  constructor(public languageService: LanguageService, public authService: AuthService) {}

  ngOnInit(): void {}
}
