import { TestBed } from '@angular/core/testing';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from '../models/bookmark.model';

describe('BookmarkService', () => {
  let service: BookmarkService;
  // In-memory store for our fake localStorage
  let store: { [key: string]: string } = {};

  beforeEach(() => {
    // Reset our fake storage
    store = {};

    // Spy on localStorage methods to use our fake store.
    spyOn(localStorage, 'getItem').and.callFake((key: string): string | null => {
      return store[key] || null;
    });
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): void => {
      store[key] = value;
    });
    spyOn(localStorage, 'clear').and.callFake((): void => {
      store = {};
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(BookmarkService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return an empty array when no bookmarks are stored', () => {
    expect(service.getBookmarks()).toEqual([]);
  });

  it('should add a new bookmark and update localStorage', () => {
    const url = 'https://example.com';
    const bookmark = service.addBookmark(url);

    expect(bookmark.url).toBe(url);
    expect(bookmark.id).toBeDefined();

    // Verify that the bookmark is stored in localStorage.
    const bookmarks = service.getBookmarks();
    expect(bookmarks.length).toBe(1);
    expect(bookmarks[0]).toEqual(bookmark);

    // Verify that the last submitted bookmark is also set.
    const lastSubmitted = service.getLastSubmitted();
    expect(lastSubmitted).toEqual(bookmark);
  });

  it('should update an existing bookmark', () => {
    // Add a bookmark first.
    const initialUrl = 'https://example.com';
    const bookmark = service.addBookmark(initialUrl);

    // Update the bookmark.
    const updatedUrl = 'https://updated.com';
    service.updateBookmark(bookmark.id, updatedUrl);

    // Retrieve bookmarks and verify the URL is updated.
    const bookmarks = service.getBookmarks();
    expect(bookmarks[0].url).toBe(updatedUrl);
  });

  it('should delete a bookmark', () => {
    // Add two bookmarks.
    const bookmark1 = service.addBookmark('https://example.com');
    const bookmark2 = service.addBookmark('https://another.com');

    // Delete the first bookmark.
    service.deleteBookmark(bookmark1.id);

    // Verify that only the second bookmark remains.
    const bookmarks = service.getBookmarks();
    expect(bookmarks.length).toBe(1);
    expect(bookmarks[0].id).toBe(bookmark2.id);
  });

  it('should set and retrieve the last submitted bookmark', () => {
    const bookmark: Bookmark = { id: 123, url: 'https://last.com' };

    service.setLastSubmitted(bookmark);
    const lastSubmitted = service.getLastSubmitted();
    expect(lastSubmitted).toEqual(bookmark);
  });
});
