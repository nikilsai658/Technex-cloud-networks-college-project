import { ChangeDetectorRef, Component, OnInit,ChangeDetectionStrategy, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadershipService } from '../../../features/services/leadership/leadership-service';

@Component({
  selector: 'app-leadership',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leadership.html',
  styleUrl: './leadership.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Leadership implements OnInit {

  leaderboard: any[] = [];
  myRank = 0;
  myScore = 0;

  constructor(private leadershipService: LeadershipService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getLeaderboard();
  }

  getLeaderboard() {

  this.leadershipService.getleadership().subscribe({
    next: (res: any) => {
      console.log(this.leaderboard);
console.log(this.myRank);
console.log(this.myScore);
      this.leaderboard = res.data?.leaderboard || [];
      this.myRank = res.data?.myRank || 0;
      this.myScore = res.data?.myScore || 0;
      this.cdr.markForCheck();
    },
    error: (err) => {
      console.error('API Error:', err);
      this.leaderboard = [];
    }
  });
}
}