import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { BlankComponent } from './layouts/blank/blank.component';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'home'
	},
	{
		path: 'home',
		component: FullComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: '',
				loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
			},
		],
	},
	{
		path: 'authentication',
		component: BlankComponent,
		loadChildren: () =>
			import('./pages/authentication/authentication.module').then(m => m.AuthenticationModule),
	},
	{
		path: '**',
		redirectTo: 'authentication/404',
	},
];
