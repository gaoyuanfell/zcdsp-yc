import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ScrollMoreDirective} from './scroll-more.component';

describe('ScrollMoreComponent', () => {
  let component: ScrollMoreDirective;
  let fixture: ComponentFixture<ScrollMoreDirective>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScrollMoreDirective]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollMoreDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
