import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { OrientationService } from '../../../../service/customer/orientation.service';
import { Dialog } from '../../../../components/dialog/dialog';
import { AutoCookie } from '../../../../decorator/decorator';

@Component({
  selector: 'app-directional',
  templateUrl: './directional.component.html',
  styleUrls: ['./directional.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class DirectionalComponent implements OnInit {
  @AutoCookie({
    defaultValue: {
      page_index: 1,
      page_size: 10
    },
    keepValue: {},
    cookieKey: 'Directional2Component'
  })
  query
  total_count;
  tableList;

  search() {
    this.query.page_index = 1;
    this.list();
  }

  list() {
    this._orientationService.list(this.query).subscribe(res => {
      this.tableList = res.result.items;
      this.total_count = res.result.total_count;
      this.changeDetectorRef.markForCheck();
    })
  }

  _delete(id) {
    this._dialog.open('是否删除定向包？', { title: '删除定向包' }).subscribe(data => {
      if (data) {
        this._orientationService.deleteOrientation({ package_ids: id }).subscribe(res => {
          this.search();
        })
      }
    })
  }

  constructor(private _orientationService: OrientationService,
    private _dialog: Dialog,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.search()
  }

}
