import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewDirectComponent } from './direct.component';

describe('OverviewDirectComponent', () => {
  let component: OverviewDirectComponent;
  let fixture: ComponentFixture<OverviewDirectComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OverviewDirectComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewDirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
