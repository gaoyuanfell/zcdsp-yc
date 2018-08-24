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
  areasChild1?: Array<any>
  areasResult?: Array<any>

  lbsCity?: Directional
  lbsCityChild1?: Array<any>
  lbsCityChild2?: Array<any>
  lbsCityChild3?: Array<any>
  lbsCityResult?: Array<any>
  lbsCityViewResult?: Array<any>

  audiences?: Audiences
  audiencesResult?: Array<any>
  audiencesAction? : Directional

  device?: {[key:string]: Directional}
}

export interface AudiencesActionState {

}

export interface LbsCityState {
  lbsCity?: Directional

  lbsCityList?:Array<Array<any>>

  lbsCityChild1?: Array<any>
  lbsCityChild2?: Array<any>
  lbsCityChild3?: Array<any>
  lbsCityResult?: Array<any>
  lbsCityViewResult?: Array<any>
}
