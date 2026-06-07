export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  personalId: string;
}

export interface Advisor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  personalId: string;
}

export interface Contract {
  id: string;
  registrationNumber: string;
  institution: string;
  clientId: string;
  managerId: string;
  participantIds: string[];
  signedAt: string;
  validFrom: string;
  validUntil: string | null;
}
