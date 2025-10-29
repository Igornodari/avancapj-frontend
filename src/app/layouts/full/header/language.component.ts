import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { languages } from './header.data';

import { importBase } from 'src/app/shared/constant/import-base.constant';
import { CoreService } from 'src/app/services/core.service';

@Component({
    selector: 'app-language',
    imports: [MaterialModule, importBase],
    template: `
    <button [matMenuTriggerFor]="flags" mat-icon-button class="m-r-5">
      <img [src]="selectedLanguage.icon" class="rounded-circle object-cover icon-20" />
    </button>
    <mat-menu #flags="matMenu" class="cardWithShadow">
      @for (lang of languages; track lang) {
        <button mat-menu-item (click)="onLanguageChange(lang)">
          <div class="d-flex align-items-center">
            <img [src]="lang.icon" class="rounded-circle object-cover m-r-8 icon-20" />
            <span class="mat-subtitle-1 f-s-14">{{ lang.language | translate }}</span>
          </div>
        </button>
      }
    </mat-menu>
    `,
    encapsulation: ViewEncapsulation.None
})
export class LanguageComponent {
  public selectedLanguage: any;
  public languages: any[] = languages;

  constructor(private coreService: CoreService) {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    const currentLangCode = this.coreService.getOptions().language;
    this.selectedLanguage = this.languages.find(lang => lang.code === currentLangCode) || this.languages[0];
  }

  onLanguageChange(lang: any): void {
    this.coreService.changeLanguage(lang.code);
    this.selectedLanguage = lang;
  }
}
