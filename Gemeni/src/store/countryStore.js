import {create} from 'zustand';

const useCountryStore = create((set) => ({
  countries: [],
  setCountries: (c) => set({ countries: c }),
}));

export default useCountryStore;
