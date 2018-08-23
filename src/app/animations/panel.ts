import {animate, state, style, transition, trigger} from '@angular/animations';

export const panel = trigger('panel', [
  state('false', style({height: '0px', visibility: 'hidden'})),
  state('true', style({height: '*', visibility: 'visible'})),
  transition('true <=> false', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
  state('', style({
    height: '0px', visibility: 'hidden'
  })),
])
