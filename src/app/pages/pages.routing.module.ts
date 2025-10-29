import { Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';

export const PagesRoutes: Routes = [
  
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Home',
    },
  },
  {
    path: 'account',
    component: AccountComponent,
    data: {
      title: 'Perfil',
    },
  },
  
];
