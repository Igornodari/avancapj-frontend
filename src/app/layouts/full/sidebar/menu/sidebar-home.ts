import { NavCap } from '../nav-item/nav-item';

export const navItemsHome: NavCap[] = [
	{
		navCap: 'Menu Principal',
		items: [
			{
				displayName: 'Dashboard',
				iconName: 'dashboard',
				route: '/home',
			},
			{
				displayName: 'Ferramentas',
				iconName: 'build',
				route: '/home/tools',
			},
		],
	},
];
