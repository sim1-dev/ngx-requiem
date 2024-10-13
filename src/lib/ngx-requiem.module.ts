import { ModuleWithProviders, NgModule } from '@angular/core';
import { ApiService } from './api/api.service';
import { API_CONFIG, ApiConfig } from './api/api-config.token';
import { HttpClientModule } from '@angular/common/http';
import { TeamApiService } from '../tests/examples/1-team/team.api.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  exports: []
})
export class NgxRequiemModule {
  public static forRoot(apiConfig: ApiConfig): ModuleWithProviders<NgxRequiemModule> {

    const module: ModuleWithProviders<NgxRequiemModule> = {
        ngModule: NgxRequiemModule,
        providers: [
            {
              provide: API_CONFIG, useValue: apiConfig
            },
            ApiService,
            TeamApiService
        ]
    }

    return module
  }
}
