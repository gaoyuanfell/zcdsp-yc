import {NgModule} from '@angular/core';
import {Module} from '../module';
import {CutCardsItemComponent} from './cut-cards-item.component';
import {CutCardsComponent} from './cut-cards.component';

@NgModule({
  imports: [

  ],
  declarations: [
    CutCardsItemComponent,
    CutCardsComponent,
  ],
  exports:[
    CutCardsItemComponent,
    CutCardsComponent,
  ],
  providers: [],
})
export class CutCardsModule {
}
