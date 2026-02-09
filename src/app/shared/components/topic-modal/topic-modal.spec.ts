import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicModal } from './topic-modal';

describe('TopicModal', () => {
  let component: TopicModal;
  let fixture: ComponentFixture<TopicModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
