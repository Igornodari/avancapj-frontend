import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppSettings, defaults } from '../app.config';
import { RequestService } from './request.service';
import { URI_PATH } from '../shared/constant/path.contant';
import { LocalStorageService } from './local-storage.service';
import { LOCAL_STORAGE } from '../shared/constant/local-storage.constant';
import { Unit } from '../shared/types';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  private options: AppSettings = defaults;
  private notify$ = new BehaviorSubject<AppSettings>(this.options);
  private supportedLangs = ['en', 'pt'];

  constructor(
    private _requestService: RequestService,
    private localStorageService: LocalStorageService,
    private _translateService: TranslateService
  ) {
		this.options = this.getOptions();
    this.initializeI18n();
  }

  get notify(): Observable<Record<string, any>> {
    return this.notify$.asObservable();
  }

  get options$(): Observable<AppSettings> {
    return this.notify$.asObservable();
  }

  private initializeI18n() {
    const currentLang = this.getInitialLanguage();
    this._translateService.setDefaultLang(currentLang);
    this._translateService.use(currentLang);
    this.options.language = currentLang;
    this.setOptions(this.options);
  }

  private getInitialLanguage(): string {
    const browserLang = this._translateService.getBrowserLang() || this.options.language;
    return this.supportedLangs.includes(browserLang) ? browserLang : this.options.language;
  }

	getOptions() {
		const localDefault = this.localStorageService.getItem(LOCAL_STORAGE.CONFIG);
		if (localDefault) {
			this.options = Object.assign({}, defaults, JSON.parse(localDefault));
		}
		return this.options;
	}


	setOptions(options: AppSettings) {
		this.options = Object.assign({}, defaults, options);
		this.localStorageService.setItem(LOCAL_STORAGE.CONFIG, JSON.stringify(this.options));
		this.notify$.next(this.options);
	}
  changeLanguage(langCode: string): void {
    if (!this.supportedLangs.includes(langCode)) return;
    this._translateService.use(langCode);
    this.options.language = langCode;
    this.setOptions(this.options);
  }

  getUnits() {
    return this._requestService
      .list<Unit>(URI_PATH.CORE.UNITS.LIST, { search: { isActive: true } })
      .pipe(map((res) => res.data));
  }
}
