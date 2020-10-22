import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayliEuroComponent } from './dayli-euro.component';

describe('DayliEuroComponent', () => {
  let component: DayliEuroComponent;
  let fixture: ComponentFixture<DayliEuroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayliEuroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayliEuroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
