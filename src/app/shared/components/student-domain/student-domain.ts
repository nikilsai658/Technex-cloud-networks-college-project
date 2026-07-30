import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Student } from '../../../features/services/student/student';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-domain',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-domain.html',
  styleUrl: './student-domain.css',
})
export class StudentDomain implements OnInit {

  domain: any[] = [];
  loading = false;

  constructor(
    private api: Student,
    private cd: ChangeDetectorRef,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.loadstudentdomain();
  }

  loadstudentdomain(): void {

    this.loading = true;

    this.api.getstudentdomain().subscribe({

      next: (res: any) => {

        this.domain = res?.data ?? [];
        this.loading = false;
        this.cd.detectChanges();

      },

      error: () => {

        this.domain = [];
        this.loading = false;

      }

    });

  }
  view():void{
    this.router.navigate(['/main/student-courses']);
  }
}