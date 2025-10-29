import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { catchError, Observable, throwError } from 'rxjs';
import { URI_PATH } from '../constant/path.contant';
import { AddressData } from '../types/address-data';

@Directive({
  selector: '[appCepValidator]',
  standalone: true,
})
export class CepValidatorDirective {
  @Output() addressDataFetched = new EventEmitter<AddressData>();
  @Output() cepInvalid = new EventEmitter<void>();

  constructor(private requestService: RequestService) {
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const cep = value.replace(/\D+/g, '');
    if (this.isValidCep(cep)) {
      this.fetchCepData(cep).subscribe({
        next: (response) => {
          this.addressDataFetched.emit(response);
        },
        error: (error) => {
          console.error(error);
          this.cepInvalid.emit();
        },
      });
    } else {
      this.cepInvalid.emit();
    }
  }

  isValidCep(cep: string): boolean {
    return /^[0-9]{8}$/.test(cep);
  }

  fetchCepData(cep: string): Observable<AddressData> {
    return this.requestService.get<AddressData>(
      `${URI_PATH.BRASIL_API.CEP}${cep}`,
      { api: 'BRASIL_API' })
      .pipe(
        catchError((error) => {
          this.cepInvalid.emit();
          return throwError(() => error);
        }),
      );
  }
}
