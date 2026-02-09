import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteProfileModal } from './complete-profile-modal';

describe('CompleteProfileModal', () => {
  let component: CompleteProfileModal;
  let fixture: ComponentFixture<CompleteProfileModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteProfileModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteProfileModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
