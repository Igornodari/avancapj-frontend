import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class DateService {

	constructor() {
	}

	formatUTCDate(date: Date): string {
		return date.toISOString().split('.')[0] + 'Z';
	}
}
