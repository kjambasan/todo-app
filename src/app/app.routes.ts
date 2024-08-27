import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { AccountComponent } from './pages/account/account.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Tasks',
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    title: 'Categories',
  },
  {
    path: 'account',
    component: AccountComponent,
    title: 'Account',
  },
];
