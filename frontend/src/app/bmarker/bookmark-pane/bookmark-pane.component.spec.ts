import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkPaneComponent } from './bookmark-pane.component';

describe('BookmarkPaneComponent', () => {
  let component: BookmarkPaneComponent;
  let fixture: ComponentFixture<BookmarkPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookmarkPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
