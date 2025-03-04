import { Component } from '@angular/core';
import {BookmarkService} from '../services/bookmark.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {Bookmark} from '../models/bookmark.model';

@Component({
  selector: 'app-submission',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './submission.component.html',
  styleUrl: './submission.component.css'
})
export class SubmissionComponent {
  lastSubmitted: Bookmark | null = null;
  message: string = 'Bookmark created';
  constructor(
    private bookmarkService: BookmarkService,
    private router: Router
  ) { }

  /**
   * Retrieves the last submitted bookmark on component initialization.
   */
  ngOnInit(): void {
    this.lastSubmitted = this.bookmarkService.getLastSubmitted();
  }

  /**
   * Navigates back to the overview page.
   */
  goBack(): void {
    this.router.navigate(['/bookmarks/all']);
  }
}
