import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PreviewImgComponent} from './preview-img.component';

describe('PreviewImgComponent', () => {
  let component: PreviewImgComponent;
  let fixture: ComponentFixture<PreviewImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewImgComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
