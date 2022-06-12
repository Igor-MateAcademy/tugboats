import { createContext, useContext } from 'react';
import { configure, observable } from 'mobx';

configure({ enforceActions: 'observed' });

class RootStore {
  
}

const rootStore = new RootStore();

export const StoreContext = createContext<RootStore>(rootStore);

export const useStore = (): RootStore => useContext(StoreContext);

export default new RootStore();