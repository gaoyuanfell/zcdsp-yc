import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Configure} from './interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'form-template',
  template: `
    <form novalidate>
      <ng-template [ngForOf]="formList" ngFor let-input>
        <div [ngSwitch]="input.type">

          <ng-template ngSwitchCase="text">
            <div class="temp-form-group flex-center">
              <label class="temp-form-label">{{input.label}}</label>
              <div class="temp-form-input">
                <input class="temp-form-control" type="text" [(ngModel)]="input.value" [name]="input.name" [placeholder]="input.placeholder">
              </div>
            </div>
          </ng-template>

          <ng-template ngSwitchCase="radio">
            <div class="temp-form-group flex-center">
              <label class="temp-form-label">{{input.label}}</label>
              <div class="temp-form-input flex-wrap-center" style="margin-bottom: -10px;">

                <label class="label-radio" *ngFor="let r of input.list">
                  <input type="radio" [value]="r.value" [(ngModel)]="input.value" [name]="input.name">
                  <span class="radio-box">
                    {{r.label}}
                  </span>
                </label>

              </div>
            </div>
          </ng-template>

          <ng-template ngSwitchCase="checkbox">
            <div class="temp-form-group flex-center">
              <label class="temp-form-label">{{input.label}}</label>
              <div class="temp-form-input flex-wrap-center" style="margin-bottom: -10px;">

                <label class="label-checkbox" *ngFor="let r of input.list">
                  <input type="checkbox" [(ngModel)]="r.checked" [name]="input.name">
                  <span class="checkbox-box">
                    {{r.label}}
                  </span>
                </label>

              </div>
            </div>
          </ng-template>

          <ng-template ngSwitchCase="select">
            <div class="temp-form-group flex-center">
              <label class="temp-form-label">{{input.label}}</label>
              <div class="temp-form-input input-select-after">

                <select [(ngModel)]="input.value" [name]="input.name">
                  <option *ngFor="let r of input.list" [value]="r.value">{{r.label}}</option>
                </select>

              </div>
            </div>
          </ng-template>

          <ng-template ngSwitchCase="date">
            <div class="temp-form-group flex-center">
              <label class="temp-form-label">{{input.label}}</label>
              <div class="temp-form-input">

                <input type="date" class="temp-form-control" [(ngModel)]="input.value" [name]="input.name"/>

              </div>
            </div>
          </ng-template>

          <ng-template ngSwitchCase="tel">
            <div class="temp-form-group flex-center">
              <label class="temp-form-label">{{input.label}}</label>
              <div class="temp-form-input">

                <input type="tel" class="temp-form-control" [(ngModel)]="input.value" [name]="input.name" [placeholder]="input.placeholder"/>

              </div>
            </div>
          </ng-template>

          <ng-template ngSwitchCase="email">
            <div class="temp-form-group flex-center">
              <label class="temp-form-label">{{input.label}}</label>
              <div class="temp-form-input">

                <input type="email" class="temp-form-control" [(ngModel)]="input.value" [name]="input.name" [placeholder]="input.placeholder"/>

              </div>
            </div>
          </ng-template>

          <ng-template ngSwitchCase="textarea">
            <div class="temp-form-group flex-center">
              <label class="temp-form-label">{{input.label}}</label>
              <div class="temp-form-input">

                <textarea [(ngModel)]="input.value" [name]="input.name" [placeholder]="input.placeholder"></textarea>

              </div>
            </div>
          </ng-template>

          <ng-template ngSwitchCase="submit">
            <button [ngStyle]="input.style" type="button" class="btn-submit" (click)="submit()">{{input.label}}</button>
          </ng-template>

        </div>

      </ng-template>
    </form>
  `,
  styles: [
      `
      .temp-form-group {
        padding: 10px 15px;
        position: relative;
        align-items: center;
        border-bottom: 1px solid #D9D9D9;
      }

      .temp-form-label {
        color: #616366;
        font-size: 14px;
        font-weight: 700;
        width: 70px;
        text-align: left;
        word-wrap: break-word;
        word-break: break-all;
      }

      .temp-form-input {
        width: 100%;
      }

      .temp-form-control {
        width: 100%;
        border: 0;
        outline: 0;
        -webkit-appearance: none;
        background-color: transparent;
        font-size: inherit;
        color: inherit;
        height: 36px;
        line-height: 36px;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      }

      .input-select-after:after {
        content: " ";
        display: inline-block;
        height: 6px;
        width: 6px;
        border-width: 2px 2px 0 0;
        border-color: #C8C8CD;
        border-style: solid;
        -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
        position: absolute;
        top: 50%;
        right: 15px;
        margin-top: -4px;
      }
    `,
      `
      .label-radio {
        min-width: 25%;
        margin-right: 10px;
        margin-bottom: 10px;
      }

      .radio-box {
        display: block;
        width: 100%;
        text-align: center;
        min-height: 36px;
        line-height: 34px;
        cursor: pointer;
        border: 1px solid #D9D9D9;
        border-radius: 5px;
        padding: 0 5px;
      }

      input[type=radio]:checked + .radio-box {
        color: #fff;
        background: rgba(32, 160, 255, 1);
      }

      .label-radio input[type=radio] {
        display: none;
      }
    `,
      `
      .label-checkbox {
        min-width: 25%;
        margin-right: 10px;
        margin-bottom: 10px;
      }

      .checkbox-box {
        display: block;
        width: 100%;
        text-align: center;
        min-height: 36px;
        line-height: 34px;
        cursor: pointer;
        border: 1px solid #D9D9D9;
        border-radius: 5px;
        padding: 0 5px;
      }

      .label-checkbox input[type=checkbox] {
        display: none;
      }

      input[type=checkbox]:checked + .checkbox-box {
        color: #fff;
        background: rgba(32, 160, 255, 1);
      }

      input[type=checkbox]:checked + .checkbox-box:before {
        content: '√ ';
      }
    `,
      `
      select {
        -webkit-appearance: none;
        border: 0;
        outline: 0;
        background-color: transparent;
        width: 100%;
        font-size: inherit;
        height: 36px;
        line-height: 36px;
        position: relative;
        z-index: 1;
        padding-left: 0;
      }
    `,
      `
      .btn-submit {
        cursor: pointer;
        margin: 10px auto;
        width: 90%;
        outline: none;
        background: rgba(32, 160, 255, 1);
        position: relative;
        display: block;
        padding-left: 14px;
        padding-right: 14px;
        box-sizing: border-box;
        font-size: 18px;
        text-align: center;
        text-decoration: none;
        color: #FFFFFF;
        line-height: 36px;
        border-radius: 5px;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        overflow: hidden;
      }
    `,
      `
      textarea {
        display: block;
        resize: none;
        width: 100%;
        color: inherit;
        font-size: 1em;
        line-height: inherit;
        height: 80px;
        outline: 0;
        border: 1px solid #e5e5e5;
        background-color: transparent;
      }
    `
  ]
})
export class FormComponent implements OnInit {

  type = 'form';

  get submitStyle() {
    if (this.formList instanceof Array) {
      return this.formList[this.formList.length - 1]
    }
    return null;
  }

  private _configure: Configure = {
    hints: '提交成功',
    submitOne: false,
  };

  get configure(): Configure {
    return this._configure;
  }

  @Input() set configure(value: Configure) {
    this._configure = value;
  }

  formList

  /**
   * 设置表单
   * @param list
   */
  setFormList(list) {
    this.formList = list;
  }

  submit() {
    if (this.configure.forwardUrl) {
      this.http.post(this.configure.forwardUrl, {
        account_id: '1',
        order_time: new Date(),
        url: window.location.href,
        data: this.getData()
      }, {headers: new HttpHeaders().set('Content-Type', 'application/json')}).subscribe((res: any) => {
        if (res.success == 200) {
          alert(this.configure.hints)
          if (this.configure.jumpLink) window.location.href = this.configure.jumpLink
        }
      })
    }
  }

  getData() {
    return this.formList.filter(fl => fl.type != 'submit').map(fl => {
      if (fl.type === 'checkbox') {
        return {
          label: fl.label,
          value: fl.list.filter(vm => vm.checked).map(b => b.value).join('|')
        }
      }
      return {
        label: fl.label,
        value: fl.value
      }
    })
  }

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
  }

}
