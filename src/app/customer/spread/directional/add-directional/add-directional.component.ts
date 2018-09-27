import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {OrientationService} from '../../../../../service/customer/orientation.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-add-directional',
  templateUrl: './add-directional.component.html',
  styleUrls: ['./add-directional.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class AddDirectionalComponent implements OnInit {

  directional: any = {};

  id;

  package_name;

  _valid;

  save() {
    this._valid = true;
    if (!this.package_name) return;
    this.directional.lbs_scene_type = this.directional.dtl_address.lbs_scene_type;
    let body = {...this.directional, ...{package_name: this.package_name}};

    if (+this.id) {
      body.package_id = this.id;
      this._orientationService.update(body).subscribe(res => {
        this.router.navigate(['/ads/spread/directional']);
      });
      return;
    }
    this._orientationService.add(body).subscribe(res => {
      this.router.navigate(['/ads/spread/directional']);
    });
  }


  constructor(private router: Router,
              private route: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private _orientationService: OrientationService) {
    let params = route.snapshot.params;
    let queryParams = route.snapshot.queryParams;
    let data = route.snapshot.data;
    this.id = params.id;

  }

  ngOnInit() {
    if (+this.id) {
      this._orientationService.detail({package_id: this.id}).subscribe(res => {
        this.directional = res.result;
        this.package_name = res.result.package_name;
        this.changeDetectorRef.markForCheck();
      });
    }
  }

}
