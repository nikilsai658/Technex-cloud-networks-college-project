import { Component, ElementRef, HostListener, OnDestroy, OnInit, afterNextRender, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import {ButtonModule } from "primeng/button";

interface HeroSlide {
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  imports: [ButtonModule,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  readonly slides: HeroSlide[] = [
    {
      title: 'Launch Your Tech Journey with Technex',
      description: 'Learn from industry experts, build real-world projects and prepare for a successful career in technology.',
    },
    {
      title: 'One Portal for Your Entire Learning Journey',
      description: 'Students, trainers and colleges come together on a single platform, from enrolling in a course to earning your certificate.',
    },
    {
      title: 'Structured Courses, Anytime Access',
      description: 'Video lessons, notes and resources organised module by module, so you can learn at your own pace on any device.',
    },
    {
      title: 'Assignments & Projects Made Simple',
      description: 'Submit your work online, meet deadlines with ease and receive timely feedback from your trainers.',
    },
    {
      title: 'Instant Results',
      description: 'Take timed quizzes and tests, get your scores instantly and know exactly where you need to improve.',
    },
    {
      title: 'Track Your Progress',
      description: 'See completed modules, scores and pending tasks at a glance from your personal dashboard.',
    },
    {
      title: 'Earn Verified Certificates',
      description: 'Complete your courses and download certificates that showcase your skills to recruiters.',
    },
  ];

  // Nav links scroll to sections on this same page (ids in home.html)
  readonly navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'process', label: 'Process' },
    { id: 'contact', label: 'Contact' },
  ];

  // Footer contact details
  readonly contact = {
    email: 'info@technexcloud.com',
    phone: '+91 98765 43210',
  };

  // tel: links must not contain spaces
  readonly phoneHref = 'tel:' + this.contact.phone.replace(/\s/g, '');

  readonly activeSection = signal('home');
  readonly currentYear = new Date().getFullYear();

  readonly currentSlide = signal(0);
  private timerId?: ReturnType<typeof setInterval>;

  readonly stats = [
    { target: 2000, label: 'Student Learners' },
    { target: 5, label: 'Institutional Partners' },
    { target: 1000, label: 'Recorded Classes' },
  ];

  // Displayed values; they count up from 0 once the stats section scrolls into view
  readonly statCounts = signal(this.stats.map(() => 0));

  private readonly statsSection = viewChild<ElementRef<HTMLElement>>('statsSection');
  private statsObserver?: IntersectionObserver;
  private statsFrameId?: number;

  constructor() {
    // Browser only — IntersectionObserver does not exist during server rendering
    afterNextRender(() => {
      const section = this.statsSection()?.nativeElement;
      if (!section) {
        return;
      }

      this.statsObserver = new IntersectionObserver(
        entries => {
          if (entries.some(entry => entry.isIntersecting)) {
            this.statsObserver?.disconnect();
            this.animateStats();
          }
        },
        { threshold: 0.3 },
      );
      this.statsObserver.observe(section);
    });
  }

  private animateStats(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.statCounts.set(this.stats.map(stat => stat.target));
      return;
    }

    const duration = 2000;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out: fast at first, slowing as it reaches the final value
      const eased = 1 - Math.pow(1 - progress, 3);

      this.statCounts.set(this.stats.map(stat => Math.round(stat.target * eased)));

      if (progress < 1) {
        this.statsFrameId = requestAnimationFrame(step);
      }
    };

    this.statsFrameId = requestAnimationFrame(step);
  }

  scrollToSection(id: string, event: Event): void {
    event.preventDefault();

    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Highlights the nav link of the section currently in view
  @HostListener('window:scroll')
  onScroll(): void {
    let current = 'home';

    for (const link of this.navLinks) {
      const el = document.getElementById(link.id);
      if (el && el.getBoundingClientRect().top <= 120) {
        current = link.id;
      }
    }

    // The footer is short, so it may never reach the top — treat page end as Contact
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

    this.activeSection.set(atBottom ? 'contact' : current);
  }

  ngOnInit(): void {
    this.timerId = setInterval(() => {
      this.currentSlide.update(i => (i + 1) % this.slides.length);
    }, 2000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
    this.statsObserver?.disconnect();
    if (this.statsFrameId !== undefined) {
      cancelAnimationFrame(this.statsFrameId);
    }
  }
}
