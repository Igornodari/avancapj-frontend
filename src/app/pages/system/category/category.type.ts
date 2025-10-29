export type Category = {
	id: string;
	code: string;
	name: string;
	userDefined: string;
	defaultDescription: string;
	group?: CategoryGroup;
	value?: string;
	isActive: boolean;
	category?: Category[];
};

export type CategoryGroup = {
	id: string;
	createdAt: string;
	updatedAt: string;
	code: string;
	name: string;
	isActive: boolean;
	description: string;
	tool: string;
	category?: Category[];
};

export enum CategoryToolEnum {
	MAINTENANCE = 'maintenance',
	INVOICE = 'invoice',
	TICKET = 'ticket',
	FINES = 'fines',
	DDD = 'ddd',
	TYPOLOGY = 'typology',
	PURCHASE_ORDER = 'purchase_order',
	OCCUPANCY = 'occupancy',
	SALES_MIRROR = 'sales_mirror',
	SUBSCRIPTION = 'subscription',
	APARTMENT = 'apartment',
	REPORTS = 'reports',
	INVOICES_INITIAL = 'invoices_initial',
	OCCUPANCY_CHECKLIST = 'occupancy_checklist',
}
