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

  @action async getFreeBoats() {
    const { data } = await api.get('/boats/free');

    return data;
  }

  @action  async createBoat(dto: Partial<CreateBoat>, team: Partial<Team>) {
    const request = Object.values(team).map(s => `sailorId=${s.id}`).join('&');

    const { data } = await api.post(`/boats?${request}`, dto);

    this.boats.push(data);
  }

  @action async updateBoat(id: number, dto: Partial<CreateBoat>, team: Partial<Team>) {
    const request = Object.values(team).map(s => `sailorId=${s.id}`).join('&');

    await api.patch(`/boats?boatId=${id}&${request}`, dto);
  }

  @action async deleteBoat(id: number) {
    await api.delete(`/boats?boatId=${id}`);
  }
}

export default new BoatsStore();