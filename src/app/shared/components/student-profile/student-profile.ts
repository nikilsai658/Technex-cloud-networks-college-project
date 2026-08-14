import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { UserStore } from '../../../core/store/user';
import { Auth } from '../../../core/auth/auth';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-profile.html',
  styleUrl: './student-profile.css'
})
export class StudentProfile {
   user:any;
  private isBrowser: boolean;

  constructor(private userStore: UserStore, @Inject(PLATFORM_ID) platformId: Object, public auth:Auth) {
    this.user = this.userStore.user;
    this.isBrowser = isPlatformBrowser(platformId);

    this.selectedImage = this.isBrowser ? localStorage.getItem('profileImage') : null;
    this.resumeName = this.isBrowser ? localStorage.getItem('resumeName') : null;
    this.resumeUrl = this.isBrowser ? localStorage.getItem('resumeUrl') : null;
  }
  // ===========================
  // PROFILE IMAGE
  // ===========================

  selectedImage: string | null;

  // ===========================
  // RESUME
  // ===========================

  resumeName: string | null;

  resumeUrl: string | null;

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