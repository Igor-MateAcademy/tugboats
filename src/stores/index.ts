import { createContext, useContext } from 'react';
import { configure, observable } from 'mobx';

import customersStore from './CustomersStore';
import boatsStore from './BoatsStore';
import sailorsStore from './SailorsStore';
import journeysStore from './JourneysStore';

configure({ enforceActions: 'observed' });

class RootStore {
  @observable sailorsStore = sailorsStore;
  @observable boatsStore = boatsStore;
  @observable customersStore = customersStore;
  @observable journeysStore = journeysStore;
}

const rootStore = new RootStore();

export const StoreContext = createContext<RootStore>(rootStore);

export const useStore = (): RootStore => useContext(StoreContext);

export default new RootStore();