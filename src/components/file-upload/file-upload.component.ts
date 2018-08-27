import {Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnDestroy, Output, ViewChild, HostBinding, Renderer2} from '@angular/core';
import {Subject} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import SparkMD5 from 'spark-md5'

@Component({
  selector: '[yc-file-upload]',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.less'],
  preserveWhitespaces: true,
})
export class FileUploadComponent implements OnDestroy {

  subject = new Subject<any>();



  constructor(@Inject(DOCUMENT) private document: Document, private ref: ElementRef,
              private renderer: Renderer2) {
  }

  ngOnDestroy(): void {
    this.eventChange.unsubscribe();
    this.eventError.unsubscribe();
    this.eventDragleave.unsubscribe();
    this.eventDragenter.unsubscribe();
    this.eventDragover.unsubscribe();
    this.subject.unsubscribe()
  }

  private _sliceSize = this.getByte() * 10;

  get sliceSize(): number {
    return this._sliceSize;
  }

  @Input('sliceSize') set sliceSize(value: number) {
    this._sliceSize = value * this.getByte();
  }

  @Input('drop') isDrop;
  @Input() slice = false;
  /**
   * {
      extensions: ['gif', 'jpg', 'jpeg', 'bmp', 'png'],
      mimeTypes: 'image/*',
      maxSize: 20,
      size: [100X100,200X200,200X200]
    };
   */
  @Input() accept: any;
  @Input() auto = true;
  @Input() dataType: 'M' | 'K' | 'B' = 'M';
  @Input() multiple: boolean = false;
  @Output('eventChange') eventChange = new EventEmitter<any>();
  @Output('eventError') eventError = new EventEmitter<any>();
  @Output('dragleave') eventDragleave = new EventEmitter<any>();
  @Output('dragenter') eventDragenter = new EventEmitter<any>();
  @Output('dragover') eventDragover = new EventEmitter<any>();
  @Input() type = ['image'];
  _disabled: any = false;
  @Input() set disabled(disabled) {
    if (disabled) {
      this.renderer.setAttribute(this.ref.nativeElement, 'disabled', 'true')
    } else {
      this.renderer.removeAttribute(this.ref.nativeElement, 'disabled')
    }
    this._disabled = disabled;
  }
  get disabled() {
    return this._disabled;
  }
  // @HostBinding('attr.disabled')  false;

  // @HostBinding('attr.disabled') @Input('disabled') disabled;
  @ViewChild('file') fileRef: ElementRef;

  private getByte() {
    switch (this.dataType) {
      case 'M':
        return 1024 * 1024;
      case 'K':
        return 1024;
      case 'B':
        return 1
    }
    return 0
  }

  cacheFiles = [];

  upload() {
    this.cacheFiles.every(cf => {
      this.subject.next(cf);
      return true;
    })
  }

  async change(file) {
    console.log('上传文件拉')
    console.log(file)
    this.subject = new Subject<any>();
    this.cacheFiles = [];

    if (this.slice) {
      if (this.multiple) {
        for (let i = 0; i < file.files.length; i++) {
          let blob = file.files.item(i);
          let md5 = await this.fileMd5(blob);
          this.checkFile(blob, md5);
          this.eventChange.emit({
            files: [blob],
            md5: md5,
            chunkNext: this.subject,
            upload: this.upload.bind(this)
          });
          if (this.auto) {
            this.upload();
          }
        }
      } else {
        let blob = file.files[0];
        let md5 = await this.fileMd5(blob);
        this.checkFile(blob, md5);
        this.eventChange.emit({
          files: [blob],
          md5: md5,
          chunkNext: this.subject,
          upload: this.upload.bind(this)
        });
        if (this.auto) {
          this.upload();
        }
      }
      this.fileRef.nativeElement.value = null;
    } else {
      if (this.multiple) {
        this.eventChange.emit(file.files);
      } else {
        console.log('上传单个文件')
        if (this.accept) {
          console.log(this.accept)
          let blob = file.files[0];
          console.log(blob)
          /////
          if (this.accept.maxSize) {
            let _size = blob.size > this.accept.maxSize * this.getByte();
            if (_size) {
              this.eventError.emit({
                type: 1,
                message: '文件过大！'
              });
              this.fileRef.nativeElement.value = null;
              return
            }
          }
          //////
          console.log(this.accept.extensions)
          if (this.accept.extensions) {
            console.log(this.accept.extensions)
            console.log('jinlai')
            let suffix = blob.name.substr(blob.name.lastIndexOf('.') + 1);
            let _suffix = !!~this.accept.extensions.indexOf(suffix);
            if (!_suffix) {
              this.eventError.emit({
                type: 2,
                message: '文件格式不对！'  // 未识别文件扩展名
              });
              this.fileRef.nativeElement.value = null;
              return
            }
          }
          //
          if (this.accept.mimeTypes) {
            let _mime = new RegExp(this.accept.mimeTypes).test(blob.type);
            if (!_mime) {
              this.eventError.emit({
                type: 3,
                message: '文件格式不对！'  // 未识别的文件类型
              });
              this.fileRef.nativeElement.value = null;
              return
            }
          }
          ///////
          if (this.accept.size) {
            if (blob.type.indexOf('image') != -1) {
              let {width, height} = await this.image(blob);
              let _wh = width + 'X' + height;
              // let _wh = this.accept.size[0] == width && this.accept.size[1] == height;
              if (this.accept.size.indexOf(_wh) === -1) {
                this.eventError.emit({
                  type: 4,
                  message: '图片尺寸不匹配！'
                });
                this.fileRef.nativeElement.value = null;
                return
              }
            }

            if (blob.type.indexOf('video') != -1) {
              let {width, height, duration} = await this.video(blob);
              let _wh = this.accept.size[0] == width && this.accept.size[1] == height;

              let _duration = this.accept.duration >= Math.floor(duration)

              if (!_duration) {
                this.eventError.emit({
                  type: 5,
                  message: `视频时长不匹配！当前${Math.floor(duration)}s`
                });
                this.fileRef.nativeElement.value = null;
                return
              }

              if (!_wh) {
                this.eventError.emit({
                  type: 6,
                  message: '视频尺寸不匹配！'
                });
                this.fileRef.nativeElement.value = null;
                return
              }

            }

          }
        }
        this.eventChange.emit(file.files);
        this.fileRef.nativeElement.value = null;
      }
    }
  }

  checkFile(file: File, md5) {
    let start = 0;
    let end;
    let index = 0;
    let fileName = file.name;
    let fileSize = file.size;
    let total = Math.ceil(fileSize / this._sliceSize);
    while (start < fileSize) {
      end = start + this._sliceSize;
      if (end > fileSize) {
        end = fileSize;
      }
      let chunk = file.slice(start, end);
      let newFile = new File([chunk], `${index}_${fileName}`, {type: file.type});
      start = end;
      this.cacheFiles.unshift({
        files: [newFile],
        chunk: index,
        chunk_size: this._sliceSize,
        chunks: total,
        md5: md5
      });
      ++index;
    }
  }

  image(url: string | Blob) {
    return new Promise<any>((resolve, reject) => {
      let img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        })
      };
      img.onerror = (err) => {
        reject(err)
      };
      if (url instanceof Blob) {
        img.src = URL.createObjectURL(url)
      } else {
        img.src = url
      }
    })
  }

  video(url: string | Blob) {
    return new Promise<any>((resolve, reject) => {
      let videoRef = <HTMLVideoElement>this.document.createElement('video');

      if (url instanceof Blob) {
        videoRef.src = URL.createObjectURL(url)
      } else {
        videoRef.src = url
      }

      videoRef.addEventListener('loadedmetadata', (event) => {
        console.dir(videoRef)
        resolve({
          width: videoRef.videoWidth,
          height: videoRef.videoHeight,
          duration: videoRef.duration,
        })
        this.document.body.removeChild(videoRef)
      });

      this.document.body.appendChild(videoRef)
    })
  }

  async fileMd5(file) {
    let start = 0;
    let end;
    let index = 0;
    let fileSize = file.size;
    if (!SparkMD5) throw {message: 'Depend on SparkMD5 download link https://github.com/satazor/js-spark-md5'}
    let spark = new SparkMD5();
    while (start < fileSize) {
      end = start + this._sliceSize;
      if (end > fileSize) {
        end = fileSize;
      }
      let chunk = file.slice(start, end);
      let result = await this.fileReader(chunk);
      spark.appendBinary(result);
      start = end;
      ++index;
    }
    return spark.end()
  }

  fileReader(blob) {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(blob);
      fileReader.onload = (e: any) => {
        resolve(e.target.result)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  @HostListener('click')
  private eventClick() {
    if (this.disabled) return;
    this.fileRef.nativeElement.click();
  }

  @HostListener('dragleave', ['$event'])
  private dragleave(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.isDrop) return;
    this.eventDragleave.emit(e);
  }

  @HostListener('dragenter', ['$event'])
  private dragenter(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.isDrop) return;
    this.eventDragenter.emit(e);
  }

  @HostListener('dragover', ['$event'])
  private dragover(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.isDrop) return;
    this.eventDragover.emit(e);
  }

  @HostListener('drop', ['$event'])
  private drop(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.isDrop) return;
    if (this.disabled) return;
    this.change(e.dataTransfer.files).catch(error => console.error(error))
  }
}
