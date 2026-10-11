import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ListaSolicitudesComponent } from './components/lista-solicitudes/lista-solicitudes.component';
import { NuevaSolicitudComponent } from './components/nueva-solicitud/nueva-solicitud.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

registerLocaleData(localeEsPe);

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, ListaSolicitudesComponent, NuevaSolicitudComponent, UsuariosComponent],
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule, AppRoutingModule],
  providers: [{ provide: LOCALE_ID, useValue: 'es-PE' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
