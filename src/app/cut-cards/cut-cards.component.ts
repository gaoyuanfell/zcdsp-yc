import {AfterContentInit, Component, ContentChildren, OnInit, QueryList} from '@angular/core';
import {CutCardsItemComponent} from './cut-cards-item.component';

@Component({
  selector: 'cut-cards',
  templateUrl: './cut-cards.component.html',
  styleUrls: ['./cut-cards.component.less']
})
export class CutCardsComponent implements OnInit, AfterContentInit {

  @ContentChildren(CutCardsItemComponent) itemList: QueryList<CutCardsItemComponent> ;

  constructor() {
  }

  ngOnInit() {

  }

  ngAfterContentInit(): void {
    console.info(this.itemList);
    this.itemList.forEach((item, index)=>{
      item.top = 20
      item.left = index * 20
      item.zIndex = index
      item.oldZIndex = index
      item.patent = this;
    })
  }

  selected(item){
    let data = this.itemList.find(d => d === item);
    data.active = !data.active;
  }

  cancelSelected(data?){
    this.itemList.forEach((item, index)=>{
      if(data === item) return;
      item.active = false;
    })
  }

}
