import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDetailModal } from './activity-detail-modal';

describe('ActivityDetailModal', () => {
  let component: ActivityDetailModal;
  let fixture: ComponentFixture<ActivityDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityDetailModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityDetailModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
