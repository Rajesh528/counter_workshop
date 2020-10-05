import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
// import { HelloComponent } from './hello.component';
import { CustomPreviewPipe } from './pipes/custom-pipe';
import { CounterComponent } from './counter/counter.component';


@NgModule({
  imports:      [ BrowserModule, FormsModule,BrowserModule, ReactiveFormsModule ],
  declarations: [ AppComponent,CustomPreviewPipe,CounterComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }