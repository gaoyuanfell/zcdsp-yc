import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {OrientationService} from '../../../../../service/customer/orientation.service';

@Component({
  selector: 'app-add-directional',
  templateUrl: './add-directional.component.html',
  styleUrls: ['./add-directional.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class AddDirectionalComponent implements OnInit {

  directional

  package_name

  _valid

  save(){
    console.info(this.directional);
    this._valid = true;
    if(!this.package_name) return;
    this._orientationService.add({...this.directional, ...{package_name: this.package_name}}).subscribe(res => {
      console.info(res);
    })
  }

  constructor(private _orientationService: OrientationService) { }

  ngOnInit() {
  }

}
