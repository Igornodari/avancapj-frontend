import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    imports: [MaterialModule],
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HomeComponent {}
