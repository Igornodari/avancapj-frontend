import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
	handleError(error: any): void {
		if (error?.message?.includes('ChunkLoadError')) {
			console.warn('ChunkLoadError detectado. Recarregando a página...');
			window.location.reload();
		} else {
			console.error(error);
		}
	}
}
