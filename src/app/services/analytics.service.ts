import { inject, Injectable } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Injectable({
	providedIn: 'root',
})
export class AnalyticsService {
	public analytics: Analytics = inject(Analytics);

	constructor() {}

	logEvent(eventName: string, eventParams: { [key: string]: any } = {}): void {
		logEvent(this.analytics, eventName, eventParams);
	}
	logPageView(pageName: string): void {
		this.logEvent('page_view', { page_title: pageName });
	}
}
