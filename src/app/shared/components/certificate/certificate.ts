import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CertificateService } from '../../../features/services/certificate/certificate-service';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate.html',
  styleUrl: './certificate.css'
})
export class Certificate implements OnInit {

  certificates: any[] = [];
  loading = false;
  error = '';

  constructor(
    private CertificateService: CertificateService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCertificates();
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
        this.error = 'Unable to load certificates.';

        this.cd.detectChanges();
      }
    });

  }

  viewCertificate(certificate: any): void {

    this.router.navigate(['/main/view-certificate'], {
      queryParams: { code: certificate.certificateCode }
    });

  }

}