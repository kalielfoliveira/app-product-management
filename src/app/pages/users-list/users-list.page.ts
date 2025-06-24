import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService, User } from 'src/app/services/user.service';
import { ToastController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class UsersListPage implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  editingUser: User | null = null;
  loading = false;
  error: string | null = null;
  selectedFile: File | null = null;
  environment = environment;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toastController: ToastController
  ) {
    this.userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['user', [Validators.required]],
  });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar usuários';
        this.loading = false;
        this.showToastError('Erro ao carregar usuários!', err.error?.message || 'Erro ao carregar usuários');
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.selectedFile) {
      // Envie como FormData (com foto)
      const formData = new FormData();
      Object.entries(this.userForm.value).forEach(([key, value]) => {
        formData.append(key, value !== null && value !== undefined ? String(value) : '');
      });
      formData.append('photo', this.selectedFile);

      if (this.editingUser) {
        this.userService.updateUser(this.editingUser.id, formData).subscribe({
          next: () => {
            this.loadUsers();
            this.editingUser = null;
            this.userForm.reset();
          },
          error: (error) => {
            this.error = 'Erro ao atualizar usuário';
            this.showToastError('Erro ao atualizar usuário!', error.error?.message || 'Erro ao atualizar usuário');
          }
        });
      } else {
        this.userService.addUser(formData).subscribe({
          next: () => {
            this.loadUsers();
            this.userForm.reset();
          },
          error: (error) => {
            this.error = 'Erro ao adicionar usuário';
            this.showToastError('Erro ao adicionar usuário!', error.error?.message || 'Erro ao adicionar usuário');
          }
        });
      }
    } else {
      // Envie como objeto normal (sem foto)
      if (this.editingUser) {
        this.userService.updateUser(this.editingUser.id, this.userForm.value).subscribe({
          next: () => {
            this.loadUsers();
            this.editingUser = null;
            this.userForm.reset();
          },
          error: (error) => {
            this.error = 'Erro ao atualizar usuário';
            this.showToastError('Erro ao atualizar usuário!', error.error?.message || 'Erro ao atualizar usuário');
          }
        });
      } else {
        this.userService.addUser(this.userForm.value).subscribe({
          next: () => {
            this.loadUsers();
            this.userForm.reset();
          },
          error: (error) => {
            this.error = 'Erro ao adicionar usuário';
            this.showToastError('Erro ao adicionar usuário!', error.error?.message || 'Erro ao adicionar usuário');
          }
        });
      }
    }
  }

  editUser(user: User): void {
    this.editingUser = user;
    this.userForm.patchValue(user);
  }

  cancel(): void {
    this.editingUser = null;
    this.userForm.reset();
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (error) => {
        this.error = 'Erro ao deletar usuário';
        this.showToastError('Erro ao deletar usuário!', error.error?.message || 'Erro ao deletar usuário');
      }
    });
  }

  async showToastError(header: string, message: string) {
    const toast = await this.toastController.create({
      message,
      header,
      color: 'danger',
      position: 'top',
      duration: 4000,
      buttons: [{ text: 'X', role: 'cancel' }]
    });
    toast.present();
  }
}