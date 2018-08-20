import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {metaReducers, reducers} from '../store/reducer';
import {StoreModule} from '@ngrx/store';
import {environment} from '../environments/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {BoardComponent} from './board.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {Module} from './module';
import {EffectsModule} from '@ngrx/effects';
import {effects} from '../store/effects';
import {ServiceWorkerModule} from '@angular/service-worker';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    Module,

    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),

    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      name: 'ZCDSP YC Store DevTools',
      logOnly: environment.production,
    }),
    EffectsModule.forRoot(effects),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
