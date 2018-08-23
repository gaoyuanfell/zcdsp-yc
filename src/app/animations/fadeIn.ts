import {animate, style, transition, trigger} from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
    transition('void => *', [
        style({opacity: 0}),
        animate(280, style({opacity: 1}))
    ]),
    transition('* => void', [
        style({opacity: 0})
    ])
]);
