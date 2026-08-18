import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { Router } from '@angular/router';
import { Superadmin } from '../../../features/services/superadmin/superadmin';

@Component({
  selector: 'app-superadmin-domains',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './superadmin-domains.html',
  styleUrl: './superadmin-domains.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuperadminDomains implements OnInit {

  domains: any[] = [];

  loading = false;

  // This is COLLEGE ID
  collegeId!: number;

  constructor(
    private api: Superadmin,
    private router: Router,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
      // Get collegeId from router state
    this.collegeId = history.state.collegeId;
    this.loadCollegeDomains();
  }

  loadCollegeDomains(): void {

    if (!this.collegeId) {
      console.error('College ID is missing');
      return;
    }

    this.loading = true;

    this.api.getsuperadmincollege_domain(this.collegeId).subscribe({

      next: (res: any) => {

        console.log('College Domains Response:', res);

        if (res?.isFailure) {
          this.domains = [];
          this.loading = false;
          this.cd.markForCheck();
          return;
        }

        this.domains = res?.data ?? [];

        console.log('Domains:', this.domains);

        this.loading = false;

        // Required because OnPush
        this.cd.markForCheck();
      },

      error: (error) => {

        console.error('Failed to load college domains:', error);

        this.domains = [];
        this.loading = false;

        this.cd.markForCheck();
      }
    });
  }

  viewDomain(domain: any): void {

    console.log('Selected Domain:', domain);

    this.router.navigate(
      ['/main/superadmin-domain-students'],
      {
        state: {
          domainId: domain.domainId,
          collegeId:this.collegeId
        }
      }
    );
  }
}