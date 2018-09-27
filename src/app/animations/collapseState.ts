import {animate, state, style, transition, trigger} from '@angular/animations';

export const collapseState = trigger('collapseState', [
  state('inactive', style({
    display: 'none',
    opacity: '0',
  })),
  state('active', style({
    display: '',
    opacity: '1',
  })),
  transition('inactive => active', animate('150ms ease-in')),
  transition('active => inactive', animate('150ms ease-out'))
]);
