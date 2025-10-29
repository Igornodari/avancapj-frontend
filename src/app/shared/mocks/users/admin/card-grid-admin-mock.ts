import { Admin, Unit, Status, User, Role, Permission } from 'src/app/shared/types';

// Mock Status
export const mockStatus: Status = {
  label: 'Ativo',
  style: 'success',
  name: 'active',
};

// Mock Unit
export const mockUnit: Unit = {
  id: 'unit-001',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-02T00:00:00Z',
  name: 'Unit Test',
  hotelCode: 123,
  address: '123 Test Street',
  isActive: true,
  zohoId: 'ZOHO-001',
  statusStyle: mockStatus,
  waPhoneNumber: '+5511999999999',
  closure: '22:00',
  opening: '08:00',
  regulationUrl: 'https://example.com/regulations',
  addressStreet: '123 Test Street',
  addressNumber: '101',
  addressCity: 'Test City',
  addressNeighborhood: 'Test Neighborhood',
  addressZipCode: '12345-678',
  addressState: 'Test State',
  latitude: 12.34,
  longitude: 56.78,
};

// Mock Permission
export const mockPermission: Permission = {
  active: true,
  id: 'permission-001',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-02T00:00:00Z',
  name: 'admin-access',
  label: 'Admin Access',
};

// Mock Role
export const mockRole: Role = {
  id: 'role-001',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-02T00:00:00Z',
  name: 'admin',
  label: 'Administrator',
  permissions: [mockPermission],
};

// Mock User
export const mockUser: User = {
	id: 'user1',
	isActive: true,
	role: {
		id: 'role1',
		name: 'Role 1',
		createdAt: '',
		updatedAt: '',
		label: '',
		permissions: [],
	},
	fullName: '',
	email: '',
	photoPath: '',
	photoUrl: '',
	firstName: '',
	lastName: '',
	profileId: '',
	createdAt: new Date(),
	updatedAt: new Date(),
	unit: {
		id: '',
		createdAt: '',
		updatedAt: '',
		name: '',
		hotelCode: 0,
		address: '',
		isActive: false,
		zohoId: '',
		statusStyle: {
			label: '',
			style: '',
			name: ''
		},
		waPhoneNumber: '',
		closure: '',
		opening: '',
		regulationUrl: '',
		addressStreet: '',
		addressNumber: undefined,
		addressCity: undefined,
		addressNeighborhood: undefined,
		addressZipCode: undefined,
		addressState: undefined,
		latitude: undefined,
		longitude: undefined
	}
};

// Mock Admin
export const mockAdmin: Admin = {
  id: 'admin-001',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-02T00:00:00Z',
  zohoId: 'ZOHO-ADMIN-001',
  status: true,
  firstName: 'John',
  lastName: 'Doe',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  cpf: '123.456.789-10',
  cellphone: '99999-9999',
  birthDate: '1990-01-01',
  gender: 'Male',
  addressCountry: 'Brazil',
  addressStreet: '456 Example St',
  addressNumber: '789',
  addressComplement: 'Apt 101',
  addressNeighborhood: 'Central',
  addressCity: 'Sample City',
  addressState: 'Sample State',
  addressZipCode: '12345-678',
  nationality: 'Brazilian',
  maritalStatus: 'Single',
  document: 'AB123456',
  unit: mockUnit,
  user: mockUser,
  photoUrl: 'https://example.com/photo.jpg',
  department: 'TI',
  position: 'Developer',
  departmentStyle: mockStatus,
};


