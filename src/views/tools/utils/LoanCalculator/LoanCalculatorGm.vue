<template>
  <div class="calculator-container">
    <div class="calculator-card">
      <div class="header">
        <h1>Loan Calculator <span class="cn-text">贷款计算器</span></h1>
        <p>Estimate your monthly payments <span class="cn-text">估算您的月供</span></p>
      </div>

      <div class="method-toggle">
        <div 
          class="toggle-option" 
          :class="{ active: paymentMethod === 'equal_payment' }"
          @click="paymentMethod = 'equal_payment'"
        >
          <div class="title">Equal Repayment</div>
          <div class="subtitle">等额本息</div>
        </div>
        <div 
          class="toggle-option" 
          :class="{ active: paymentMethod === 'equal_principal' }"
          @click="paymentMethod = 'equal_principal'"
        >
          <div class="title">Equal Principal</div>
          <div class="subtitle">等额本金</div>
        </div>
      </div>

      <div class="input-section">
        
        <div class="input-group">
          <label>Loan Amount <span class="cn-label">贷款金额</span></label>
          <div class="input-wrapper">
            <span class="currency-symbol">$</span>
            <input 
              type="number" 
              v-model.number="loanAmount" 
              placeholder="e.g. 500000"
              min="0"
            />
          </div>
        </div>

        <div class="input-group">
          <label>Annual Interest Rate (%) <span class="cn-label">年利率 (%)</span></label>
          <div class="input-wrapper">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
            </span>
            <input 
              type="number" 
              v-model.number="interestRate" 
              placeholder="e.g. 4.5"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div class="input-group">
          <label>Loan Term (Years) <span class="cn-label">贷款期限 (年)</span></label>
          <div class="input-wrapper">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </span>
            <input 
              type="number" 
              v-model.number="loanTerm" 
              placeholder="e.g. 30"
              min="1"
              max="100"
            />
            <input type="range" v-model.number="loanTerm" min="1" max="50" class="range-slider" />
          </div>
        </div>
      </div>

      <div class="results-section">
        
        <div class="result-card primary">
          <div class="label">
            <span v-if="paymentMethod === 'equal_payment'">Monthly Payment <span class="cn-text-sm">每月月供</span></span>
            <span v-else>First Month Payment <span class="cn-text-sm">首月月供</span></span>
          </div>
          
          <div class="value">{{ formatCurrency(results.monthlyDisplay) }}</div>
          
          <div v-if="paymentMethod === 'equal_principal'" class="sub-info">
            Decreases by <strong>{{ formatCurrency(results.monthlyDecrease) }}</strong> / month
            <span class="cn-text-xs">(每月递减)</span>
          </div>
        </div>

        <div class="secondary-results">
          <div class="result-row">
            <div class="label">Total Interest <span class="cn-text-sm">总利息</span></div>
            <div class="value">{{ formatCurrency(results.totalInterest) }}</div>
          </div>
          <div class="result-row">
            <div class="label">Total Payment <span class="cn-text-sm">还款总额</span></div>
            <div class="value">{{ formatCurrency(results.totalPayment) }}</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// --- State ---
const loanAmount = ref(100000);   
const interestRate = ref(4.5);    
const loanTerm = ref(30);         
const paymentMethod = ref('equal_payment'); // 'equal_payment' (Equal P&I) or 'equal_principal' (Equal Principal)

// --- Calculations ---
const results = computed(() => {
  const P = Number(loanAmount.value) || 0;
  const r = (Number(interestRate.value) || 0) / 100 / 12; // Monthly rate
  const n = (Number(loanTerm.value) || 0) * 12; // Total months

  if (P <= 0 || n <= 0) {
    return { monthlyDisplay: 0, totalPayment: 0, totalInterest: 0, monthlyDecrease: 0 };
  }

  // Common: 0% Interest Case
  if (r === 0) {
    const monthly = P / n;
    return {
      monthlyDisplay: monthly,
      totalPayment: P,
      totalInterest: 0,
      monthlyDecrease: 0
    };
  }

  if (paymentMethod.value === 'equal_payment') {
    // METHOD 1: Equal Repayment (Average Capital plus Interest) - 等额本息
    // Formula: P * [ r(1+r)^n ] / [ (1+r)^n - 1 ]
    const x = Math.pow(1 + r, n);
    const monthly = (P * x * r) / (x - 1);
    const total = monthly * n;
    
    return {
      monthlyDisplay: monthly,
      totalPayment: total,
      totalInterest: total - P,
      monthlyDecrease: 0
    };

  } else {
    // METHOD 2: Equal Principal (Average Capital) - 等额本金
    // Monthly Principal = P / n
    // Monthly Interest = (P - Capital Repaid so far) * r
    // First Month Payment = (P / n) + (P * r)
    
    const monthlyPrincipal = P / n;
    const firstMonthPayment = monthlyPrincipal + (P * r);
    
    // Total Interest Formula for Equal Principal: (n+1) * P * r / 2
    const totalInterest = ((n + 1) * P * r) / 2;
    const totalPayment = P + totalInterest;

    // Calculate monthly decrease amount: Monthly Principal * r
    const monthlyDecrease = monthlyPrincipal * r;

    return {
      monthlyDisplay: firstMonthPayment,
      totalPayment: totalPayment,
      totalInterest: totalInterest,
      monthlyDecrease: monthlyDecrease
    };
  }
});

// --- Utilities ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};
</script>

<style scoped>
/* --- Core Variables --- */
:root {
  --primary-color: #4f46e5;
  --bg-color: #f3f4f6;
  --card-bg: #ffffff;
  --text-main: #1f2937;
  --text-light: #6b7280;
  --border-color: #e5e7eb;
}

.calculator-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: var(--bg-color);
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--text-main);
}

.calculator-card {
  background: var(--card-bg);
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* --- Header --- */
.header { text-align: center; margin-bottom: 1.5rem; }
.header h1 { font-size: 1.5rem; margin: 0; color: #111827; }
.header p { margin-top: 0.5rem; color: #6b7280; font-size: 0.9rem; }
.cn-text { font-weight: normal; font-size: 0.9em; margin-left: 8px; opacity: 0.8; }
.cn-label { color: #6b7280; font-size: 0.85em; margin-left: 6px; font-weight: normal; }
.cn-text-sm { font-size: 0.8em; margin-left: 5px; opacity: 0.7; }
.cn-text-xs { font-size: 0.75em; margin-left: 5px; opacity: 0.7; font-weight: normal; }

/* --- Method Toggle --- */
.method-toggle {
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 2rem;
  gap: 4px;
}

.toggle-option {
  flex: 1;
  text-align: center;
  padding: 10px 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.toggle-option:hover {
  background: rgba(255,255,255, 0.5);
}

.toggle-option.active {
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-color: #e2e8f0;
}

.toggle-option .title {
  font-weight: 600;
  font-size: 0.9rem;
  color: #4b5563;
}

.toggle-option.active .title {
  color: #4f46e5;
}

.toggle-option .subtitle {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 2px;
}

/* --- Inputs --- */
.input-section { display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2rem; }
.input-group label { display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.5rem; }

.input-wrapper { position: relative; display: flex; align-items: center; flex-wrap: wrap; }
.input-wrapper input[type="number"] {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.2s;
}
.input-wrapper input[type="number"]:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.currency-symbol, .icon {
  position: absolute;
  left: 12px;
  top: 13px;
  color: #9ca3af;
}

.range-slider { width: 100%; margin-top: 10px; accent-color: #4f46e5; cursor: pointer; }

/* --- Results --- */
.results-section {
  background-color: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.result-card.primary {
  text-align: center;
  padding-bottom: 1.25rem;
  border-bottom: 1px dashed #cbd5e1;
  margin-bottom: 1.25rem;
}

.result-card.primary .label { font-size: 0.9rem; color: #64748b; font-weight: 500; margin-bottom: 0.5rem; }
.result-card.primary .value { font-size: 2.25rem; font-weight: 800; color: #4f46e5; line-height: 1.1; }

.sub-info {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #ef4444; /* Red for decrease warning */
  background: #fef2f2;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
}

.secondary-results { display: flex; flex-direction: column; gap: 0.75rem; }
.result-row { display: flex; justify-content: space-between; align-items: center; }
.result-row .label { font-size: 0.9rem; color: #475569; }
.result-row .value { font-weight: 600; color: #1e293b; }

@media (max-width: 480px) {
  .calculator-card { padding: 1.5rem; }
  .result-card.primary .value { font-size: 1.75rem; }
}
</style>