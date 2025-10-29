import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableQueueErrosComponent } from './queue-erros/table-queue-erros/table-queue-erros.component';
import { GridPermissionsComponent } from './permissions/grid-permissions/grid-permissions.component';
import { TableCategoryComponent } from './category/table-category/table-category.component';
import { DetailCategoryComponent } from './category/detail-category/detail-category.component';

export const SystemRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'queue-erros',
				component: TableQueueErrosComponent,
				data: {
					title: 'SYSTEM.QUEUE_ERRORS.TABLE.TITLE',
				},
			},
			{
				path: 'permissions',
				component: GridPermissionsComponent,
				data: { title: 'SYSTEM.PERMISSIONS.TITLE' },
			},
			{
				path: 'categories',
				component: TableCategoryComponent,
				data: { title: 'SYSTEM.CATEGORIES.ITEMS.TABLE.TITLE' },
			},
			{
				path: 'categories/group',
				component: TableCategoryComponent,
				data: { title: 'SYSTEM.CATEGORIES.GROUP.TABLE.TITLE' },
			},
			{
				path: 'categories/show:id',
				component: DetailCategoryComponent,
				data: { title: 'Categoria' },
			},
		],
	},
];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(SystemRoutes)],
})
export class SystemRoutingModule {}
