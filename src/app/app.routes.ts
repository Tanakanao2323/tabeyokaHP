import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Courses } from './pages/courses/courses';
import { Teacher } from './pages/teacher/teacher';
import { Voices } from './pages/voices/voices';
import { News } from './pages/news/news';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'courses', component: Courses },
  { path: 'teacher', component: Teacher },
  { path: 'voices', component: Voices },
  { path: 'news', component: News },
  { path: 'contact', component: Contact },
];