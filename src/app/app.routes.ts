import { Routes } from '@angular/router';
import { VerifyOtp } from './features/verify-otp/verify-otp';
import { Home } from './features/home/home';
import { About } from './features/about/about';
import { Notfound } from './features/notfound/notfound';
import { Booking } from './features/booking/booking';
import { Contact } from './features/contact/contact';


export const routes: Routes = [

  { path: '',component:Home  },
  {path:'verify-phone',component:VerifyOtp},
  {path:'about',component:About},
  {path:'contact',component:Contact},
  {path:'booking',component:Booking},
  {path:'**',component:Notfound}
    
];
