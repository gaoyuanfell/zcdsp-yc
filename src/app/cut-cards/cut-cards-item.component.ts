import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cut-cards-item',
  template: `
    <ng-content></ng-content>
  `,
  styles: [
    `
    
    `
  ]
})
export class CutCardsItemComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

}
