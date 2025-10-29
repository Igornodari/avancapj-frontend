import { Component } from '@angular/core';
import BaseTableComponent from 'src/app/components/base-table.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { URI_PATH } from 'src/app/shared/constant/path.contant';
import { QueueErros } from '../queue-erros.type';
import { AppDialogConfirmationComponent } from 'src/app/components/dialog-confirmation.component';
import { importBase } from 'src/app/shared/constant/import-base.constant';
import { TruncatePipe } from '../../../../shared/pipe/truncate.pipe';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { DialogService } from 'src/app/services/dialog.service';
import { ShowQueueErrosComponent } from '../show-queue-erros/show-queue-erros.component';

@Component({
	selector: 'app-table-queue-erros',
	imports: [...importBase, TruncatePipe, NgxJsonViewerModule],
	templateUrl: './table-queue-erros.component.html',
})
export class TableQueueErrosComponent extends BaseTableComponent<QueueErros> {
	public formGroup: FormGroup;
	constructor(private _dialogService: DialogService) {
		super({ filterName: 'TableQueueErrosComponent' });

		this.displayedColumns = ['createdAt', 'function', 'cid', 'error', 'visibilityIcon'];
		this.fields = [
			{ key: 'cid', label: 'SYSTEM.QUEUE_ERRORS.TABLE.CID', type: 'text' },
			{ key: 'function', label: 'SYSTEM.QUEUE_ERRORS.TABLE.QUEUE', type: 'text' },
			{ key: 'body', label: 'body', type: 'text' },
			{ key: 'error', label: 'error', type: 'text' },

			{ key: 'createdAt', label: 'Data de criação', type: 'date' },
		];
	}

	override setDataSource() {
		return this.requestService.list<QueueErros>(
			`${URI_PATH.ACTIVITY.QUEUE_ERRORS.MAIN}?${this.queryString}`
		);
	}
	retry(_id: string) {
		this._dialogService
			.openDialogConfirmation({
				data: {
					title: this.translate.instant('SYSTEM.QUEUE_ERRORS.DIALOG.DIALOG_ERROR.TITLE'),
					subTitle: this.translate.instant('SYSTEM.QUEUE_ERRORS.DIALOG.DIALOG_ERROR.DESCRIPTION'),
				},
			})
			.afterClosed()
			.subscribe({
				next: data => {
					if (data) {
						this.requestService
							.post(`${URI_PATH.ACTIVITY.QUEUE_ERRORS.RETRY}`, { _id })
							.subscribe()
							.add(() => {
								this.loading = false;
								this.getDataSource();
							});
					}
				},
			});
	}

	openDetail(queue: QueueErros) {
		this._dialog.open(ShowQueueErrosComponent, {
			width: '600px',
			data: queue,
		});
	}
}
