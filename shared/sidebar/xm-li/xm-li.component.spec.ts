import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmLiComponent } from './xm-li.component';

describe('XmLiComponent', () => {
  let component: XmLiComponent;
  let fixture: ComponentFixture<XmLiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmLiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmLiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
