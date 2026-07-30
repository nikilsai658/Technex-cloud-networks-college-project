import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserStore } from '../../../core/store/user';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.css'
})
export class StudentProfile {
   user:any;
  constructor(private userStore: UserStore) {
    this.user = this.userStore.user;
  }
  // ===========================
  // PROFILE IMAGE
  // ===========================

  selectedImage: string | null =
    localStorage.getItem('profileImage');

  // ===========================
  // RESUME
  // ===========================

  resumeName: string | null =
    localStorage.getItem('resumeName');

  resumeUrl: string | null =
    localStorage.getItem('resumeUrl');

  // ===========================
  // IMAGE UPLOAD
  // ===========================

  onImageSelected(event: Event): void {

    const file =
      (event.target as HTMLInputElement).files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

      this.selectedImage = reader.result as string;

      localStorage.setItem(
        'profileImage',
        this.selectedImage
      );

    };

    reader.readAsDataURL(file);

  }

  // ===========================
  // REMOVE IMAGE
  // ===========================

  removeImage(): void {

    this.selectedImage = null;

    localStorage.removeItem('profileImage');

  }

  // ===========================
  // RESUME UPLOAD
  // ===========================

  onResumeSelected(event: Event): void {

    const file =
      (event.target as HTMLInputElement).files?.[0];

    if (!file) return;

    this.resumeName = file.name;

    localStorage.setItem(
      'resumeName',
      file.name
    );

    const reader = new FileReader();

    reader.onload = () => {

      this.resumeUrl = reader.result as string;

      localStorage.setItem(
        'resumeUrl',
        this.resumeUrl!
      );

    };

    reader.readAsDataURL(file);

  }

  // ===========================
  // REMOVE RESUME
  // ===========================

  removeResume(): void {

    this.resumeName = null;

    this.resumeUrl = null;

    localStorage.removeItem('resumeName');

    localStorage.removeItem('resumeUrl');

  }

  // ===========================
  // DOWNLOAD RESUME
  // ===========================

  downloadResume(): void {

    if (!this.resumeUrl) return;

    const link = document.createElement('a');

    link.href = this.resumeUrl;

    link.download = this.resumeName ?? 'Resume';

    link.click();

  }

}