import { makeAutoObservable, observable, action } from 'mobx';

// api
import { api } from 'config';

import { Sailor, CreateSailor } from 'models';
import { threadId } from 'worker_threads';

class SailorsStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable sailors: Sailor[] = [];

  @action async getSailors() {
    const { data } = await api.get('/sailors');

    this.sailors = data;

    return data;
  }

  @action async getFreeSailors() {
    const { data } = await api.get('/sailors/free');

    return data;
  }

  @action async createSailor(dto: Partial<CreateSailor>) {
    const { data } = await api.post('/sailors', dto);

    this.sailors.push(data);
  }

  @action async deleteSailor(id: number) {
    await api.delete(`/sailors?sailorId=${id}`);

    this.sailors = this.sailors.filter(s => s.id !== id);
  }

  @action async updateSailor(id: number, data: Partial<CreateSailor>) {
    await api.patch(`/sailors?sailorId=${id}`, data);
  }
}

export default new SailorsStore();
