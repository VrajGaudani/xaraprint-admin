import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNaatComponent } from './add-category.component';

describe('AddNaatComponent', () => {
  let component: AddNaatComponent;
  let fixture: ComponentFixture<AddNaatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNaatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNaatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
