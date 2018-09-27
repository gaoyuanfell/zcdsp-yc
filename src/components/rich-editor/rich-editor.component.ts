import {Component, ElementRef, EventEmitter, forwardRef, OnInit, Output, ViewChild} from '@angular/core';
import {ScheduleComponent} from '../schedule/schedule.component';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RichEditorComponent),
  multi: true
};

@Component({
  selector: 'yc-rich-editor',
  templateUrl: './rich-editor.component.html',
  styleUrls: ['./rich-editor.component.less'],
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
  ]
})
export class RichEditorComponent implements OnInit, ControlValueAccessor {

  @ViewChild('wangEditor1') wangEditor1: ElementRef;
  @ViewChild('wangEditor2') wangEditor2: ElementRef;

  value;
  editor;

  editorInit() {
    this.editor = new wangEditor(this.wangEditor1.nativeElement, this.wangEditor2.nativeElement);
    this.editor.customConfig.menus = [
      // 'head',  // 标题
      'bold',  // 粗体
      'fontSize',  // 字号
      'fontName',  // 字体
      'italic',  // 斜体
      'underline',  // 下划线
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'link',  // 插入链接
      'list',  // 列表
      'justify',  // 对齐方式
      // 'quote',  // 引用
      // 'emoticon',  // 表情
      // 'image',  // 插入图片
      // 'table',  // 表格
      // 'video',  // 插入视频
      // 'code',  // 插入代码
      'undo',  // 撤销
      'redo'  // 重复
    ];
    this.editor.customConfig.pasteIgnoreImg = true;
    this.editor.customConfig.colors = [
      '#000000',
      '#eeece0',
      '#1c487f',
      '#4d80bf',
      '#c24f4a',
      '#8baa4a',
      '#7b5ba1',
      '#46acc8',
      '#f9963b',
      '#ffffff'
    ];
    this.editor.customConfig.onchange = (html) => {
      this.onChange(html);
    };
    this.editor.create();
  }

  constructor() {

  }

  ngOnInit(): void {
    this.editorInit();
  }

  onChange = (value) => value;

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
    this.value = obj;
    this.editor.txt.html(obj);
  }

}
