import { makeAutoObservable, observable, action } from 'mobx';

// api
import { api } from 'config';

import { Boat, CreateBoat, Team } from 'models';

class BoatsStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable boats: Boat[] = [];

  @action async getBoats() {
    const { data } = await api.get('/boats');

    return data;
  }

  @action  async createBoat(dto: Partial<CreateBoat>, team: Team) {
    const request = Object.values(team).flat(1).map(id => `sailorId=${id}`).join('&');

    const { data } = await api.post(`/boats?${request}`, dto);

    this.boats.push(data);
  }
}

export default new BoatsStore();