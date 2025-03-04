import { Component } from '@angular/core';
import {Bookmark} from '../models/bookmark.model';
import {BookmarkService} from '../services/bookmark.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-bookmark-updated',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './bookmark-updated.component.html',
  styleUrl: './bookmark-updated.component.css'
})
export class BookmarkUpdatedComponent {
  lastSubmitted: Bookmark | null = null;
  message: string = 'Bookmark updated';

  constructor(
    private bookmarkService: BookmarkService,
    private router: Router
  ) {
    // Retrieve the updated bookmark
    this.lastSubmitted = this.bookmarkService.getLastSubmitted();
  }

  /**
   * Navigate back to the overview page.
   */
  goBack(): void {
    this.router.navigate(['/bookmarks/all']);
  }
}
