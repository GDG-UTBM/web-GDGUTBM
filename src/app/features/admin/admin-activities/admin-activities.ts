import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { ActivitiesService,} from '../../../core/services/activities.service';
import { LanguageService } from '../../../core/services/language.service';
import {Activity} from '../../../core/models/Activity.model';

@Component({
  selector: 'app-admin-activities',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: 'admin-activities.html' ,
  styleUrls: ['admin-activities.scss']
})
export class AdminActivitiesComponent implements OnInit {
  activities = signal<Activity[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  editingId = signal<string | null>(null);
  activityForm: FormGroup;

  constructor(
    private activitiesService: ActivitiesService,
    private fb: FormBuilder,
    public languageService: LanguageService
  ) {
    this.activityForm = this.fb.group({
      title_fr: ['', Validators.required],
      title_en: ['', Validators.required],
      description_fr: ['', Validators.required],
      description_en: ['', Validators.required],
      icon: ['']
    });
  }

  async ngOnInit() {
    await this.loadActivities();
  }

  async loadActivities() {
    this.isLoading.set(true);
    try {
      const data = await this.activitiesService.getAllActivities();
      this.activities.set(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async drop(event: CdkDragDrop<Activity[]>) {
    const newActivities = [...this.activities()];
    moveItemInArray(newActivities, event.previousIndex, event.currentIndex);
    this.activities.set(newActivities);
    // Sauvegarder l'ordre
    try {
      await this.activitiesService.reorderActivities(newActivities);
    } catch (error) {
      console.error('Error reordering activities:', error);
      // Recharger en cas d'erreur
      await this.loadActivities();
    }
  }

  openAddModal() {
    this.editingId.set(null);
    this.activityForm.reset({ icon: '📌' });
    this.showModal.set(true);
  }

  editActivity(activity: Activity) {
    this.editingId.set(activity.id);
    this.activityForm.patchValue(activity);
    this.showModal.set(true);
  }

  async deleteActivity(id: string) {
    if (!confirm(this.languageService.isFrench() ? 'Supprimer cette activité ?' : 'Delete this activity?')) return;
    try {
      await this.activitiesService.deleteActivity(id);
      await this.loadActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  }

  async onSubmit() {
    if (this.activityForm.invalid) return;
    const formValue = this.activityForm.value;
    try {
      if (this.editingId()) {
        await this.activitiesService.updateActivity(this.editingId()!, formValue);
      } else {
        // Pour l'ordre, on peut mettre à la fin (max + 1)
        const maxOrder = Math.max(...this.activities().map(a => a.display_order), -1);
        await this.activitiesService.createActivity({ ...formValue, display_order: maxOrder + 1 });
      }
      this.closeModal();
      await this.loadActivities();
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  }

  closeModal() {
    this.showModal.set(false);
  }
}
