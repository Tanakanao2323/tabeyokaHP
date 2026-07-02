import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  lastName = '';
  firstName = '';
  lastNameKana = '';
  firstNameKana = '';
  contactMethod: 'email' | 'phone' = 'email';
  contactValue = '';
  inquiryType: 'course-request' | 'corporate' | 'media' | 'other' = 'course-request';
  requestDetails = '';
  referrers = '';
  newsletter = true;

  sendMail(): void {
    const typeLabels = {
      'course-request': 'その他の講座開催のご依頼',
      corporate: '企業様からのご依頼',
      media: '取材・メディア出演のご依頼',
      other: 'その他のお問い合わせ'
    };
    const contactLabel = this.contactMethod === 'email' ? 'メールアドレス' : '電話番号';
    const body = [
      `お名前：${this.lastName} ${this.firstName}`,
      `フリガナ：${this.lastNameKana} ${this.firstNameKana}`,
      `${contactLabel}：${this.contactValue}`,
      `お問い合わせ種別：${typeLabels[this.inquiryType]}`,
      `具体的な内容：${this.requestDetails}`,
      `ご紹介者：${this.referrers}`,
      `メルマガ登録：${this.newsletter ? '希望する' : '希望しない'}`
    ].filter(Boolean).join('\n');

    window.location.href = `mailto:tanamizu1835@gmail.com?subject=${encodeURIComponent(`たべよかお問い合わせ：${typeLabels[this.inquiryType]}`)}&body=${encodeURIComponent(body)}`;
  }
}
