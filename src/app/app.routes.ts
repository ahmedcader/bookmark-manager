import { Routes } from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {SubmissionComponent} from './submission/submission.component';
import {BookmarkUpdatedComponent} from './bookmark-updated/bookmark-updated.component';

export const routes: Routes = [
  { path: 'bookmarks/all', component: OverviewComponent },
  { path: 'bookmarks/created', component: SubmissionComponent },
  { path: 'bookmarks/updated', component: BookmarkUpdatedComponent },
  { path: '', redirectTo: 'bookmarks/all', pathMatch: 'full' },

];
