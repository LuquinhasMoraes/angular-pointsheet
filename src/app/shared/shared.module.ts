import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PROVIDERS } from '.';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
  ]
})
export class SharedModule { 
  constructor (@Optional() @SkipSelf() parentModule: SharedModule) { }

  static forRoot(): ModuleWithProviders {
    // const providersZorro = {providers: DatePipe, NZ_I18N, useValue: en_US}; 
    return {
      ngModule: SharedModule,
      providers: [
        PROVIDERS, 
        // AuthGuard, 
        // DatePipe, 
        HttpClient, 
        HttpClientModule
      ]
    };
  }
}
