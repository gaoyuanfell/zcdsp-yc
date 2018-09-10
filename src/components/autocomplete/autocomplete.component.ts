import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'yc-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.less']
})
export class AutocompleteComponent implements OnInit {

  _value

  @ViewChild(TemplateRef) template: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
    console.info(this.template);
  }

}