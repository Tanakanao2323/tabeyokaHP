import { Injectable } from '@angular/core';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, User, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Firestore, addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { firebaseConfig, firebaseConfigured } from '../firebase.config';

export type CalendarEvent = {
  id?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  title: string;
  type: 'lesson' | 'marche' | 'media';
  link: string;
};

@Injectable({ providedIn: 'root' })
export class CalendarService {
  readonly configured = firebaseConfigured;
  private app?: FirebaseApp;
  private firestore?: Firestore;
  private auth?: Auth;

  constructor() {
    if (!this.configured) return;
    this.app = getApps()[0] ?? initializeApp(firebaseConfig);
    this.firestore = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }

  watchEvents(update: (events: CalendarEvent[]) => void, onError?: () => void): () => void {
    if (!this.firestore) return () => undefined;
    const eventsQuery = query(collection(this.firestore, 'calendarEvents'), orderBy('date'));
    return onSnapshot(
      eventsQuery,
      snapshot => update(snapshot.docs.map(item => ({ id: item.id, ...item.data() } as CalendarEvent))),
      () => onError?.()
    );
  }

  watchUser(update: (user: User | null) => void): () => void {
    if (!this.auth) return () => undefined;
    return onAuthStateChanged(this.auth, update);
  }

  async login(email: string, password: string): Promise<void> {
    if (!this.auth) throw new Error('Firebaseが未設定です');
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    if (this.auth) await signOut(this.auth);
  }

  async addEvent(event: CalendarEvent): Promise<void> {
    if (!this.firestore) throw new Error('Firebaseが未設定です');
    await addDoc(collection(this.firestore, 'calendarEvents'), event);
  }

  async deleteEvent(id: string): Promise<void> {
    if (!this.firestore) throw new Error('Firebaseが未設定です');
    await deleteDoc(doc(this.firestore, 'calendarEvents', id));
  }

  async updateEvent(id: string, event: CalendarEvent): Promise<void> {
    if (!this.firestore) throw new Error('Firebaseが未設定です');
    const { id: _unused, ...data } = event;
    await updateDoc(doc(this.firestore, 'calendarEvents', id), data);
  }
}
