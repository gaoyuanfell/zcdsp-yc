import {Component, Input, OnInit, Attribute} from '@angular/core';

@Component({
  selector: 'app-form-tips',
  templateUrl: './form-tips.component.html',
  styleUrls: ['./form-tips.component.less']
})
export class FormTipsComponent implements OnInit {

  @Input() target;
  @Input() tips;
  @Input() formTarget;


  constructor(@Attribute('placeholder') public placeholder: string) {

  }

  ngOnInit() {

  }
}
