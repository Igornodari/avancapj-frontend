import { Injectable, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ScrollEventService {
	private scrollSubject = new Subject<void>();
	private scrollDirectionSubject = new Subject<'up' | 'down'>();
	private parentContentRef?: ElementRef<HTMLElement>;

	scroll$ = this.scrollSubject.asObservable();
	scrollDirection = this.scrollDirectionSubject.asObservable();

	emitScrollEvent(): void {
		this.scrollSubject.next();
	}

	emitScrollDirectionEvent(direction: 'up' | 'down'): void {
		this.scrollDirectionSubject.next(direction);
	}

	setParentContentRef(contentRef: ElementRef<HTMLElement>): void {
		if (!contentRef) {
			return;
		}
		this.parentContentRef = contentRef;
	}

	getParentContent(): HTMLElement | null {
		if (!this.parentContentRef) {
			return null;
		}
		return this.parentContentRef.nativeElement;
	}
}
