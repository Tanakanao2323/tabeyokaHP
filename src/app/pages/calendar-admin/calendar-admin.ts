import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from 'firebase/auth';
import { CalendarEvent, CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-calendar-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar-admin.html',
  styleUrl: './calendar-admin.scss'
})
export class CalendarAdmin implements OnInit, OnDestroy {
  email = '';
  password = '';
  user: User | null = null;
  events: CalendarEvent[] = [];
  form: CalendarEvent = { date: '', startTime: '', endTime: '', title: '', type: 'lesson', link: '' };
  message = '';
  busy = false;
  editingId = '';
  private unsubscribeUser?: () => void;
  private unsubscribeEvents?: () => void;
  private logoutTimer?: ReturnType<typeof setTimeout>;

  constructor(readonly calendar: CalendarService) {}

  ngOnInit(): void {
    this.unsubscribeUser = this.calendar.watchUser(user => {
      this.user = user;
      if (user) this.startLogoutTimer();
      else this.clearLogoutTimer();
    });
    this.unsubscribeEvents = this.calendar.watchEvents(
      events => this.events = events,
      () => this.message = 'Firestoreのルールがまだ反映されていません。設定手順をご確認ください。'
    );
  }

  ngOnDestroy(): void {
    this.unsubscribeUser?.();
    this.unsubscribeEvents?.();
    this.clearLogoutTimer();
  }

  async login(): Promise<void> {
    this.busy = true;
    this.message = '';
    try { await this.calendar.login(this.email, this.password); }
    catch { this.message = 'ログインできませんでした。メールアドレスとパスワードをご確認ください。'; }
    finally { this.busy = false; }
  }

  async saveEvent(): Promise<void> {
    this.busy = true;
    this.message = '';
    const releaseOverlay = window.setTimeout(() => this.busy = false, 450);
    try {
      if (this.editingId) await this.calendar.updateEvent(this.editingId, { ...this.form });
      else await this.calendar.addEvent({ ...this.form });
      this.form = { date: '', startTime: '', endTime: '', title: '', type: 'lesson', link: '' };
      this.message = this.editingId ? '予定を更新しました。' : '予定を追加しました。';
      this.editingId = '';
    } catch { this.message = this.editingId ? '予定を更新できませんでした。' : '予定を追加できませんでした。'; }
    finally {
      window.clearTimeout(releaseOverlay);
      this.busy = false;
    }
  }

  async remove(event: CalendarEvent): Promise<void> {
    if (!event.id) return;
    this.busy = true;
    this.message = '';
    const releaseOverlay = window.setTimeout(() => this.busy = false, 450);
    try {
      await this.calendar.deleteEvent(event.id);
      this.message = '予定を削除しました。';
    } catch {
      this.message = '予定を削除できませんでした。';
    } finally {
      window.clearTimeout(releaseOverlay);
      this.busy = false;
    }
  }

  edit(event: CalendarEvent): void {
    if (!event.id) return;
    this.editingId = event.id;
    this.form = {
      date: event.date,
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      title: event.title,
      type: event.type,
      link: event.link || ''
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingId = '';
    this.form = { date: '', startTime: '', endTime: '', title: '', type: 'lesson', link: '' };
  }

  private startLogoutTimer(): void {
    this.clearLogoutTimer();
    const key = 'calendarAdminLoginAt';
    const stored = Number(sessionStorage.getItem(key));
    const startedAt = stored || Date.now();
    if (!stored) sessionStorage.setItem(key, String(startedAt));
    const remaining = Math.max(0, 30 * 60 * 1000 - (Date.now() - startedAt));
    this.logoutTimer = setTimeout(async () => {
      await this.calendar.logout();
      sessionStorage.removeItem(key);
      this.message = '安全のため、30分経過したので自動ログアウトしました。';
    }, remaining);
  }

  private clearLogoutTimer(): void {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);
    this.logoutTimer = undefined;
    if (!this.user) sessionStorage.removeItem('calendarAdminLoginAt');
  }
}
