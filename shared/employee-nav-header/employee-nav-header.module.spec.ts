import { EmployeeNavHeaderModule } from './employee-nav-header.module';

describe('EmployeeNavHeaderModule', () => {
  let employeeNavHeaderModule: EmployeeNavHeaderModule;

  beforeEach(() => {
    employeeNavHeaderModule = new EmployeeNavHeaderModule();
  });

  it('should create an instance', () => {
    expect(employeeNavHeaderModule).toBeTruthy();
  });
});
