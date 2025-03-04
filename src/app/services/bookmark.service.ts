import { Injectable } from '@angular/core';
import { Bookmark } from '../models/bookmark.model';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  // Keys for localStorage.
  private storageKey = 'bookmarks';
  private lastSubmittedKey = 'lastSubmitted';

  constructor() { }

  /**
   * Retrieves all bookmarks from localStorage.
   * @return Array of bookmarks.
   */
  getBookmarks(): Bookmark[] {
    const bookmarks = localStorage.getItem(this.storageKey);
    return bookmarks ? JSON.parse(bookmarks) : [];
  }

  /**
   * Adds a new bookmark.
   * @param url - The URL of the new bookmark.
   * @return The created bookmark object.
   */
  addBookmark(url: string): Bookmark {
    const bookmarks = this.getBookmarks();
    const newBookmark: Bookmark = { id: new Date().getTime(), url };
    bookmarks.push(newBookmark);
    localStorage.setItem(this.storageKey, JSON.stringify(bookmarks));
    localStorage.setItem(this.lastSubmittedKey, JSON.stringify(newBookmark));
    return newBookmark;
  }

  /**
   * Updates an existing bookmark.
   * @param id - The bookmark's unique identifier.
   * @param url - The updated URL.
   */
  updateBookmark(id: number, url: string): void {
    const bookmarks = this.getBookmarks();
    const index = bookmarks.findIndex(b => b.id === id);
    if (index !== -1) {
      bookmarks[index].url = url;
      localStorage.setItem(this.storageKey, JSON.stringify(bookmarks));
    }
  }

  /**
   * Deletes a bookmark.
   * @param id - The unique identifier of the bookmark to delete.
   */
  deleteBookmark(id: number): void {
    let bookmarks = this.getBookmarks();
    bookmarks = bookmarks.filter(b => b.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(bookmarks));
  }

  /**
   * Stores the last submitted bookmark for display on the results page.
   * @param bookmark - The bookmark object.
   */
  setLastSubmitted(bookmark: Bookmark): void {
    localStorage.setItem(this.lastSubmittedKey, JSON.stringify(bookmark));
  }

  /**
   * Retrieves the last submitted bookmark.
   * @return The bookmark object or null if not found.
   */
  getLastSubmitted(): Bookmark | null {
    const bookmark = localStorage.getItem(this.lastSubmittedKey);
    return bookmark ? JSON.parse(bookmark) : null;
  }
}
