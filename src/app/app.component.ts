import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	imports: [FormsModule, ReactiveFormsModule, RouterOutlet],
	templateUrl: './app.component.html',
})
export class AppComponent {
	title = 'Modernize Angular Admin Tempplate';

	constructor() {}
}
