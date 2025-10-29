import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { importBase } from 'src/app/shared/constant/import-base.constant';

@Component({
    selector: 'app-show-queue-erros',
    imports: [...importBase, NgxJsonViewerModule],
    templateUrl: './show-queue-erros.component.html',
    styles: `.json-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}
`
})
export class ShowQueueErrosComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: SnackBarService) {}

	copyJson() {
		const jsonString = JSON.stringify(this.data.body, null, 2); // identado
		navigator.clipboard.writeText(jsonString).then(() => {
			this._snackBar.success('Copiado!');
		});
	}
}
