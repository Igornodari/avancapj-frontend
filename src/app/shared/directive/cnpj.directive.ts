import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { catchError, Observable, throwError } from 'rxjs';
import { URI_PATH } from '../constant/path.contant';
import { CompanyData } from '../types';
import { cnpj } from 'cpf-cnpj-validator';

@Directive({
  standalone: true,
  selector: '[appCnpjValidator]',
})
export class CnpjValidatorDirective {
  @Output() companyDataFetched = new EventEmitter<CompanyData>();
  @Output() cnpjInvalid = new EventEmitter<void>();

  constructor(private requestService: RequestService) {
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const doc = value.replace(/\D+/g, '');
    if (cnpj.isValid(doc)) {
      this.fetchCnpjData(doc).subscribe({
        next: (response) => {
          this.companyDataFetched.emit(response);
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  fetchCnpjData(cnpj: string): Observable<CompanyData> {
    return this.requestService.get<CompanyData>(
      `${URI_PATH.BRASIL_API.CNPJ}${cnpj}`,
      { api: 'BRASIL_API' })
      .pipe(
        catchError((error) => {
          this.cnpjInvalid.emit();
          return throwError(() => error);
        }),
      );
  }
}
