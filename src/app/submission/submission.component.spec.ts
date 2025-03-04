import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmissionComponent } from './submission.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BookmarkService } from '../services/bookmark.service';
import { Bookmark } from '../models/bookmark.model';

describe('SubmissionComponent', () => {
  let component: SubmissionComponent;
  let fixture: ComponentFixture<SubmissionComponent>;
  let router: Router;

  // Fake BookmarkService that returns a dummy bookmark.
  const fakeBookmarkService = {
    getLastSubmitted: (): Bookmark => ({ id: 1, url: 'https://created-bookmark.com' })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), SubmissionComponent],
      providers: [
        { provide: BookmarkService, useValue: fakeBookmarkService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmissionComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges(); // ngOnInit is called here.
  });

  it('should create the SubmissionComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have the default message "Bookmark created"', () => {
    expect(component.message).toEqual('Bookmark created');
  });

  it('should set lastSubmitted on initialization', () => {
    expect(component.lastSubmitted).toEqual({ id: 1, url: 'https://created-bookmark.com' });
  });

  it('should navigate back to overview when goBack is called', async () => {
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/bookmarks/all']);
  });
});
