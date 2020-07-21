import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddURLComponent } from './add-url.component';

describe('AddURLComponent', () => {
  let component: AddURLComponent;
  let fixture: ComponentFixture<AddURLComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddURLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddURLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
