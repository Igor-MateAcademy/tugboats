import { Sailor } from 'models';

export interface Team {
  mechanic: Sailor;
  sailor: Sailor;
  captain: Sailor;
}

type BoatType = 'CARGO' | 'BARGE' | 'VESSEL';

export interface Boat extends CreateBoat {
  id: number;
  sailors: Sailor[];
  busy: boolean;
}

export interface CreateBoat {
  name: string;
  boatType: BoatType;
}
