import { Routes } from '@angular/router';
import {adminGuard} from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'about', loadComponent: () => import('./features/about/about').then(m => m.AboutComponent) },
  { path: 'events', loadComponent: () => import('./features/events/events').then(m => m.EventsComponent) },
  {
    path: 'events/:id',
    loadComponent: () => import('./features/events/event-detail/event-detail').then(m => m.EventDetailComponent)
  },



  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/admin-users/admin-users').then(m => m.AdminUsersComponent) },
      { path: 'topics', loadComponent: () => import('./features/admin/admin-topics/admin-topics').then(m => m.AdminTopicsComponent) },
      { path: 'events', loadComponent: () => import('./features/admin/admin-events/admin-events').then(m => m.AdminEventsComponent) },
      { path: 'activities', loadComponent: () => import('./features/admin/admin-activities/admin-activities').then(m => m.AdminActivitiesComponent) }
    ]
  },
  {
    path: 'adminTest',
    loadComponent: () => import('./features/admin/admin-topics/admin-topics').then(m => m.AdminTopicsComponent)
  },
  { path: '**', redirectTo: '' }
];
