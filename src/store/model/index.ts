import {MenuState} from './menu.state';
import {DirectionalState} from './directional.state';

export interface AppState {
  menu: MenuState,
  directional: DirectionalState
}
