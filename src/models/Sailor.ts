export type SailorType = 'CAPTAIN' | 'MECHANIC' | 'SAILOR';

export interface Sailor extends CreateSailor {
  id: number;
}

export interface CreateSailor {
  firstName: string;
  lastName: string;
  sailorType: SailorType;
}