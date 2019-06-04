import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeNavHeaderComponent } from './employee-nav-header.component';

describe('EmployeeNavHeaderComponent', () => {
  let component: EmployeeNavHeaderComponent;
  let fixture: ComponentFixture<EmployeeNavHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeNavHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeNavHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
