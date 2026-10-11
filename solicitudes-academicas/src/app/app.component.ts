import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<app-header></app-header><main id="contenido" class="container"><router-outlet></router-outlet></main><app-footer></app-footer>'
})
export class AppComponent {}
