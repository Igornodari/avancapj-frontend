import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { LoadingComponent } from 'src/app/components/loading.component';
import { QueryBuilderComponent } from 'src/app/components/query-builder/query-builder.component';
import { RecordReadingComponent } from 'src/app/components/record-reading.component';
import { StatusComponent } from 'src/app/components/status.component';
import { MaterialModule } from 'src/app/material.module';

export const importBase = [
	MaterialModule,
	CommonModule,
	FormsModule,
	ReactiveFormsModule,
	NgxMaskDirective,
	NgxMaskPipe,
	LoadingComponent,
	MatDatepickerModule,
	MatNativeDateModule,
	RouterModule,
	StatusComponent,
	TranslateModule,
	RecordReadingComponent,
];
