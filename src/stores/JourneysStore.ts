import { makeAutoObservable, observable, action } from 'mobx';

// api
import { api } from 'config';

import { CreateJourney, Journey } from 'models';

class JourneysStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable journeys: Journey[] = [];

  @action async createJourney(dto: Partial<CreateJourney>) {
    const { data } = await api.post(`journeys?customerId=${dto.customerId}&boatId=${dto.boatId}&startDate=${dto.startDate}&endDate=${dto.endDate}`, {
      beginning: dto.beginning,
      destination: dto.destination,
      cargoType: dto.cargoType,
      weight: dto.weight,
    });

    this.journeys.push(data);
  }

  @action async getAllJourneys() {
    const { data } = await api.get('/journeys');

    this.journeys = [...data];

    return data;
  }

  @action async getJourneysInTransit() {
    const { data } = await api.get('/journeys/intransit');

    return data;
  }

  @action async updateJourney(id: number, dto: Partial<Journey>) {
    console.log('dto', dto);

    const { data } = await api.patch(`journeys?journeyId=${id}&customerId=${dto.customer?.id}&boatId=${dto.boat?.id}&startDate=${dto.startDate}&endDate=${dto.endDate}`, {
      beginning: dto.beginning,
      destination: dto.destination,
      cargoType: dto.cargoType,
      weight: dto.weight,
    });
  }

  @action async deleteJourney(id: number) {
    await api.delete(`/journeys?journeyId=${id}`);
  }
}

export default new JourneysStore();