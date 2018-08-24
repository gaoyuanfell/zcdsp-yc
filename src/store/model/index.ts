import {MenuState} from './menu.state';
import {DirectionalState, LbsCityState} from './directional.state';

export interface AppState {
  menu: MenuState,
  directional: DirectionalState
  lbsCity: LbsCityState
}
