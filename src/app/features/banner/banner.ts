import { Component, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-banner',
  imports: [],
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner implements OnInit ,OnDestroy{


  
  images = signal<string[]>([
    'banner.jpeg',
    '1.jpeg',
    '2.jpeg',
    '3.jpeg',
    // '4.jpeg',
    '5.jpeg',
    '6.jpeg',
    'Ganga-Aarti-Varanasi.webp'
  ]);

  currentIndex = signal(0);
  intervalId: any;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.next();
    }, 4000); // 4 seconds
  }

  next() {
    this.currentIndex.update(i =>
      (i + 1) % this.images().length
    );
  }

  prev() {
    this.currentIndex.update(i =>
      (i - 1 + this.images().length) % this.images().length
    );
  }

  goTo(index: number) {
    this.currentIndex.set(index);
  }
}
