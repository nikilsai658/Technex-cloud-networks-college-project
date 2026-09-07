import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CertificateService } from '../../../features/services/certificate/certificate-service';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate.html',
  styleUrl: './certificate.css'
})
export class Certificate implements OnInit, OnDestroy {

  certificates: any[] = [];
  loading = false;
  error = '';

  private pollHandle: any = null;
  private readonly POLL_INTERVAL_MS = 15000;

  constructor(
    private CertificateService: CertificateService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCertificates();
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  startPolling(): void {

    this.stopPolling();

    this.pollHandle = setInterval(() => {
      this.refreshCertificates();
    }, this.POLL_INTERVAL_MS);

  }

  stopPolling(): void {

    if (this.pollHandle) {
      clearInterval(this.pollHandle);
      this.pollHandle = null;
    }

  }

  loadCertificates(): void {

    this.loading = true;

    this.CertificateService.certificate().subscribe({
      next: (res: any) => {

        console.log('Certificate response:', res);

        this.certificates = res?.data ?? [];

        this.loading = false;

        this.cd.detectChanges();
      },

      error: (err: any) => {

        console.error('Certificate API error:', err);

        this.certificates = [];
        this.loading = false;

        // A 404 here just means no certificates have been earned
        // yet — that's the normal "No Certificates Yet" empty state,
        // not a failure.
        if (err?.status !== 404) {
          this.error = 'Unable to load certificates.';
        }

        this.cd.detectChanges();
      }
    });

  }

  // Silent background refresh — no loading spinner, so a new
  // certificate just appears once it's available instead of the
  // student having to reload the page.
  refreshCertificates(): void {

    this.CertificateService.certificate().subscribe({
      next: (res: any) => {

        this.certificates = res?.data ?? [];
        this.error = '';

        this.cd.detectChanges();
      },

      error: (err: any) => {

        // Stay quiet on the background refresh — still nothing
        // to show, keep whatever state is already on screen.
        if (err?.status === 404) {
          this.certificates = [];
          this.error = '';
          this.cd.detectChanges();
        }

      }
    });

  }

  viewCertificate(certificate: any): void {

    this.router.navigate(['/main/view-certificate'], {
      queryParams: { code: certificate.certificateCode }
    });

  }

}