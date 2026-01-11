<template>
  <div class="loan-calculator">
    <h1>{{ title }}</h1>
    <div class="form-group">
      <label for="amount">{{ amountLabel }}</label>
      <input type="number" v-model="amount" placeholder="Enter loan amount" />
    </div>

    <div class="form-group">
      <label for="rate">{{ rateLabel }}</label>
      <input type="number" v-model="rate" placeholder="Enter interest rate (%)" />
    </div>

    <div class="form-group">
      <label for="years">{{ yearsLabel }}</label>
      <input type="number" v-model="years" placeholder="Enter loan term (years)" />
    </div>

    <button @click="calculateLoan">{{ calculateBtnLabel }}</button>

    <div v-if="monthlyPayment">
      <h2>{{ resultLabel }}</h2>
      <p>{{ monthlyPaymentLabel }}: {{ monthlyPayment | currency }}</p>
      <p>{{ totalPaymentLabel }}: {{ totalPayment | currency }}</p>
      <p>{{ totalInterestLabel }}: {{ totalInterest | currency }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      amount: 0,
      rate: 0,
      years: 0,
      monthlyPayment: null,
      totalPayment: null,
      totalInterest: null,
      title: 'Loan Calculator 贷款计算器',
      amountLabel: 'Loan Amount 贷款金额',
      rateLabel: 'Interest Rate 利率 (%)',
      yearsLabel: 'Loan Term (years) 贷款年限',
      calculateBtnLabel: 'Calculate 计算',
      resultLabel: 'Results 结果',
      monthlyPaymentLabel: 'Monthly Payment 每月付款',
      totalPaymentLabel: 'Total Payment 总付款',
      totalInterestLabel: 'Total Interest 总利息',
    };
  },
  methods: {
    calculateLoan() {
      const principal = parseFloat(this.amount);
      const calculatedRate = parseFloat(this.rate) / 100 / 12;
      const calculatedYears = parseFloat(this.years) * 12;

      if (isNaN(principal) || isNaN(calculatedRate) || isNaN(calculatedYears) || principal <= 0 || calculatedRate <= 0 || calculatedYears <= 0) {
        alert('Please enter valid numbers!');
        return;
      }

      const x = Math.pow(1 + calculatedRate, calculatedYears);
      const monthly = (principal * calculatedRate * x) / (x - 1);
      const totalPayment = monthly * calculatedYears;
      const totalInterest = totalPayment - principal;

      this.monthlyPayment = monthly.toFixed(2);
      this.totalPayment = totalPayment.toFixed(2);
      this.totalInterest = totalInterest.toFixed(2);
    },
  },
};
</script>

<style scoped>
.loan-calculator {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background-color: #f4f6f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 1.8em;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  font-size: 1.1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}

h2 {
  font-size: 1.6em;
  color: #333;
  margin-top: 20px;
}

p {
  font-size: 1.2em;
  color: #555;
}

p strong {
  font-weight: bold;
}

.currency {
  font-size: 1.3em;
  color: #333;
}
</style>
