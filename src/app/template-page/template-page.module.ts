import {NgModule} from '@angular/core';
import {Module} from '../module';
import {TemplatePageComponent} from './template-page.component';
import {TemplatePageRoutingModule} from './template-page-routing.module';
import {TextComponent} from './brick/text.component';
import {ImageComponent} from './brick/image.component';
import {SlideComponent} from './brick/slide.component';
import {VideoComponent} from './brick/video.component';
import {ButtonComponent} from './brick/button.component';
import {LinkComponent} from './brick/link.component';
import {FormComponent} from './brick/form.component';
import {LineComponent} from './brick/line.component';
import {TemplateBoxComponent} from './template-box.component';

@NgModule({
  imports: [
    Module,
    TemplatePageRoutingModule
  ],
  declarations: [
    TemplatePageComponent,
    TemplateBoxComponent,
    TextComponent,
    ImageComponent,
    SlideComponent,
    VideoComponent,
    ButtonComponent,
    LinkComponent,
    FormComponent,
    LineComponent,
  ],
  entryComponents: [
    TemplateBoxComponent,
    TextComponent,
    ImageComponent,
    SlideComponent,
    VideoComponent,
    ButtonComponent,
    LinkComponent,
    FormComponent,
    LineComponent,
  ],
  providers: [],
})
export class TemplatePageModule {
}
