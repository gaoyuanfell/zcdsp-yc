import {Component, Input} from '@angular/core';
import {TemplateService} from '../../service/template.service';
import {Dialog} from '../dialog/dialog';
import {PreviewImg} from '../preview-img/preview-img.service';

// 历史创意图库

@Component({
  selector: 'yc-creative-material',
  templateUrl: './creative-material.component.html',
  styleUrls: ['./creative-material.component.less']
})
export class CreativeMaterialComponent {

  historyList;

  _image

  private _config

  get config() {
    return this._config;
  }

  @Input() set config(value) {
    this._config = value;
    if (value) {
      this._templateService.materialHistory({
        element_type: value.element_type,
        width: value.width,
        height: value.height,
        max_file_size: value.max_file_size,
        support_file_type: value.support_file_type,
      }).subscribe(res => {
        this.historyList = res.result;
        this._image = this.historyList.find(hl => hl.url === value[value.name])
      })
    }
  }

  /**
   *
   */
  selected(image) {
    if (this._image === image) return;
    this._image = image

    this._dialog.closeSubject.next(image);
    this._dialog.close();
  }

  search(event: MouseEvent, list) {
    event.stopPropagation();
    event.preventDefault();
    let position = {
      x: event.x,
      y: event.y,
    };
    this._previewImg.open(list, {...position})
  }

  constructor(private _templateService: TemplateService, private _dialog: Dialog, private _previewImg: PreviewImg) {
  }

}
