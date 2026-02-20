import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../../core/services/users.service';
import { LanguageService } from '../../../core/services/language.service';
import { UserProfile } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-users.html' ,
  styles: ``
})
export class AdminUsersComponent implements OnInit {
  users = signal<UserProfile[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  editingUserId = signal<string | null>(null);
  userForm: FormGroup;

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    public languageService: LanguageService
  ) {
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['student', Validators.required],
      password: ['']
    });
  }

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    this.isLoading.set(true);
    try {
      const data = await this.usersService.getAllUsers();
      this.users.set(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async changeRole(userId: string, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newRole = select.value as 'student' | 'professional' | 'admin';
    try {
      await this.usersService.updateUserRole(userId, newRole);
      await this.loadUsers();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  }

  openAddModal() {
    this.editingUserId.set(null);
    this.userForm.reset({ role: 'student' });
    this.showModal.set(true);
  }

  editUser(user: UserProfile) {
    this.editingUserId.set(user.id);
    this.userForm.patchValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    });
    this.showModal.set(true);
  }

  async deleteUser(userId: string) {
    if (!confirm(this.languageService.isFrench() ? 'Supprimer cet utilisateur ?' : 'Delete this user?')) return;
    try {
      await this.usersService.deleteUser(userId);
      await this.loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  async onSubmit() {
    if (this.userForm.invalid) return;
    const formValue = this.userForm.value;
    try {
      if (this.editingUserId()) {
        await this.usersService.updateUser(this.editingUserId()!, formValue);
      } else {
        await this.usersService.createUserByAdmin(this.userForm.value);
        // TODO: create user via auth admin API (supabase.auth.admin.createUser)
        // Pour l'instant, on ne peut pas créer d'utilisateur via service classique. On peut soit utiliser la fonction RPC, soit ne pas permettre l'ajout.
        alert('Création utilisateur non implémentée');
      }
      this.closeModal();
      await this.loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  closeModal() {
    this.showModal.set(false);
  }
}
