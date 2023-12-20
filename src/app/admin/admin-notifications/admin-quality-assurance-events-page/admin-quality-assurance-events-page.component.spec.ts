import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminQualityAssuranceEventsPageComponent } from './admin-quality-assurance-events-page.component';
import { QualityAssuranceEventsComponent } from '../../../notifications/qa/events/quality-assurance-events.component';

describe('AdminQualityAssuranceEventsPageComponent', () => {
  let component: AdminQualityAssuranceEventsPageComponent;
  let fixture: ComponentFixture<AdminQualityAssuranceEventsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [AdminQualityAssuranceEventsPageComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
    .overrideComponent(AdminQualityAssuranceEventsPageComponent, {
        remove: {
          imports: [QualityAssuranceEventsComponent]
        }
      })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQualityAssuranceEventsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AdminQualityAssuranceEventsPageComponent', () => {
    expect(component).toBeTruthy();
  });
});
