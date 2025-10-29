import { Component, Inject, OnDestroy, Optional, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Unit, User } from '../shared/types';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
import { RequestService } from '../services/request.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	standalone: true,
	selector: 'app-base',
	template: '',
})
export default class BaseComponent implements OnDestroy {
	private _unsubscribe$ = new Subject<void>();
	private _authService = inject(AuthService);
	private _requestService = inject(RequestService);
	private _location = inject(Location);
	public _translate = inject(TranslateService);

	public queryString = new URLSearchParams();
	public searchParams: any = {};
	public loading = false;
	public user: User;
	public unit: Unit;

	constructor(
		@Optional() @Inject('settings') protected settings?: { loadUnit?: boolean; service?: any }
	) {
		this._authService.$user
			.pipe(takeUntil(this._unsubscribe$))
			.subscribe(user => (this.user = user));
		this.loadUnit();
	}

	afterLoadUnit(fun: (unit: Unit) => any) {
		this._authService.$unit.pipe(takeUntil(this._unsubscribe$)).subscribe(unit => {
			this.unit = unit;
			fun(unit);
		});
	}
	loadUnit() {
		if (this.settings?.loadUnit === undefined || this.settings?.loadUnit === true) {
			this.afterLoadUnit(() => {});
		}
	}

	get authService() {
		return this._authService;
	}

	get requestService() {
		return this._requestService;
	}

	get location() {
		return this._location;
	}

	get unsubscribe$() {
		return this._unsubscribe$;
	}

	ngOnDestroy() {
		if (this.settings?.service) {
			this.settings.service = undefined;
		}
		this._unsubscribe$.next();
		this._unsubscribe$.complete();
	}
}
