import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookmarkUpdatedComponent } from './bookmark-updated.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BookmarkService } from '../services/bookmark.service';
import { Bookmark } from '../models/bookmark.model';

describe('BookmarkUpdatedComponent', () => {
  let component: BookmarkUpdatedComponent;
  let fixture: ComponentFixture<BookmarkUpdatedComponent>;
  let router: Router;

  // Create a fake BookmarkService with a dummy lastSubmitted bookmark.
  const fakeBookmarkService = {
    getLastSubmitted: (): Bookmark => ({ id: 1, url: 'https://updated-bookmark.com' })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: BookmarkService, useValue: fakeBookmarkService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkUpdatedComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the BookmarkUpdatedComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct default message', () => {
    expect(component.message).toEqual('Bookmark updated');
  });

  it('should retrieve the last submitted bookmark from the service', () => {
    expect(component.lastSubmitted).toEqual({ id: 1, url: 'https://updated-bookmark.com' });
  });

  it('should navigate back to /bookmarks/all when goBack is called', async () => {
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/bookmarks/all']);
  });
});
