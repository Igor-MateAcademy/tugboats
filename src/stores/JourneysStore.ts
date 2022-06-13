import { makeAutoObservable, observable, action } from 'mobx';

// api
import { api } from 'config';

class JourneysStore {
  constructor() {
    makeAutoObservable(this);
  }
}

export default new JourneysStore();