import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEvidenceDynamicFormComponent } from './dynamic-form.component';

describe('PostEvidenceDynamicFormComponent', () => {
  let component: PostEvidenceDynamicFormComponent;
  let fixture: ComponentFixture<PostEvidenceDynamicFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PostEvidenceDynamicFormComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PostEvidenceDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
