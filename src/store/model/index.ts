import {MenuState} from './menu.state';
import {AudiencesActionState, DirectionalState, LbsCityState} from './directional.state';

export interface AppState {
  menu: MenuState,
  directional: DirectionalState
  lbsCity: LbsCityState
  audiencesAction: AudiencesActionState
}
