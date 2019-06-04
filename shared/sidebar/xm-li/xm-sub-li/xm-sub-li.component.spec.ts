import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XmSubLiComponent } from './xm-sub-li.component';

describe('XmSubItemComponent', () => {
  let component: XmSubLiComponent;
  let fixture: ComponentFixture<XmSubLiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XmSubLiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XmSubLiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
