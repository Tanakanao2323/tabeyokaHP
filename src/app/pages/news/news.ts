import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { CalendarEvent, CalendarService } from '../../services/calendar.service';

type CalendarDay = {
  day?: number;
  date?: string;
  events: CalendarEvent[];
};

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './news.html',
  styleUrl: './news.scss',
})
export class News implements OnInit, OnDestroy {
  beginnerLink = 'https://www.reservestock.jp/page/event_series/112197#futureEventScheduleSec';

  currentDate = new Date(2026, 6, 1);
  calendarTitle = '';
  calendarDays: CalendarDay[] = [];
  selectedDay?: CalendarDay;

  events: CalendarEvent[] = [
    { date: '2026-07-09', startTime: '10:30', endTime: '12:00', title: 'ヒミツのワザあり★干し野菜講座', type: 'lesson', link: this.beginnerLink },
    { date: '2026-07-09', startTime: '16:30', endTime: '18:00', title: 'ヒミツのワザあり★干し野菜講座', type: 'lesson', link: this.beginnerLink },
    { date: '2026-07-10', startTime: '10:30', endTime: '12:00', title: 'ヒミツのワザあり★干し野菜講座', type: 'lesson', link: this.beginnerLink },
    { date: '2026-07-10', startTime: '17:30', endTime: '19:00', title: 'ヒミツのワザあり★干し野菜講座', type: 'lesson', link: this.beginnerLink },
    { date: '2026-07-11', startTime: '10:30', endTime: '12:00', title: 'ヒミツのワザあり★干し野菜講座', type: 'lesson', link: this.beginnerLink },

    { date: '2026-07-18', title: 'マルシェ＠北海道神宮頓宮', type: 'marche', link: '#marche-info' },
    { date: '2026-07-19', title: 'マルシェ＠北海道神宮頓宮', type: 'marche', link: '#marche-info' },
    { date: '2026-07-25', title: 'マルシェ＠北海道神宮頓宮', type: 'marche', link: '#marche-info' },
    { date: '2026-07-26', title: 'マルシェ＠北海道神宮頓宮', type: 'marche', link: '#marche-info' },

    { date: '2026-08-04', startTime: '10:30', endTime: '12:00', title: 'ヒミツのワザあり★干し野菜講座', type: 'lesson', link: this.beginnerLink },
    { date: '2026-08-06', startTime: '10:30', endTime: '12:00', title: 'ヒミツのワザあり★干し野菜講座', type: 'lesson', link: this.beginnerLink },
    { date: '2026-08-06', startTime: '16:30', endTime: '18:00', title: 'ヒミツのワザあり★干し野菜講座', type: 'lesson', link: this.beginnerLink },
    { date: '2026-08-07', startTime: '10:30', endTime: '12:00', title: 'ヒミツのワザあり★干し野菜講座', type: 'lesson', link: this.beginnerLink },
    { date: '2026-08-07', startTime: '17:30', endTime: '19:00', title: 'ヒミツのワザあり★干し野菜講座', type: 'lesson', link: this.beginnerLink },
    { date: '2026-08-08', startTime: '10:30', endTime: '12:00', title: 'ヒミツのワザあり★干し野菜講座', type: 'lesson', link: this.beginnerLink },

    { date: '2026-09-10', startTime: '10:30', endTime: '12:00', title: 'ヒミツのワザあり★干し野菜講座', type: 'lesson', link: this.beginnerLink },
    { date: '2026-09-10', startTime: '16:30', endTime: '18:00', title: 'ヒミツのワザあり★干し野菜講座', type: 'lesson', link: this.beginnerLink },
    { date: '2026-09-11', startTime: '10:30', endTime: '12:00', title: 'ヒミツのワザあり★干し野菜講座', type: 'lesson', link: this.beginnerLink },
    { date: '2026-09-11', startTime: '17:30', endTime: '19:00', title: 'ヒミツのワザあり★干し野菜講座', type: 'lesson', link: this.beginnerLink },
    { date: '2026-09-12', startTime: '10:30', endTime: '12:00', title: 'ヒミツのワザあり★干し野菜講座', type: 'lesson', link: this.beginnerLink },

    { date: '2026-08-16', title: '雑誌〇〇掲載', type: 'media', link: '#' },
    { date: '2026-09-29', title: 'マルシェ＠地下歩行空間 北三条広場', type: 'marche', link: '#marche-info' },
  ];

  private unsubscribeEvents?: () => void;

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.renderCalendar();
    if (this.calendarService.configured) {
      this.unsubscribeEvents = this.calendarService.watchEvents(events => {
        if (events.length) {
          this.events = events;
          this.renderCalendar();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeEvents?.();
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

  selectDay(day: CalendarDay): void {
    if (!day.events.length) return;
    this.selectedDay = this.selectedDay?.date === day.date ? undefined : day;
  }

  eventLabel(event: CalendarEvent): string {
    if (!event.startTime) return event.title;
    const time = event.endTime ? `${event.startTime}〜${event.endTime}` : event.startTime;
    return `${event.title} ${time}`;
  }

  renderCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.calendarTitle = `${year}年${month + 1}月`;
    this.calendarDays = [];
    this.selectedDay = undefined;

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
