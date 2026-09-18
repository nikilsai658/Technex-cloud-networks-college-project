import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Superadmin } from '../../../features/services/superadmin/superadmin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-superadmin-domain-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './superadmin-domain-students.html',
  styleUrl: './superadmin-domain-students.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuperadminDomainStudents implements OnInit {

  students: any[] = [];

  loading = false;

  collegeId!: number;
  domainId!: number;
  domainName = '';

  constructor(
    private api: Superadmin,
    private cd: ChangeDetectorRef,
    private router:Router
  ) {}

  ngOnInit(): void {

    this.collegeId = history.state.collegeId;
    this.domainId = history.state.domainId;

    if (this.collegeId && this.domainId) {
      this.loadDomainStudents();
    }
  }

  loadDomainStudents(): void {

    this.loading = true;

    this.api
      .getsuperadmincollege_domain_students(
        this.collegeId,
        this.domainId
      )
      .subscribe({

        next: (res: any) => {

          console.log('Students Response:', res);

          this.students = res?.data ?? [];

          this.loading = false;

          this.cd.markForCheck();
        },

        error: (error) => {

          console.error(
            'Error loading domain students:',
            error
          );

          this.students = [];

          this.loading = false;

          this.cd.markForCheck();
        }

      });
  }

  get totalCompleted(): number {
    return this.students.reduce(
      (sum, s) => sum + (Number(s.completedAssignments) || 0),
      0
    );
  }

  get totalPending(): number {
    return this.students.reduce(
      (sum, s) => sum + (Number(s.pendingAssignments) || 0),
      0
    );
  }

  get averageScore(): number {
    if (!this.students.length) {
      return 0;
    }

    const total = this.students.reduce(
      (sum, s) => sum + (Number(s.totalScore) || 0),
      0
    );

    return Math.round((total / this.students.length) * 10) / 10;
  }

  viewAssignments(student: any): void {
    this.router.navigate(
      ['/main/superadmin-student-assignments'],
      {
        state: {
          studentId: student.studentId,
          collegeId: this.collegeId,
          domainId: this.domainId,
        }
      }
    );
  }

  printContent(): void {

    if (!this.students || this.students.length === 0) {
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1100,height=750');

    if (!printWindow) {
      alert('Please allow popups for this website.');
      return;
    }

    const generatedOn = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const rows = this.students
      .map((s, i) => `
        <tr>
          <td class="idx">${i + 1}</td>
          <td>
            <div class="student-name">${this.escapeHtml(s.studentName || '-')}</div>
            <div class="student-email">${this.escapeHtml(s.studentEmail || '')}</div>
          </td>
          <td>${this.escapeHtml(s.registerNumber || 'Not Available')}</td>
          <td class="center">Year ${this.escapeHtml(s.year ?? '-')}</td>
          <td class="center">${Number(s.totalAssignments) || 0}</td>
          <td class="center pos">${Number(s.completedAssignments) || 0}</td>
          <td class="center neg">${Number(s.pendingAssignments) || 0}</td>
          <td class="center">${Number(s.totalAttempts) || 0}</td>
          <td class="center score">${Number(s.totalScore) || 0}</td>
        </tr>
      `)
      .join('');

    const domainTitle = this.escapeHtml(this.domainName || 'Domain Students');

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${domainTitle} - Student Report</title>

          <style>
            @page {
              size: A4 landscape;
              margin: 14mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              font-family: 'Segoe UI', Arial, sans-serif;
              color: #1f2933;
              font-size: 12px;
            }

            .report-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              border-bottom: 2px solid #2F3E46;
              padding-bottom: 12px;
              margin-bottom: 16px;
            }

            .report-title {
              margin: 0 0 4px;
              font-size: 20px;
              font-weight: 700;
              color: #2F3E46;
            }

            .report-subtitle {
              margin: 0;
              font-size: 12px;
              color: #6b7280;
            }

            .report-meta {
              text-align: right;
              font-size: 11px;
              color: #6b7280;
              line-height: 1.6;
            }

            .report-meta strong {
              color: #1f2933;
            }

            .summary-strip {
              display: flex;
              gap: 12px;
              margin-bottom: 18px;
            }

            .summary-card {
              flex: 1;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 10px 14px;
            }

            .summary-card .label {
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.04em;
              color: #6b7280;
            }

            .summary-card .value {
              font-size: 18px;
              font-weight: 700;
              color: #1f2933;
              margin-top: 2px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            thead {
              background: #2F3E46;
              color: #ffffff;
            }

            th {
              text-align: left;
              padding: 10px 12px;
              font-size: 10.5px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.03em;
              white-space: nowrap;
            }

            th.center,
            td.center {
              text-align: center;
            }

            td {
              padding: 9px 12px;
              border-bottom: 1px solid #e5e7eb;
              vertical-align: top;
            }

            tbody tr:nth-child(even) {
              background: #f8fafc;
            }

            tbody tr {
              page-break-inside: avoid;
            }

            .idx {
              color: #9ca3af;
              width: 28px;
            }

            .student-name {
              font-weight: 600;
              color: #1f2933;
            }

            .student-email {
              font-size: 10.5px;
              color: #6b7280;
              margin-top: 1px;
            }

            .pos {
              color: #059669;
              font-weight: 600;
            }

            .neg {
              color: #d97706;
              font-weight: 600;
            }

            .score {
              color: #0e7490;
              font-weight: 700;
            }

            .report-footer {
              margin-top: 16px;
              display: flex;
              justify-content: space-between;
              font-size: 10.5px;
              color: #9ca3af;
              border-top: 1px solid #e5e7eb;
              padding-top: 8px;
            }
          </style>
        </head>

        <body>

          <div class="report-header">
            <div>
              <p class="report-title">${domainTitle}</p>
              <p class="report-subtitle">Domain student progress report</p>
            </div>

            <div class="report-meta">
              <div><strong>College ID:</strong> ${this.escapeHtml(this.collegeId)}</div>
              <div><strong>Domain ID:</strong> ${this.escapeHtml(this.domainId)}</div>
              <div><strong>Generated:</strong> ${generatedOn}</div>
            </div>
          </div>

          <div class="summary-strip">
            <div class="summary-card">
              <div class="label">Total Students</div>
              <div class="value">${this.students.length}</div>
            </div>
            <div class="summary-card">
              <div class="label">Completed</div>
              <div class="value">${this.totalCompleted}</div>
            </div>
            <div class="summary-card">
              <div class="label">Pending</div>
              <div class="value">${this.totalPending}</div>
            </div>
            <div class="summary-card">
              <div class="label">Average Score</div>
              <div class="value">${this.averageScore}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Register Number</th>
                <th class="center">Year</th>
                <th class="center">Assignments</th>
                <th class="center">Completed</th>
                <th class="center">Pending</th>
                <th class="center">Attempts</th>
                <th class="center">Score</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>

          <div class="report-footer">
            <span>Technex Cloud Networks Pvt Ltd</span>
            <span>Generated on ${generatedOn}</span>
          </div>

        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  }

  private escapeHtml(value: unknown): string {
    const div = document.createElement('div');
    div.textContent = value === null || value === undefined ? '' : String(value);
    return div.innerHTML;
  }
}
