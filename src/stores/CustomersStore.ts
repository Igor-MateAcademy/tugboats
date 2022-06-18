import { makeAutoObservable, observable, action } from 'mobx';

import { Customer } from 'models';

// api
import { api } from 'config';
import { LargeNumberLike } from 'crypto';

class CustomersStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable customers: Customer[] = [];

  @action async createCustomer(dto: Partial<Customer>) {
    const { data } = await api.post('customers', dto);

    this.customers.push(data);
  }

  @action async updateCustomer(id: number, dto: Partial<Customer>) {
    await api.patch(`customers?customerId=${id}`, dto);
  }

  @action async getCustomers() {
    const { data } = await api.get('/customers');

    this.customers = data;

    return data;
  }

  @action async deleteCustomer(id: number) {
    await api.delete(`customers?customerId=${id}`);
  }
}

export default new CustomersStore();