import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';

type EventItem = {
  date: string;
  title: string;
  type: 'lesson' | 'marche' | 'media';
  link: string;
};

type CalendarDay = {
  day?: number;
  date?: string;
  events: EventItem[];
};

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './news.html',
  styleUrl: './news.scss',
})
export class News implements OnInit {
  beginnerLink = 'https://www.reservestock.jp/page/event_series/112197';

  currentDate = new Date(2026, 6, 1);
  calendarTitle = '';
  calendarDays: CalendarDay[] = [];

  events: EventItem[] = [
    { date: '2026-07-09', title: '初心者講座 10:30〜12:00', type: 'lesson', link: this.beginnerLink },
    { date: '2026-07-09', title: '初心者講座 16:30〜18:00', type: 'lesson', link: this.beginnerLink },
    { date: '2026-07-10', title: '初心者講座 10:30〜12:00', type: 'lesson', link: this.beginnerLink },
    { date: '2026-07-10', title: '初心者講座 17:30〜19:00', type: 'lesson', link: this.beginnerLink },
    { date: '2026-07-11', title: '初心者講座 10:30〜12:00', type: 'lesson', link: this.beginnerLink },

    { date: '2026-07-18', title: 'マルシェ販売＠大通り公園', type: 'marche', link: '#marche-info' },
    { date: '2026-07-29', title: 'マルシェ販売＠西16丁目', type: 'marche', link: '#marche-info' },

    { date: '2026-08-04', title: '初心者講座 10:30〜12:00', type: 'lesson', link: this.beginnerLink },
    { date: '2026-08-06', title: '初心者講座 10:30〜12:00', type: 'lesson', link: this.beginnerLink },
    { date: '2026-08-06', title: '初心者講座 16:30〜18:00', type: 'lesson', link: this.beginnerLink },
    { date: '2026-08-07', title: '初心者講座 10:30〜12:00', type: 'lesson', link: this.beginnerLink },
    { date: '2026-08-07', title: '初心者講座 17:30〜19:00', type: 'lesson', link: this.beginnerLink },
    { date: '2026-08-08', title: '初心者講座 10:30〜12:00', type: 'lesson', link: this.beginnerLink },

    { date: '2026-08-16', title: '雑誌〇〇掲載', type: 'media', link: '#' },
  ];

  ngOnInit(): void {
    this.renderCalendar();
  }

  prevMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.renderCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.renderCalendar();
  }

  renderCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.calendarTitle = `${year}年${month + 1}月`;
    this.calendarDays = [];

    const firstDay = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0).getDate();

    let startBlank = firstDay.getDay() - 1;
    if (startBlank < 0) startBlank = 6;

    for (let i = 0; i < startBlank; i++) {
      this.calendarDays.push({ events: [] });
    }

    for (let day = 1; day <= lastDate; day++) {
      const dateText = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      this.calendarDays.push({
        day,
        date: dateText,
        events: this.events.filter(event => event.date === dateText),
      });
    }
  }
}