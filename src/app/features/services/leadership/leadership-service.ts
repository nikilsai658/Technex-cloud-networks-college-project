import { Injectable } from '@angular/core';
import { Api } from '../../../core/api/api';

@Injectable({
  providedIn: 'root',
})
export class LeadershipService {
  constructor(private api:Api) {}
   getleadership(){
    return this.api.GET('Leaderboard/domain');
  }
}
