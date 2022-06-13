import { Sailor } from 'models';

export interface Team {
  mechanics: number[];
  sailors: number[];
  captains: number[];
}

type BoatType = 'CARGO' | 'BARGE' | 'VESSEL';

export interface Boat extends CreateBoat {
  id: number;
  sailors: Sailor[];
}

export interface CreateBoat {
  name: string;
  boatType: BoatType;
}
