import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { OverviewComponent } from './overview.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Bookmark } from '../models/bookmark.model';
import { BookmarkService } from '../services/bookmark.service';

// Create a fake BookmarkService to isolate tests from actual storage.
class FakeBookmarkService {
  public bookmarks: Bookmark[] = [];
  public lastSubmitted: Bookmark | null = null;

  getBookmarks(): Bookmark[] {
    return this.bookmarks;
  }

  addBookmark(url: string): Bookmark {
    // Use current timestamp as an ID for simplicity.
    const bookmark: Bookmark = { id: new Date().getTime(), url };
    this.bookmarks.push(bookmark);
    return bookmark;
  }

  updateBookmark(id: number, url: string): void {
    const index = this.bookmarks.findIndex(b => b.id === id);
    if (index !== -1) {
      this.bookmarks[index].url = url;
    }
  }

  deleteBookmark(id: number): void {
    this.bookmarks = this.bookmarks.filter(b => b.id !== id);
  }

  setLastSubmitted(bookmark: Bookmark): void {
    this.lastSubmitted = bookmark;
  }

  getLastSubmitted(): Bookmark | null {
    return this.lastSubmitted;
  }
}

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  let bookmarkService: FakeBookmarkService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      // Import the standalone component and necessary modules.
      imports: [OverviewComponent, RouterTestingModule.withRoutes([])]
    }).compileComponents();
  }));

  beforeEach(() => {
    // Use our fake BookmarkService
    bookmarkService = new FakeBookmarkService();
    TestBed.overrideProvider(BookmarkService, { useValue: bookmarkService });
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with a required URL control', () => {
    const urlControl = component.bookmarkForm.controls['url'];
    expect(urlControl).toBeTruthy();
    // When empty, the required error should be set.
    urlControl.setValue('');
    expect(urlControl.hasError('required')).toBeTrue();
  });

  it('should load bookmarks and set up pagination correctly', () => {
    // Arrange: Add four bookmarks to the fake service.
    bookmarkService.bookmarks = [
      { id: 1, url: 'https://a.com' },
      { id: 2, url: 'https://b.com' },
      { id: 3, url: 'https://c.com' },
      { id: 4, url: 'https://d.com' }
    ];
    // Act: Reload bookmarks.
    component.loadBookmarks();
    expect(component.bookmarks.length).toBe(4);
    // With itemsPerPage = 3, total pages should be 2.
    expect(component.totalPages).toBe(2);
    // The first page should have 3 bookmarks.
    expect(component.paginatedBookmarks.length).toBe(3);
  });

  it('should paginate correctly on the last page', () => {
    // Arrange: With 4 bookmarks and itemsPerPage = 3, second page has one.
    bookmarkService.bookmarks = [
      { id: 1, url: 'https://a.com' },
      { id: 2, url: 'https://b.com' },
      { id: 3, url: 'https://c.com' },
      { id: 4, url: 'https://d.com' }
    ];
    component.loadBookmarks();
    // Act: Go to page 2.
    component.goToPage(2);
    expect(component.currentPage).toBe(2);
    expect(component.paginatedBookmarks.length).toBe(1);
  });

  it('should prevent duplicate bookmark submission', () => {
    // Arrange: Setup an existing bookmark.
    bookmarkService.bookmarks = [{ id: 1, url: 'https://dup.com' }];
    component.loadBookmarks();
    // Act: Try to submit a duplicate URL.
    component.bookmarkForm.controls['url'].setValue('https://dup.com');
    component.onSubmit();
    // Assert: The URL control should have the duplicateUrl error.
    expect(component.bookmarkForm.controls['url'].hasError('duplicateUrl')).toBeTrue();
  });

  it('should add a new bookmark and navigate to /bookmarks/created', fakeAsync(() => {
    // Arrange: Ensure no duplicate exists.
    bookmarkService.bookmarks = [];
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    // Act: Set a valid URL and submit.
    component.bookmarkForm.controls['url'].setValue('https://newbookmark.com');
    component.onSubmit();
    tick(); // Process any pending asynchronous tasks.
    // Assert: The bookmark should be added.
    expect(bookmarkService.bookmarks.length).toBe(1);
    expect(bookmarkService.bookmarks[0].url).toBe('https://newbookmark.com');
    // And navigation to the created route should have occurred.
    expect(navigateSpy).toHaveBeenCalledWith(['/bookmarks/created']);
  }));

  it('should update an existing bookmark and navigate to /bookmarks/updated when editing', fakeAsync(() => {
    // Arrange: Setup an existing bookmark and put component in edit mode.
    bookmarkService.bookmarks = [{ id: 1, url: 'https://old.com' }];
    component.loadBookmarks();
    component.editMode = true;
    component.editingBookmarkId = 1;
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    // Act: Change the URL and submit.
    component.bookmarkForm.controls['url'].setValue('https://updated.com');
    component.onSubmit();
    tick();
    // Assert: The bookmark's URL should be updated.
    expect(bookmarkService.bookmarks[0].url).toBe('https://updated.com');
    // And navigation to the updated route should occur.
    expect(navigateSpy).toHaveBeenCalledWith(['/bookmarks/updated']);
    // Also, edit mode should be reset.
    expect(component.editMode).toBeFalse();
    expect(component.editingBookmarkId).toBeNull();
  }));

  it('should patch the form when onEdit is called', () => {
    // Arrange: Create a bookmark.
    const bookmark: Bookmark = { id: 1, url: 'https://edit.com' };
    // Act: Call onEdit.
    component.onEdit(bookmark);
    // Assert: Component should enter edit mode and patch the form.
    expect(component.editMode).toBeTrue();
    expect(component.editingBookmarkId).toBe(1);
    expect(component.bookmarkForm.controls['url'].value).toBe('https://edit.com');
  });

  it('should delete a bookmark and reload the bookmarks list', () => {
    // Arrange: Add two bookmarks.
    bookmarkService.bookmarks = [
      { id: 1, url: 'https://a.com' },
      { id: 2, url: 'https://b.com' }
    ];
    component.loadBookmarks();
    // Act: Delete the first bookmark.
    component.onDelete(1);
    // Assert: Only one bookmark should remain.
    expect(bookmarkService.bookmarks.length).toBe(1);
    expect(bookmarkService.bookmarks[0].id).toBe(2);
  });
});
