import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActivities } from './admin-activities';

describe('AdminActivities', () => {
  let component: AdminActivities;
  let fixture: ComponentFixture<AdminActivities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminActivities]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminActivities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
