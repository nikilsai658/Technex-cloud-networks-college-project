import { Injectable } from '@angular/core';
import { Api } from '../../../core/api/api';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {

  constructor(private api: Api) {}

  certificate() {
    return this.api.GET('Certificate/my');
  }

  completioncertificate(certificateCode: number) {
    return this.api.GET(`Certificate/${certificateCode}`);
  }
}