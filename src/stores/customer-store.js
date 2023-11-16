import { defineStore } from "pinia";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customers: [],
    search: "",
  }),
  getters: {
    list() {
      return this.customers.filter((c) => {
        if (this.search.length === 0) return true;
        if (c.name && c.name.includes(this.search)) return true;
        if (c.number && c.number.includes(this.search)) return true;
        return false;
      });
    },
  },
  actions: {
    setCustomers(customers) {
      this.customers = customers;
    },
    setSearch(search) {
      this.search = search;
    },
  },
});
