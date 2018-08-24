export interface Configure {
  value?: string
  link?: string
  style?: { [key: string]: any }

  speed?: number // 速度

  hints?: string // 提示语
  submitOne?: boolean // 只能提交一次
  forwardUrl?: string // 数据转发地址
  jumpLink?: string // 跳转链接
}
