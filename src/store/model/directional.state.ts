export interface Directional {
  children?: Array<Directional>
  checked?: boolean
  checkState?: 0 | 1 | 2
}

export interface Audiences {
  age?: Directional
  education?: Directional
  sex?: Directional
}

export interface DirectionalState {
  areas?: Directional
  areasChildList?: Array<any>
  areasChild1?: Array<any>
  areasResult?: Array<any>

  audiences?: Array<any>
  audiencesResult?: Array<any>
  // ageResult?: Array<any>
  // educationResult?: Array<any>
  // sexResult?: Array<any>

  device?: Array<any>
  deviceResult?: Array<any>
  // browsersResult?: Array<any>
  // devicesTypeResult?: Array<any>
  // mobileBrandResult?: Array<any>
  // netTypeResult?: Array<any>
  // operatorsResult?: Array<any>
  // osResult?: Array<any>
}

export interface AudiencesActionState {

}

export interface LbsCityState {
  lbsCity?: Directional
  lbsCityList?:Array<Array<any>>
  lbsCityResult?: Array<any>
  lbsCityViewResult?: Array<any>
}

export interface AudiencesActionState {
  audiencesAction?: Directional
  audiencesActionList?:Array<Array<any>>
  audiencesActionResult?: Array<any>

  audiencesAction2?: Directional
  audiencesAction2List?:Array<Array<any>>
  audiencesAction2Result?: Array<any>
}
