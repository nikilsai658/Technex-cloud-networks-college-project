import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

import { CertificateService } from '../../../features/services/certificate/certificate-service';

@Component({
  selector: 'app-viewcertificate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viewcertificate.html',
  styleUrl: './viewcertificate.css',
})
export class Viewcertificate implements OnInit {

  certificate: any = null;

  loading = true;
  error = '';

  certificatePreviewUrl: SafeResourceUrl | null = null;

  constructor(
    private certificateService: CertificateService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const code =
      this.route.snapshot.queryParamMap.get('code');

    if (!code) {

      this.loading = false;
      this.error = 'No certificate code provided.';

      return;
    }

    this.loadCertificate(code);
  }

  loadCertificate(code: string): void {

    this.loading = true;
    this.error = '';

    this.certificateService
      .completioncertificate(code as any)
      .subscribe({

        next: (res: any) => {

          console.log(
            'Certificate API response:',
            res
          );

          this.certificate =
            res?.data ?? null;

          if (!this.certificate) {

            this.loading = false;
            this.error =
              'Certificate not found.';

            this.cd.detectChanges();

            return;
          }

          console.log(
            'Google Drive URL:',
            this.certificate.driveLink
          );

          /*
           * Convert:
           *
           * https://drive.google.com/file/d/FILE_ID/view
           *
           * Into:
           *
           * https://drive.google.com/file/d/FILE_ID/preview
           */

          const previewUrl =
            this.getDrivePreviewUrl(
              this.certificate.driveLink
            );

          console.log(
            'Google Drive Preview URL:',
            previewUrl
          );

          /*
           * Tell Angular that this URL
           * is safe to use inside iframe.
           */

          this.certificatePreviewUrl =
            this.sanitizer
              .bypassSecurityTrustResourceUrl(
                previewUrl
              );

          this.loading = false;

          this.cd.detectChanges();
        },

        error: (err: any) => {

          console.error(
            'Certificate API error:',
            err
          );

          this.certificate = null;
          this.certificatePreviewUrl = null;

          this.loading = false;

          this.error =
            'Unable to load certificate.';

          this.cd.detectChanges();
        }
      });
  }

  getDrivePreviewUrl(url: string): string {

    if (!url) {
      return '';
    }

    /*
     * Google Drive file URL:
     *
     * /file/d/FILE_ID/view
     */

    const match =
      url.match(/\/file\/d\/([^/]+)/);

    if (match && match[1]) {

      const fileId = match[1];

      return `https://drive.google.com/file/d/${fileId}/preview`;
    }

    /*
     * If URL is already a Drive preview URL
     */

    if (url.includes('/preview')) {
      return url;
    }

    return url;
  }

  goBack(): void {

    this.router.navigate([
      '/main/certificate'
    ]);
  }

  printCertificate(): void {

    window.print();
  }
}