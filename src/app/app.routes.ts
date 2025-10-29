import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { BlankComponent } from './layouts/blank/blank.component';

export const routes: Routes = [
	{
		path: '',
		component: FullComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: '',
				loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
			},
			{
				path: 'users',
				loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule),
			},
			{
				path: 'units',
				loadChildren: () =>
					import('./pages/units/units-routing.module').then(m => m.UnitsRoutingModule),
			},
			{
				path: 'system',
				loadChildren: () =>
					import('./pages/system/system.routing.module').then(m => m.SystemRoutingModule),
			}
		],
	},
	{
		path: '',
		component: BlankComponent,
		children: [
			{
				path: 'authentication',
				loadChildren: () =>
					import('./pages/authentication/authentication.module').then(m => m.AuthenticationModule),
			},
		],
	},
	{
		path: '**',
		redirectTo: 'authentication/404',
	},
];
