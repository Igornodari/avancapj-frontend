import { Status } from '../../shared/types';

export const unitsStatus = {
	ACTIVE: 'Ativa',
	INACTIVE: 'Inativo',
};

export const statusStyles: Status[] = [
	{ label: 'ACTIVE', style: 'success', name: unitsStatus.ACTIVE },
	{ label: 'INACTIVE', style: 'warning', name: unitsStatus.INACTIVE },
];
