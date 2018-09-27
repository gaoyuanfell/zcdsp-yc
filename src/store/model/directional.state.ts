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
  audiencesResult?: any
  audiencesViewResult?: Array<any>

  device?: Array<any>
  deviceResult?: any
  deviceViewResult?: Array<any>

  lbsCity?: Directional
  lbsScenes?: Array<any>
  lbsCityList?: Array<Array<any>>
  lbsCityResult?: Array<any>
  lbsCityMapResult?: Array<any>
  lbsCityViewResult?: Array<any>
  lbsCityMapView?: Array<any>

  audiencesAction?: Directional
  audiencesActionList?: Array<Array<any>>
  audiencesActionResult?: Array<any>

  audiencesAction2?: Directional
  audiencesAction2List?: Array<Array<any>>
  audiencesAction2Result?: Array<any>

  audiencesApp?: Directional
  audiencesAppList?: Array<Array<any>>
  audiencesAppResult?: Array<Array<any>>

  result?: any
  result2?: any
}

export interface LbsCityState {
  lbsCity?: Directional
  lbsScenes?: Array<any>
  lbsCityList?: Array<Array<any>>
  lbsCityResult?: Array<any>
  lbsCityViewResult?: Array<any>
}

export interface AudiencesActionState {
  audiencesAction?: Directional
  audiencesActionList?: Array<Array<any>>
  audiencesActionResult?: Array<any>

  audiencesAction2?: Directional
  audiencesAction2List?: Array<Array<any>>
  audiencesAction2Result?: Array<any>
}


// store 存储数据  数据初始化
