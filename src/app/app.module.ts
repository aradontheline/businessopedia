import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import{ FormsModule} from '@angular/forms';
import{B4aService} from './b4a.service';
import {AgmCoreModule} from '@agm/core';

import {environment} from '../environments/environment';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { AddBusinessComponent } from './add-business/add-business.component';
import { MyBusinessesComponent } from './my-businesses/my-businesses.component';
import { BusinessPageComponent } from './business-page/business-page.component';
import { EditBusinessComponent } from './edit-business/edit-business.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { GlyphSpinnerComponent } from './glyph-spinner/glyph-spinner.component';
import { GalleryComponent } from './gallery/gallery.component';
import { FetchNearestBusinessesComponent } from './fetch-nearest-businesses/fetch-nearest-businesses.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ProfileComponent,
    SearchbarComponent,
    NavbarComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    ForgotPassComponent,
    AddBusinessComponent,
    MyBusinessesComponent,
    BusinessPageComponent,
    EditBusinessComponent,
    SpinnerComponent,
    GlyphSpinnerComponent,
    GalleryComponent,
    FetchNearestBusinessesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey:environment.googleMapsApiKey
    })
  ],
  providers: [
    B4aService
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
