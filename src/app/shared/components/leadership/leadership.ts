import { ChangeDetectorRef, Component, OnInit,ChangeDetectionStrategy, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadershipService } from '../../../features/services/leadership/leadership-service';
import { Ellipsis } from '../../directives/ellipsis';

@Component({
  selector: 'app-leadership',
  standalone: true,
  imports: [Ellipsis, CommonModule],
  templateUrl: './leadership.html',
  styleUrl: './leadership.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Leadership implements OnInit {

  leaderboard: any[] = [];
  myRank = 0;
  myScore = 0;
  searchText = '';

  get filteredLeaderboard(): any[] {
    const term = this.searchText.trim().toLowerCase();
    if (!term) return this.leaderboard;
    return this.leaderboard.filter(s =>
      [s.studentName, s.email, s.rollNumber]
        .some(v => v != null && String(v).toLowerCase().includes(term))
    );
  }

  onSearch(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
    this.cdr.markForCheck();
  }

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