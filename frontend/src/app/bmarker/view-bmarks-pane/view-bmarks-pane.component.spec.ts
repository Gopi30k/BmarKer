import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBmarksPaneComponent } from './view-bmarks-pane.component';

describe('ViewBmarksPaneComponent', () => {
  let component: ViewBmarksPaneComponent;
  let fixture: ComponentFixture<ViewBmarksPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBmarksPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBmarksPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
