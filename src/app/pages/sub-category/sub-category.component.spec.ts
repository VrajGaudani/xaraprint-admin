import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaatComponent } from './category.component';

describe('NaatComponent', () => {
  let component: NaatComponent;
  let fixture: ComponentFixture<NaatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NaatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
