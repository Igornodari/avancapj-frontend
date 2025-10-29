import { CheckList } from 'src/app/pages/occupation-map/occupancy/occupancy.type';
import { mockOccupancy } from '../occupancy/mock-occupancy';

export const mockCheckList: CheckList = {
	id: '12345',
	createdAt: new Date('2023-01-01T10:00:00Z'),
	updatedAt: new Date('2023-03-01T10:00:00Z'),
	isCompleted: false,
	type: 'Inspection',
	name: 'Test Checklist Item',
	updatedSystem: false,
	details: 'This is a mock checklist item used for testing purposes.',
	referenceName: 'Test Reference Name',
	referenceId: 'ref12345',
	occupancy: mockOccupancy,
};
