import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { BookmarkService } from '../services/bookmark.service';
import { Bookmark } from '../models/bookmark.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { isValidURL } from '../validators/url.validators';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  bookmarkForm!: FormGroup;
  bookmarks: Bookmark[] = [];
  paginatedBookmarks: Bookmark[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;
  pagesArray: number[] = [];
  editMode: boolean = false;
  editingBookmarkId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private bookmarkService: BookmarkService,
    private router: Router,
  ) { }

  /**
   * Lifecycle hook that initializes the form and loads bookmarks.
   */
  ngOnInit(): void {
    // Initialize form with synchronous and asynchronous URL validators.
    this.bookmarkForm = this.fb.group({
      url: ['', [isValidURL, Validators.required]]
    });
    this.loadBookmarks();
  }

  /**
   * Loads bookmarks from the service and initializes pagination.
   */
  loadBookmarks(): void {
    this.bookmarks = this.bookmarkService.getBookmarks();
    this.totalPages = Math.ceil(this.bookmarks.length / this.itemsPerPage) || 1;
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginate();
  }

  /**
   * Slices the bookmarks list for the current page.
   */
  paginate(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBookmarks = this.bookmarks.slice(startIndex, endIndex);
  }

  /**
   * Navigates to a specific page.
   * @param page - The page number to display.
   */
  goToPage(page: number): void {
    this.currentPage = page;
    this.paginate();
  }

  /**
   * Moves to the previous page if available.
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  /**
   * Moves to the next page if available.
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  /**
   * Handles form submission for adding or editing a bookmark.
   */
  onSubmit(): void {
    if (this.bookmarkForm.valid) {
      const url = this.bookmarkForm.value.url;

      // Retrieve the current bookmarks.
      const bookmarks = this.bookmarkService.getBookmarks();
      // Check for duplicates.
      // If editing, ignore the bookmark with editingBookmarkId.
      const duplicate = bookmarks.some(
        bookmark => bookmark.url === url && bookmark.id !== this.editingBookmarkId
      );

      if (duplicate) {
        // Set a duplicate error on the URL control.
        this.bookmarkForm.controls['url'].setErrors({ duplicateUrl: true });
        return; // Stop processing submission.
      }

      if (this.editMode && this.editingBookmarkId !== null) {
        // Update an existing bookmark.
        this.bookmarkService.updateBookmark(this.editingBookmarkId, url);
        // Set the updated bookmark as the last submitted entry.
        const updatedBookmark = { id: this.editingBookmarkId, url: url };
        this.bookmarkService.setLastSubmitted(updatedBookmark);
        this.editMode = false;
        this.editingBookmarkId = null;
        // Refresh the bookmarks list and reset the form.
        this.loadBookmarks();
        this.bookmarkForm.reset();
        // Redirect to the updated page with a custom message.
        this.router.navigate(['/bookmarks/updated']).then(success => {
          console.log('Navigation to /links/updated:', success);
        });
      } else {
        // Add a new bookmark and save it as the last submission.
        const newBookmark = this.bookmarkService.addBookmark(url);
        this.bookmarkService.setLastSubmitted(newBookmark);
        // Refresh the bookmarks list and reset the form.
        this.loadBookmarks();
        this.bookmarkForm.reset();
        // Redirect to the results page.
        this.router.navigate(['/bookmarks/created']).then(success => {
          console.log('Navigation to /results:', success);
        });
      }
    }
  }

  /**
   * Populates the form for editing an existing bookmark.
   * @param bookmark - The bookmark to edit.
   */
  onEdit(bookmark: Bookmark): void {
    this.editMode = true;
    this.editingBookmarkId = bookmark.id;
    this.bookmarkForm.patchValue({ url: bookmark.url });
  }

  /**
   * Deletes a bookmark and refreshes the list.
   * @param id - The ID of the bookmark to delete.
   */
  onDelete(id: number): void {
    this.bookmarkService.deleteBookmark(id);
    this.loadBookmarks();
  }
}
