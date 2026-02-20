import { Injectable, signal } from '@angular/core';

export type ParticipationStatus = 'pending' | 'approved' | 'rejected';

export interface EventParticipant {
  id: string;
  eventId: string;
  eventTitle: string;
  fullName: string;
  role: 'student' | 'professional';
  school?: string;
  studyLevel?: string;
  profession?: string;
  status: ParticipationStatus;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {
  private participants = signal<EventParticipant[]>([
    {
      id: 'p-1',
      eventId: '1',
      eventTitle: 'AI & Robotique',
      fullName: 'Nadia Benali',
      role: 'student',
      school: 'UTBM',
      studyLevel: 'Master',
      status: 'approved',
      createdAt: new Date('2025-12-01T10:00:00Z').toISOString()
    },
    {
      id: 'p-2',
      eventId: '1',
      eventTitle: 'AI & Robotique',
      fullName: 'Thomas Martin',
      role: 'professional',
      profession: 'Ingénieur IA',
      status: 'pending',
      createdAt: new Date('2025-12-02T12:30:00Z').toISOString()
    },
    {
      id: 'p-3',
      eventId: '2',
      eventTitle: 'Web & Cloud',
      fullName: 'Ines Moreau',
      role: 'professional',
      profession: 'Développeuse Frontend',
      status: 'approved',
      createdAt: new Date('2025-05-28T09:00:00Z').toISOString()
    }
  ]);

  getParticipants() {
    return this.participants.asReadonly();
  }

  addParticipant(data: Omit<EventParticipant, 'id' | 'status' | 'createdAt'>) {
    const id = `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newParticipant: EventParticipant = {
      ...data,
      id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.participants.update(list => [newParticipant, ...list]);
    return newParticipant;
  }

  updateStatus(id: string, status: ParticipationStatus) {
    this.participants.update(list =>
      list.map(p => (p.id === id ? { ...p, status } : p))
    );
  }
}
