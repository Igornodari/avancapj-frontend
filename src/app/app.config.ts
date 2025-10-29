import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { InterceptorsModule } from './interceptors/interceptors.module';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';
import localePtBrExtra from '@angular/common/locales/extra/pt';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {
	MomentDateAdapter,
	MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { AppTranslateLoader } from './shared/helpers/translate-loader.helper';
registerLocaleData(localePtBr, 'pt-BR', localePtBrExtra);

export const HttpLoaderFactory = (http: HttpClient) => {
	return new AppTranslateLoader(http, {
		prefix: './assets/i18n/',
		parts: [
			'common',
			'occupancy-map',
			'communication',
			'enums',
			'facilities',
			'finance',
			'header',
			'home',
			'interactions',
			'login',
			'negotiations',
			'reports',
			'sidebar',
			'system',
		],
	});
};

export const MY_FORMATS = {
	parse: {
		dateInput: 'DD/MM/YYYY',
	},
	display: {
		dateInput: 'DD/MM/YYYY',
		monthYearLabel: 'MMM YYYY',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'MMMM YYYY',
	},
};
const provideTranslation = () => ({
	loader: {
		provide: TranslateLoader,
		useFactory: HttpLoaderFactory,
		deps: [HttpClient],
	},
});

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideAnimations(),
		provideFirebaseApp(() => initializeApp(environment.firebase)),
		provideFirestore(() => getFirestore()),
		provideMessaging(() => getMessaging()),
		provideStorage(() => getStorage()),
		provideAuth(() => getAuth()),
		provideAnalytics(() => getAnalytics()),
		importProvidersFrom([InterceptorsModule, TranslateModule.forRoot(provideTranslation())]),
		{
			provide: LOCALE_ID,
			useValue: 'pt-BR',
		},
		{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
		},
		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	],
};

export interface AppSettings {
	theme: string;
	sidenavOpened: boolean;
	sidenavCollapsed: boolean;
	boxed: boolean;
	activeTheme: string;
	language: string;
	cardBorder: boolean;
	navPos: 'side' | 'top';
}

export const defaults: AppSettings = {
	theme: 'light',
	sidenavOpened: true,
	sidenavCollapsed: false,
	boxed: false,
	cardBorder: false,
	activeTheme: 'orange_theme',
	language: 'pt',
	navPos: 'side',
};
