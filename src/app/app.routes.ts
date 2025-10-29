import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { BlankComponent } from './layouts/blank/blank.component';

export const routes: Routes = [
	// Rota raiz - redireciona para home (que verificará autenticação)
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'home'
	},
	// Rotas autenticadas (com layout completo)
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
	// Rotas públicas (sem autenticação, layout em branco)
	{
		path: 'authentication',
		component: BlankComponent,
		loadChildren: () =>
			import('./pages/authentication/authentication.module').then(m => m.AuthenticationModule),
	},
	// Rota 404 - qualquer outra rota não encontrada
	{
		path: '**',
		redirectTo: 'authentication/404',
	},
];
