<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div class="px-4 mt-4">
        <h1 class="text-4xl font-bold mb-2">Balance</h1>
        <div class="flex flex-row">
          <div class="stat text-center">
          <div class="stat-title">You own</div>
          <div class="stat-value text-red-700">€{{ data.debitBalance }}</div>
        </div>
        <div class="stat text-center">
          <div class="stat-title">You are owed</div>
          <div class="stat-value text-green-700">€{{ data.creditBalance }}</div>
        </div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <!-- head -->
          <thead>
            <tr>
              <th></th>
              <th>Description</th>
              <th class="hidden sm:table-cell">Date</th>
              <th>Total Cost</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            <!-- dynamic rows -->
            <tr v-for="(expense, index) in data.expenses" :key="index">
              <th>{{ index + 1 }}</th>
              <td>{{ expense.description }}</td>
              <td class="hidden sm:table-cell">{{ new Date(expense.date).toLocaleDateString() }}</td>
              <td >{{ expense.total_cost }}</td>
              <td :class="balanceColor(expense.balance)">{{ balanceText(expense.balance) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import { getBalance } from '../lib/api.js';

  export default {
    data() {
      return {
        loading: true,
        data: null,
      };
    },
    async created() {
      getBalance().then((data) => {
        this.data = data;
        console.log(data);
        this.loading = false;
      });
    },
    methods: {
      
    balanceColor(balance) {
      balance = balance.toString();
      if (balance.includes('Debit')) {
        return 'text-red-500';
      } else if (balance.includes('Credit')) {
        return 'text-green-500';
      } else {
        return 'text-gray-500';
      }
    },
    balanceText(balance) {
      balance = balance.toString();
      if (balance.includes('Debit') || balance.includes('Credit')) {
        return balance;
      } else {
        return 'Done';
      }
    }
  }
    
  };
  </script>