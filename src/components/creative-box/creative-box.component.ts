import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import * as qs from 'querystring';
import {CreativeService} from '../../service/customer/creative.service';
import {Notification} from '../notification/notification';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Dialog} from '../dialog/dialog';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CreativeBoxComponent),
  multi: true
};

@Component({
  selector: 'yc-creative-box',
  exportAs: 'creativeBox',
  templateUrl: './creative-box.component.html',
  styleUrls: ['./creative-box.component.less'],
  host: {
    '[class.flex-wrap-center]': 'is_edit'
  },
  // changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
  ]
})
export class CreativeBoxComponent implements OnInit, ControlValueAccessor {

  private _elementList = []

  private element

  private _selectMediaSize;

  private _elements;

  private creativeNumber = 0;

  private _editCreative = true;  // 编辑创意的时候 不需要新建创意

  get is_edit() {
    return this._selectMediaSize
  }

  get selectMediaSize() {
    return this._selectMediaSize;
  }

  @Input() set selectMediaSize(value) {
    this._selectMediaSize = value;
  }

  get elementList(): any[] {
    return this._elementList;
  }

  get editCreative() {
    return this._editCreative;
  }

  @Input() set editCreative(value) {
    this._editCreative = value;
  }

  @Input() set elementList(value: any[]) {
    this._elementList = value;
  }

  get elements() {
    return this._elements;
  }

  get preview(): boolean {
    return this._preview;
  }

  @Input() set preview(value: boolean) {
    this._preview = value;
  }

  private _preview = false;

  @Output() elementChange = new EventEmitter<any>()
  @Output() registerAddCreative = new EventEmitter<any>()

  @Input() set elements(value) {
    if (value) {
      this.creativeNumber = 0;
      this.elementList.length = 0
      let elements = JSON.parse(JSON.stringify(value));
      let data_list = elements.data_list;
      if (data_list instanceof Array && data_list.length) {
        data_list.forEach(dl => {
          dl.file_list && dl.file_list.forEach(fl => {
            if (fl.file_size) {
              fl.size = fl.file_size.split('X');
              fl.extensions = fl.support_file_type.split(',')
            }
          })
        })
      }
      this.element = elements;
      this.registerAddCreative.emit(this.addCreative.bind(this))
      this.elementChange.emit();
    }
    this._elements = value;
  }

  addCreative() {
    if (!this.element || !this.selectMediaSize) return;
    if (this.elementList.length >= 5) {
      this._notification.warning('提示', '最多添加5个创意！');
      return
    }
    ++this.creativeNumber;
    let element = JSON.parse(JSON.stringify(this.element));
    element.creative_name = `${this.selectMediaSize.material_width}X${this.selectMediaSize.material_height}-${this.selectMediaSize.material_type_name}-${this.creativeNumber}`;
    // element.creative_name = `${this.selectMediaSize.media_name}-${this.selectMediaSize.material_width}X${this.selectMediaSize.material_height}-${this.selectMediaSize.material_type_name}-${this.creativeNumber}`;
    this.elementList.push(element);
    this.changeDetectorRef.markForCheck()
  }

  /**
   * 获取创意box最大宽度
   * @returns {number}
   */
  get maxWidth() {
    let width = 226;
    let data_list = this.element.data_list;
    if (!(this.element && data_list instanceof Array)) return 0;
    if (data_list.length === 1 && data_list[0].file_list) {
      return data_list[0].file_list.length * width + data_list[0].file_list.length - 1
    }
    return width * data_list.length + data_list.length * 2
  }

  get maxInputWidth() {
    let width = 226;
    let data_list = this.element.data_list;
    if (!(this.element && data_list instanceof Array)) return 0;
    if (data_list.length === 1 && data_list[0].file_list) {
      return data_list[0].file_list.length * width
    }
    return width * data_list.length + data_list.length * 2 - data_list.length + 1
  }

  _validateText(ele) {
    if (ele.min_length == 0 && ele.max_length == 0) {
      ele.validate = true;
      return
    }
    ele.validate = !(ele.min_length > ele[ele.name].length || ele.max_length < ele[ele.name].length);
  }

  /**
   * 设置值
   * @param {[any]} values
   */
  setValue(values: [any] | any) {
    if (!this.element) return;
    this.elementList.length = 0;
    if (values instanceof Array && values.length) {
      this.setValueFun(values)
    } else if (values) {
      this.setValueFun([values])
    }
    this.changeDetectorRef.markForCheck();
  }

  /**
   * 获取值
   */
  getValue() {
    let result = [];
    if (this._elementList instanceof Array && this._elementList.length) {
      this._elementList.every(elements => {
        let element_data = {
          data_list: [],
          creative_name: elements.creative_name,
          is_dynamic_words: elements.is_dynamic_words,
        }
        let element = elements.data_list;
        element.every((ele, inx) => {
          let body = {};
          Object.keys(ele).every(oke => {
            if (ele[oke] instanceof Array) {
              body[oke] = [];
              ele[oke].every(el => {
                body[oke].push({
                  [el.name]: el[el.name]
                });
                return true
              });
            }
            return true
          });
          element_data.data_list.push(body);
          return true
        });
        result.push(element_data);
        return true
      });
      this.onChange(result)
    } else {
      this.onChange(null)
    }
  }

  /**
   * 赋值
   * @param values
   */
  private setValueFun(values) {
    console.info(values)
    values.forEach(value => {
      let element = JSON.parse(JSON.stringify(this.element));
      element.data_list.forEach((dl, dli) => {
        dl.file_list && dl.file_list.forEach((fl, fli) => {
          fl[fl.name] = value.data_list[dli].file_list[fli][fl.name]
          fl.validate = true;
        });
        dl.text_list && dl.text_list.forEach((tl, tli) => {
          tl[tl.name] = value.data_list[dli].text_list[tli][tl.name]
          tl.validate = false;
          if(tl.max_length && tl.min_length){
            if(tl.max_length >= tl[tl.name].length && tl.min_length <= tl[tl.name].length){
              tl.validate = true;
            }
          }else{
            tl.validate = true;
          }
        })
      });
      if (element.logo) {
        element.logo[element.logo.name] = value.logo[element.logo.name]
      }
      this.elementList.push(element);
    });
  }

  /**
   * 创意上传
   * @param files
   * @param body
   * @param file_index
   * @param data_index
   */
  _upload(files, body, data_index, file_index) {
    this._creativeService.creativeUpload({
      file: files[0],
      media_material_id: this.selectMediaSize.media_material_id,
      file_index: file_index,
      data_index: data_index
    }).subscribe(res => {
      let data = res.result;
      let filePath = data.filePath;
      delete data.filePath;
      body[body.name] = `${filePath}?${qs.stringify(data)}`;
      body.validate = true;
      this.changeDetectorRef.markForCheck()
    })
  }

  _imgError(error) {
    this._notification.error('上传', error.message)
  }

  _removeCreative(index) {
    this.elementList.splice(index, 1);
  }

  // ------------------快速制图-------------

  @ViewChild('creativeTemplate', {read: TemplateRef}) creativeTemplate;

  templateConfig

  // 快速制图
  openTemplate(event: Event, body, data_index, file_index) {
    event.stopPropagation();
    this.templateConfig = {
      width: body.size[0],
      height: body.size[1],
      size: body.max_file_size * 1024,
      extensions: body.extensions,
    }

    this._dialog.open(this.creativeTemplate, {maxWidth: '100vw',maxHeight: '100vh', fullScreen: true, flag: false, title: '快速制图'}).subscribe((data: Blob) => {
      if (data instanceof Blob) {
        let file = new File([data], Date.now() + `.${body.extensions[0]}`, {type: data.type});
        this._creativeService.creativeUpload({
          file: file,
          media_material_id: this.selectMediaSize.media_material_id,
          file_index: file_index,
          data_index: data_index
        }).subscribe(res => {
          let data = res.result;
          let filePath = data.filePath;
          delete data.filePath;
          body[body.name] = `${filePath}?${qs.stringify(data)}`;
          body.validate = true;
          this.changeDetectorRef.markForCheck();
        })
      }
    })
  }

  @ViewChild('historyCreative', {read: TemplateRef}) historyCreative;

  materialConfig // 历史图库配置

  // 素材库
  materialLibrary(event: Event, body, data_index, file_index) {
    event.stopPropagation();
    this.materialConfig = body
    this._dialog.open(this.historyCreative, {maxWidth: '100vw',maxHeight: '100vh', fullScreen: true, flag: false, title: '从创意库选择'}).subscribe((data) => {
      if (data) {
        body[body.name] = data.url;
        body.validate = true;
        this.changeDetectorRef.markForCheck();
      }
    })
  }

  constructor(private _creativeService: CreativeService,
              private _notification: Notification,
              private _dialog: Dialog,
              private changeDetectorRef: ChangeDetectorRef,
  ) {

  }

  private onChange = (value) => {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
    if (!obj) return;
    this.setValue(obj);
    this.changeDetectorRef.markForCheck();
  }

  _inputSubject = new Subject<any>()

  ngOnInit() {
    this._inputSubject.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.getValue()
    })
  }

  tableList: any = [];
  query = {
    page_index: 1,
    page_size: 5
  }
  total_count;


  danamitic() {
    return this._creativeService.dynamicWords(this.query);

    // this._creativeService.dynamicWords(this.query).subscribe(res => {
    //   this.tableList = res.result;
    //   console.log(this.tableList)
    //   popover.open();
    //   this.changeDetectorRef.markForCheck()
    //   // this.total_count = res.total_count;
    // })
  }

}
