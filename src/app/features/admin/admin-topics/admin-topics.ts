import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicsService, Topic } from '../../../core/services/topics.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-admin-topics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-topics.html' ,
  styleUrl: './admin-topics.scss',
})
export class AdminTopicsComponent implements OnInit {
  topics = signal<Topic[]>([]);
  isLoading = signal(true);
  filterStatus = signal<'all' | 'pending' | 'approved' | 'rejected'>('all');

  constructor(
    private topicsService: TopicsService,
    public languageService: LanguageService
  ) {}

  ngOnInit() {
    this.loadTopics();
  }

  async loadTopics() {
    this.isLoading.set(true);
    try {
      const data = await this.topicsService.getAllTopicsWithUser();
      this.topics.set(data);
    } catch (error) {
      console.error('Error loading topics:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  filteredTopics() {
    const status = this.filterStatus();
    if (status === 'all') return this.topics();
    return this.topics().filter(t => t.status === status);
  }

  pendingCount() {
    return this.topics().filter(t => t.status === 'pending').length;
  }

  approvedCount() {
    return this.topics().filter(t => t.status === 'approved').length;
  }

  statusLabel(status: string): string {
    if (status === 'pending') return this.languageService.isFrench() ? 'En attente' : 'Pending';
    if (status === 'approved') return this.languageService.isFrench() ? 'Approuvé' : 'Approved';
    return this.languageService.isFrench() ? 'Rejeté' : 'Rejected';
  }

  async updateStatus(topicId: string, newStatus: 'approved' | 'rejected') {
    try {
      await this.topicsService.updateTopicStatus(topicId, newStatus);
      // Mise à jour optimiste
      this.topics.update(topics =>
        topics.map(t =>
          t.id === topicId ? { ...t, status: newStatus } : t
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Une erreur est survenue lors de la mise à jour.');
    }
  }
}
