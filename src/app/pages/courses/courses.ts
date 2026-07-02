import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Voices } from '../voices/voices';

@Component({
  selector: 'app-courses',
  imports: [RouterLink, Voices],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses {}
