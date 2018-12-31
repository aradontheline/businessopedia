import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent} from './search/search.component';
import { ProfileComponent} from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { AddBusinessComponent } from './add-business/add-business.component';
import { MyBusinessesComponent } from './my-businesses/my-businesses.component';
import { BusinessPageComponent } from './business-page/business-page.component';
import { EditBusinessComponent } from './edit-business/edit-business.component';
import { MyChatsComponent } from './my-chats/my-chats.component';
import { ChatMessagesComponent } from './chat-messages/chat-messages.component';

const routes: Routes = [
  {path:'search',component:SearchComponent},
  {path:'profile',component:ProfileComponent},
  {path:'signup',component:SignupComponent},
  {path:'',component:HomeComponent,pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'forgot-pass',component:ForgotPassComponent},
  {path:'add-business',component:AddBusinessComponent},
  {path:'my-businesses',component:MyBusinessesComponent},
  {path:'business-page/:id',component:BusinessPageComponent},
  {path:'edit-business/:id',component:EditBusinessComponent},
  {path:'my-chats',component:MyChatsComponent},
  {path:'chat-messages',component:ChatMessagesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
