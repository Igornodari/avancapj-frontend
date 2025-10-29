import { Component } from '@angular/core';
import { map, switchMap, takeUntil } from 'rxjs';
import { URI_PATH } from 'src/app/shared/constant/path.contant';
import { Permission, Role } from 'src/app/shared/types';
import BaseComponent from 'src/app/components/base.component';
import { importBase } from 'src/app/shared/constant/import-base.constant';
import { iconMap } from 'src/app/shared/helpers/iconMap.helper';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-grid-permissions',
    imports: [...importBase],
    templateUrl: './grid-permissions.component.html',
    styleUrls: ['./grid-permissions.component.scss']
})
export class GridPermissionsComponent extends BaseComponent {
	public iconMap = iconMap;
	public roles: Role[] = [];
	public allPermissions: Array<{ category: string; permissions: Permission[] }> = [];
	public rolePermissions: { [key: string]: Permission[] } = {};
	public activeTabId: number = 0;

	constructor(private _snackBar: SnackBarService) {
		super();

		this.loadRolesAndPermission();
		this.loadPermissions();
	}

	async loadPermissions() {
		return this.requestService
			.list<{ category: string; permissions: Permission[] }>(URI_PATH.CORE.ACL.PERMISSIONS_GROUP, {
				params: { paginate: false },
			})
			.pipe(map(res => res.data))
			.subscribe({ next: permissions => (this.allPermissions = permissions) });
	}

	loadRolesAndPermission() {
		this.requestService
			.list<Role>(URI_PATH.CORE.ACL.ROLES, { relations: { permissions: true } })
			.pipe(
				map(res => res.data),
				takeUntil(this.unsubscribe$)
			)
			.subscribe({
				next: roles => (this.roles = roles),
				error: err => this.onLoadError(err),
			});
	}

	onLoadError(err: any) {
		this.loading = false;
	}

	getIcon(id: string): string {
		return this.iconMap[id] || 'help_outline';
	}

	onTabChanged(event: any) {
		this.activeTabId = event.index;
		this.roles[event.index].permissions;
		this.markActivePermissions(this.roles[event.index].permissions);
	}

	get activeRole() {
		return this.roles[this.activeTabId as any];
	}

	markActivePermissions(rolesPermissions: { id: string; name: string; label: string }[]) {
		this.allPermissions.forEach(group => {
			group.permissions.forEach(permission => {
				const permissionExists = rolesPermissions.some(rolePerm => rolePerm.id === permission.id);

				if (permissionExists) {
					permission.active = true;
				} else {
					permission.active = false;
				}
			});
		});

		return this.allPermissions;
	}

	updatePermission(permission: Permission, $event: MatSlideToggleChange) {

		if ($event.checked) {
			this.activeRole.permissions.push(permission);
		} else {
			this.activeRole.permissions = this.activeRole.permissions.filter(p => p.id != permission.id);
		}

		this.requestService
			.update(URI_PATH.CORE.ACL.ROLES, this.activeRole.id, this.activeRole)
			.subscribe({
				next: () => this._snackBar.success('Permissões salvas com sucesso!!'),
				error: err =>
					console.error(
						`Failed to update permissions for role ${permission.id}`,
						this._snackBar.error('Erro ao salvar permissões.'),
						err
					),
			});
	}
}
