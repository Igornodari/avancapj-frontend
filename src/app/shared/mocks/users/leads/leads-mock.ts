import { Lead } from 'src/app/pages/users/leads/lead.type';
import { mockUnit, mockAdmin } from '../admin/card-grid-admin-mock';


export const mockLead: Lead = {
  visibilityIcon: null,
  shareIcon: null,
  id: '123',
  createdAt: '2024-03-10T12:00:00Z',
  updatedAt: '2024-03-10T12:00:00Z',
  firstName: 'John',
  lastName: 'Doe',
  fullName: 'John Doe',
  email: 'johndoe@example.com',
  cellphone: '123456789',
  zohoId: 'ZOHO123',
  zohoStatus: 'Active',
  leadSource: 'Referral',
  score: 85,
  status: 'Qualified',
  typology: 'Residential',
  category: 'Buyer',
  birthDate: new Date('1990-01-01'),
  nationality: 'USA',
  unit: mockUnit,
  admin: mockAdmin,
};
