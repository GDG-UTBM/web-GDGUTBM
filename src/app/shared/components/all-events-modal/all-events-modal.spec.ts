import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEventsModal } from './all-events-modal';

describe('AllEventsModal', () => {
  let component: AllEventsModal;
  let fixture: ComponentFixture<AllEventsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllEventsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllEventsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
