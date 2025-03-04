import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Since the component is standalone, import it directly.
      imports: [AppComponent, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it(`should have title 'bookmark manager'`, () => {
    expect(component.title).toEqual('bookmark manager');
  });

  it('should render a router outlet in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Check if there's a <router-outlet> tag in the DOM.
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
