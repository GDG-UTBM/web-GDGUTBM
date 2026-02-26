import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TopicsService } from '../../../core/services/topics.service';
import { UsersService } from '../../../core/services/users.service';
import { EventsService } from '../../../core/services/events.service';
import { LanguageService } from '../../../core/services/language.service';
import {ActivitiesService} from '../../../core/services/activities.service';
import { ParticipantsService } from '../../../core/services/participants.service';
import { NotificationsService } from '../../../core/services/notifications.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: 'admin-dashboard.html',
  styles: ``
})
export class AdminDashboardComponent implements OnInit {
  userCount = signal(0);
  pendingTopics = signal(0);
  eventCount = signal(0);
  activityCount = signal(0);
  recentTopics = signal<any[]>([]);
  upcomingEvents = signal<any[]>([]);

  constructor(
    private topicsService: TopicsService,
    private usersService: UsersService,
    private eventsService: EventsService,
    private activitiesService: ActivitiesService,
    private participantsService: ParticipantsService,
    private notificationsService: NotificationsService,
    public languageService: LanguageService
  ) {}

  async ngOnInit() {
    await this.loadStats();
  }

  async loadStats() {
    try {
      const users = await this.usersService.getAllUsers();
      this.userCount.set(users.length);

      const topics = await this.topicsService.getAllTopicsWithUser();
      this.pendingTopics.set(topics.filter(t => t.status === 'pending').length);
      this.recentTopics.set(topics.slice(0, 5));

      const events = await this.eventsService.getAllEvents();
      this.eventCount.set(events.length);
      const now = new Date().toISOString();
      this.upcomingEvents.set(events.filter(e => e.date >= now).slice(0, 3));

      const activities = await this.activitiesService.getAllActivities();
      this.activityCount.set(activities.length);

      await this.participantsService.loadAll();
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  }

  statusLabel(status: string): string {
    if (status === 'pending') return this.languageService.isFrench() ? 'En attente' : 'Pending';
    if (status === 'approved') return this.languageService.isFrench() ? 'Approuvé' : 'Approved';
    return this.languageService.isFrench() ? 'Rejeté' : 'Rejected';
  }

  participants() {
    return this.participantsService.getParticipants()();
  }

  pendingParticipantsCount() {
    return this.participants().filter(p => p.status === 'pending').length;
  }

  async updateParticipantStatus(participant: any, status: 'approved' | 'rejected') {
    try {
      await this.participantsService.updateStatus(participant.id, status);
      await this.notificationsService.sendParticipationStatusEmail({ participant_id: participant.id, status });
    } catch (error) {
      console.error('Error updating participant status:', error);
      alert(this.languageService.isFrench() ? 'Erreur lors de la notification.' : 'Error sending notification.');
    }
  }
}
