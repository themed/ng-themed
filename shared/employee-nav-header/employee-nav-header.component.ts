import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupHistory } from '@services/core/shared-data.service';
import { MsoHierarchyService, TeamHierarchy } from '@services/mso-hierarchy.service';
import { SharedFunctionsService } from '@services/shared-functions.service';
import { UserProfile } from '@services/user.service';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'xm-employee-nav-header',
  templateUrl: './employee-nav-header.component.html',
  styleUrls: ['./employee-nav-header.component.scss']
})
export class EmployeeNavHeaderComponent implements OnInit, OnChanges {
  @Input() userObj: UserProfile;
  public reporting_structure: TeamHierarchy[] = [];
  public colleagueList: TeamHierarchy[];
  public displayName: string;
  startTime: number;
  public supList: SupHistory[];
  public loadingColleagues: boolean;
  public loadingSupervisor: boolean;
  public navigationSubscription;
  componentTitle: string = this.activatedRoute.snapshot.data.browserTabTitle;
  componentIcon: string;
  accountDirectSupervisor: TeamHierarchy;

  constructor(
    private sharedFunctions: SharedFunctionsService,
    private msoHierarchyService: MsoHierarchyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.hierarchyRouteIcon();
  }

  ngOnChanges() {
    this.getReportingStructure();
  }

  hierarchyRouteIcon() {
    switch (this.componentTitle) {
      case 'Supervisor View':
        this.componentIcon = 'icon-account-supervisor';
        break;
      case 'Hierarchy Stats':
        this.componentIcon = 'icon-account-hierarchy';
        break;
      case 'Tech View':
        this.componentIcon = 'icon-wrench';
        break;
      default:
        break;
    }
  }

  getProfileImageStyle(value) {
    return this.sharedFunctions.getProfileImageStyle(value);
  }

  getReportingStructure() {
    this.loadingSupervisor = true;
    this.loadingColleagues = true;
    this.msoHierarchyService.getEmployeeAndParents(this.userObj.employee.username)
      .pipe(
        map(sup => {
          let newList = [];
          sup.forEach(user => {
            if (user.user === this.userObj.employee.username) {
              this.displayName = user.displayName;
            } else {
              newList.push(user);
            }
          });
          return newList.slice(0, 1);
        }),
      )
      .subscribe(
        sup => {
          // if there is no reporting structure we should get get an empty array;
          this.reporting_structure = sup;
          this.accountDirectSupervisor = sup[0];
          if (this.reporting_structure.length === 0) {  // the top level will not have siblings
            this.loadingSupervisor = false;
            this.loadingColleagues = false;
          } else {
            this.getSameLevelEmployees(sup[0].hierarchyId);
          }
        },
        (err) => {
          // an error occurred
          this.reporting_structure = [];
        },
        () => this.loadingSupervisor = false
      );
  }

  public checkForImage(photo) {
    return this.sharedFunctions.checkForImage(photo);
  }

  getSameLevelEmployees(username: string) {
    this.msoHierarchyService.getEmployeeDirectReports(username).pipe(
      take(1)
    )
      .subscribe(
        e => {
          this.colleagueList = e;
        },
        err => console.error('There was an error in getSameLevelEmployees ', err),
        () => {
          this.loadingColleagues = false;
        }
      );
  }

  public changeTech(event?: any, userId?: string) {
    const target = !userId ? event.srcElement.value : userId;
    this.updateRoute(target);
  }

  updateRoute(target) {
    this.router.navigate(['../', target], {
      relativeTo: this.activatedRoute
    });
  }
  public buildDisplayName(userInfo?: any): string {
    let displayTitle = '';
    const title = userInfo.employee.title;
    if (title && (title !== null || title !== '')) {
      displayTitle = title;
    } else {
      displayTitle = '';
    }
    return displayTitle;
  }

}
