import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BmarkerComponent } from './bmarker.component';

describe('BmarkerComponent', () => {
  let component: BmarkerComponent;
  let fixture: ComponentFixture<BmarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BmarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BmarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
