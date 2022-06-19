import { Customer, Boat } from 'models';

export interface Journey extends Omit<CreateJourney, "customerId" | "boatId"> {
  id: number;
  customer: Customer;
  boat: Boat;
}

export type CargoType = 'FURNITURE' | 'MATERIALS' | 'CARS';

export interface CreateJourney {
  customerId: number;
  boatId: number;
  startDate: string | moment.Moment;
  endDate: string | moment.Moment;
  beginning: string;
  destination: string;
  cargoType: CargoType;
  weight: number;
}
