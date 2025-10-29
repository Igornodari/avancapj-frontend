import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableUnitsComponent } from './table-units/table-units.component';
import { DetailUnitComponent } from './detail-unit/detail-unit.component';
import { UpsertUnitComponent } from './upsert-unit/upsert-unit.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				component: TableUnitsComponent,
				data: { title: 'HOME.UNITS.BREAD_CRUMB.TITLE' },
			},

			{
				path: ':id',
				component: DetailUnitComponent,
				data: { title: 'HOME.UNITS.BREAD_CRUMB.DETAIL_TITLE' },
			},
			{
				path: 'information/select',
				component: DetailUnitComponent,
				data: { title: 'HOME.UNITS.BREAD_CRUMB.DETAIL_TITLE' },
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class UnitsRoutingModule {}
