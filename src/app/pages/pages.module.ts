import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesRoutes } from './pages.routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideEnvironmentNgxMask } from 'ngx-mask';
import { LoadingComponent } from '../components/loading.component';
import { HomeComponent } from './home/home.component';

@NgModule({
	providers: [provideEnvironmentNgxMask()],
	imports: [
		CommonModule,
		MaterialModule,
		FormsModule,
		RouterModule.forChild(PagesRoutes),
		HomeComponent,
		ReactiveFormsModule,
		NgxMaskDirective,
		LoadingComponent,
	],
})
export class PagesModule {}
