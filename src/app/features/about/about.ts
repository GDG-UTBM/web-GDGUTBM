import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import {TeamMember} from '../../core/models/TeamMember.model';
import {RouterLink} from '@angular/router';



@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: 'about.html' ,
  styles: []
})
export class AboutComponent implements OnInit {
  team: TeamMember[] = [
    {
      name: 'Jean Dupont',
      role: 'Organisateur',
      linkedin: '#',
      github: '#'
    },
    {
      name: 'Marie Martin',
      role: 'Responsable Événements',
      linkedin: '#'
    },
    {
      name: 'Pierre Durand',
      role: 'Lead Technique',
      github: '#'
    },
    {
      name: 'Sophie Lefebvre',
      role: 'Community Manager',
      linkedin: '#'
    }
  ];

  constructor(public languageService: LanguageService, public authService: AuthService) {}

  ngOnInit(): void {}
}
