import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	inject,
	Input,
	Output,
	signal,
	ViewChild,
	ViewEncapsulation,
	WritableSignal,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {
	CalendarApi,
	CalendarOptions,
	DateSelectArg,
	EventApi,
	EventClickArg,
	EventInput,
} from '@fullcalendar/core';
import allLocales from '@fullcalendar/core/locales-all';

import { CalendarData } from '@fullcalendar/core/internal';
export type ActionDisplay = {
	action: string;
	view: {
		get calendar(): CalendarApi;
		get title(): string;
		get activeStart(): Date;
		get activeEnd(): Date;
		get currentStart(): Date;
		get currentEnd(): Date;
	};
};

@Component({
	selector: 'app-full-calendar',
	imports: [MatProgressSpinnerModule, FullCalendarModule],
	template: `
		<full-calendar
			#calendar
			[options]="calendarOptions()"
			[hidden]="!calendarVisible()"
			[eventSources]="events"
		></full-calendar>
	`,
	host: { ngSkipHydration: '' },
	encapsulation: ViewEncapsulation.None,
})
export class AppFullCalendarComponent implements AfterViewInit {
	private changeDetector = inject(ChangeDetectorRef);
	@ViewChild('calendar') calendarComponent: FullCalendarComponent;
	calendarVisible = signal(true);
	@Input() events: EventInput[];
	@Input() fetchEvents: (events: WritableSignal<CalendarOptions>) => void;
	@Output() onChangeDisplay = new EventEmitter<ActionDisplay>();
	@Input() options: CalendarOptions;
	calendarOptions = signal<CalendarOptions>({
		plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
		},
		initialView: 'dayGridMonth',
		weekends: true,
		editable: false,
		selectable: false,
		selectMirror: true,
		dayMaxEvents: true,
		locales: allLocales,
		locale: 'pt-br',
		customButtons: {
			prev: {
				click: this.handleButtonPrev.bind(this),
			},
			next: {
				click: this.handleButtonNext.bind(this),
			},
			today: {
				text: 'Hoje',
				click: this.handleButtonToday.bind(this),
			},
		},
	});
	currentEvents = signal<EventApi[]>([]);

	ngAfterViewInit(): void {
		this.update(this.options);
	}

	handleButtonNext(ev: MouseEvent, element: HTMLElement) {
		this.calendarComponent.getApi().next();
		this.onChangeDisplay.emit({
			action: 'next',
			view: this.calendarComponent.getApi().getCurrentData().viewApi,
		});
	}

	handleButtonPrev(ev: MouseEvent, element: HTMLElement) {
		this.calendarComponent.getApi().prev();
		this.onChangeDisplay.emit({
			action: 'prev',
			view: this.calendarComponent.getApi().getCurrentData().viewApi,
		});
	}
	handleButtonToday(ev: MouseEvent, element: HTMLElement) {
		this.calendarComponent.getApi().today();
		this.onChangeDisplay.emit({
			action: 'today',
			view: this.calendarComponent.getApi().getCurrentData().viewApi,
		});
	}
	get getApi() {
		return this.calendarComponent.getApi();
	}

	handleCalendarToggle() {
		this.calendarVisible.update(bool => !bool);
	}

	update(data: CalendarOptions) {
		this.calendarOptions.update(options => ({
			...options,
			...data,
		}));
	}

	handleEvents(events: EventApi[]) {
		this.currentEvents.set(events);
		this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
	}
}
