# ZcdspYc

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

// 默认占满
grid: {
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    containLabel: false
},

// 去掉轴和刻度
axisLine: {
    show: false
},
axisTick: {
    show:false
},
axisLabel: {
    show:false
},
splitLine: {
    show: false
}


// 轴虚线
yAxis: {
    splitLine:{
        lineStyle:{
            color:['#f7f8fa'],
            width: 2,
            type: 'dashed'
        }
    }
}

// 折线圆滑 填充颜色
series: [{
    smooth: true,
    areaStyle: {
      color: '#ccc'
    }
}]


// 雷达图

option = { 
    radar: [
        {
            indicator: [
                {text: '品牌', max: 100},
                {text: '内容', max: 100},
                {text: '可用性', max: 100},
                {text: '功能', max: 100},
                {text: '功能', max: 100},
                {text: '功能', max: 100},
                {text: '功能', max: 100},
            ],
            center: ['50%','50%'],
            radius: '100%'
        }
    ],
    series: [
        {
            type: 'radar',
             tooltip: {
                trigger: 'item'
            },
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            data: [
                {
                    value: [60,73,85,40,40,40,40],
                    name: '某软件'
                }
            ]
        }
    ]
};

v4dailiceshi@ycmedia.cn 1234qwer   代理
bctest/bctest 直客
