import { makeAutoObservable, observable, action } from 'mobx';

// api
import { api } from 'config';

class CustomersStore {
  constructor() {
    makeAutoObservable(this);
  }
}

export default new CustomersStore();