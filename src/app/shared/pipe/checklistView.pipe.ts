import { Pipe, PipeTransform } from '@angular/core';
import { CheckList } from 'src/app/pages/occupation-map/occupancy/occupancy.type';

type ChecklistView = { label: string; done: boolean; order: number };

@Pipe({ name: 'checklistView', standalone: true, pure: true })
export class ChecklistViewPipe implements PipeTransform {
	private strip = (s: string) => s?.replace(/^\d+\s*-\s*/, '') ?? '';
	private orderOf(s: string) {
		const m = s?.match(/^(\d+)/);
		return m ? Number(m[1]) : 9999;
	}

	transform(list: CheckList[] | null | undefined): ChecklistView[] {
		return (list ?? [])
			.map(c => ({ label: this.strip(c.name), done: !!c.isCompleted, order: this.orderOf(c.name) }))
			.sort((a, b) => a.order - b.order);
	}
}
