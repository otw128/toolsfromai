<template>
  <div class="loan-calculator">
    <div class="calculator-header">
      <h1>{{ texts.title[language] }}</h1>
      <p>{{ texts.subtitle[language] }}</p>
    </div>
    
    <div class="calculator-content">
      <div class="input-section">
        <div class="section-title">
          <span>📊</span>
          <h3>{{ texts.inputTitle[language] }}</h3>
        </div>
        
        <div class="input-group">
          <div class="input-label">
            <span>{{ texts.loanAmount[language] }}</span>
            <span>{{ formatCurrency(loanAmount) }}</span>
          </div>
          <div class="input-wrapper">
            <span>💰</span>
            <input 
              type="range" 
              v-model="loanAmount" 
              min="1000" 
              max="1000000" 
              step="1000"
              @input="calculateLoan"
            >
          </div>
          <div class="value-display">
            <input 
              type="number" 
              v-model.number="loanAmount" 
              min="1000" 
              max="1000000" 
              step="1000"
              @input="calculateLoan"
            >
            <span class="currency-unit">{{ texts.currency[language] }}</span>
          </div>
        </div>
        
        <div class="input-group">
          <div class="input-label">
            <span>{{ texts.loanTerm[language] }}</span>
            <span>{{ loanTerm }} {{ texts.years[language] }}</span>
          </div>
          <div class="input-wrapper">
            <span>📅</span>
            <input 
              type="range" 
              v-model="loanTerm" 
              min="1" 
              max="30" 
              step="1"
              @input="calculateLoan"
            >
          </div>
          <div class="value-display">
            <input 
              type="number" 
              v-model.number="loanTerm" 
              min="1" 
              max="30" 
              step="1"
              @input="calculateLoan"
            >
            <span class="currency-unit">{{ texts.years[language] }}</span>
          </div>
        </div>
        
        <div class="input-group">
          <div class="input-label">
            <span>{{ texts.interestRate[language] }}</span>
            <span>{{ interestRate }}%</span>
          </div>
          <div class="input-wrapper">
            <span>📈</span>
            <input 
              type="range" 
              v-model="interestRate" 
              min="1" 
              max="20" 
              step="0.1"
              @input="calculateLoan"
            >
          </div>
          <div class="value-display">
            <input 
              type="number" 
              v-model.number="interestRate" 
              min="1" 
              max="20" 
              step="0.1"
              @input="calculateLoan"
            >
            <span class="currency-unit">%</span>
          </div>
        </div>
        
        <div class="buttons">
          <button class="calculate-btn" @click="calculateLoan">
            <span>🧮</span>
            {{ texts.calculate[language] }}
          </button>
          <button class="reset-btn" @click="resetForm">
            <span>🔄</span>
            {{ texts.reset[language] }}
          </button>
        </div>
      </div>
      
      <div class="result-section">
        <div class="section-title">
          <span>📈</span>
          <h3>{{ texts.resultTitle[language] }}</h3>
        </div>
        
        <div class="result-item">
          <div class="result-label">
            <span>{{ texts.monthlyPayment[language] }}</span>
            <span>{{ texts.perMonth[language] }}</span>
          </div>
          <div class="result-value">{{ formatCurrency(monthlyPayment) }}</div>
          <div class="result-note">{{ texts.monthlyPaymentNote[language] }}</div>
        </div>
        
        <div class="result-item">
          <div class="result-label">
            <span>{{ texts.totalInterest[language] }}</span>
            <span>{{ texts.total[language] }}</span>
          </div>
          <div class="result-value">{{ formatCurrency(totalInterest) }}</div>
          <div class="result-note">{{ texts.totalInterestNote[language] }}</div>
        </div>
        
        <div class="result-item">
          <div class="result-label">
            <span>{{ texts.totalPayment[language] }}</span>
            <span>{{ texts.total[language] }}</span>
          </div>
          <div class="result-value">{{ formatCurrency(totalPayment) }}</div>
          <div class="result-note">{{ texts.totalPaymentNote[language] }}</div>
        </div>
        
        <div class="summary">
          <div class="summary-item">
            <span>{{ texts.loanAmount[language] }}</span>
            <span>{{ formatCurrency(loanAmount) }}</span>
          </div>
          <div class="summary-item">
            <span>{{ texts.loanTerm[language] }}</span>
            <span>{{ loanTerm }} {{ texts.years[language] }}</span>
          </div>
          <div class="summary-item">
            <span>{{ texts.interestRate[language] }}</span>
            <span>{{ interestRate }}%</span>
          </div>
          <div class="summary-item">
            <span>{{ texts.totalCost[language] }}</span>
            <span>{{ formatCurrency(totalPayment) }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="language-toggle">
      <button @click="toggleLanguage">
        <span>🌐</span>
        {{ language === 'en' ? '切换到中文' : 'Switch to English' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Language state
const language = ref('en')

// Bilingual text content
const texts = {
  title: {
    en: 'Loan Calculator',
    cn: '贷款计算器'
  },
  subtitle: {
    en: 'Calculate your loan payments and interest',
    cn: '计算您的贷款还款和利息'
  },
  inputTitle: {
    en: 'Loan Details',
    cn: '贷款详情'
  },
  resultTitle: {
    en: 'Payment Results',
    cn: '还款结果'
  },
  loanAmount: {
    en: 'Loan Amount',
    cn: '贷款金额'
  },
  loanTerm: {
    en: 'Loan Term',
    cn: '贷款期限'
  },
  interestRate: {
    en: 'Annual Interest Rate',
    cn: '年利率'
  },
  monthlyPayment: {
    en: 'Monthly Payment',
    cn: '每月还款'
  },
  totalInterest: {
    en: 'Total Interest',
    cn: '总利息'
  },
  totalPayment: {
    en: 'Total Payment',
    cn: '总还款额'
  },
  totalCost: {
    en: 'Total Cost',
    cn: '总成本'
  },
  calculate: {
    en: 'Calculate',
    cn: '计算'
  },
  reset: {
    en: 'Reset',
    cn: '重置'
  },
  currency: {
    en: 'USD',
    cn: '元'
  },
  years: {
    en: 'years',
    cn: '年'
  },
  perMonth: {
    en: 'per month',
    cn: '每月'
  },
  total: {
    en: 'total',
    cn: '总计'
  },
  monthlyPaymentNote: {
    en: 'Amount to pay each month',
    cn: '每月需要支付的金额'
  },
  totalInterestNote: {
    en: 'Total interest over loan term',
    cn: '贷款期限内总利息'
  },
  totalPaymentNote: {
    en: 'Principal + Total Interest',
    cn: '本金 + 总利息'
  }
}

// Loan data
const loanAmount = ref(250000)
const loanTerm = ref(20)
const interestRate = ref(5.5)

// Calculation results
const monthlyPayment = ref(0)
const totalInterest = ref(0)
const totalPayment = ref(0)

// Format currency
const formatCurrency = (value) => {
  if (language.value === 'en') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  } else {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
}

// Calculate loan function
const calculateLoan = () => {
  const principal = loanAmount.value
  const annualRate = interestRate.value / 100
  const monthlyRate = annualRate / 12
  const numberOfPayments = loanTerm.value * 12
  
  // Calculate monthly payment using the formula: P * r * (1+r)^n / ((1+r)^n - 1)
  if (monthlyRate > 0) {
    const comp = Math.pow(1 + monthlyRate, numberOfPayments)
    monthlyPayment.value = principal * monthlyRate * comp / (comp - 1)
  } else {
    // If interest rate is 0%
    monthlyPayment.value = principal / numberOfPayments
  }
  
  // Calculate total payment and total interest
  totalPayment.value = monthlyPayment.value * numberOfPayments
  totalInterest.value = totalPayment.value - principal
  
  // Round to 2 decimal places
  monthlyPayment.value = Math.round(monthlyPayment.value * 100) / 100
  totalInterest.value = Math.round(totalInterest.value * 100) / 100
  totalPayment.value = Math.round(totalPayment.value * 100) / 100
}

// Reset form
const resetForm = () => {
  loanAmount.value = 250000
  loanTerm.value = 20
  interestRate.value = 5.5
  calculateLoan()
}

// Toggle language
const toggleLanguage = () => {
  language.value = language.value === 'en' ? 'cn' : 'en'
}

// Calculate on component mount
onMounted(() => {
  calculateLoan()
})
</script>

<style scoped>
.loan-calculator {
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  overflow: hidden;
  transition: all 0.3s ease;
}

.calculator-header {
  background: linear-gradient(90deg, #4a6fa5 0%, #3a5a8c 100%);
  color: white;
  padding: 30px;
  text-align: center;
}

.calculator-header h1 {
  font-size: 2.5rem;
  margin-bottom: 8px;
  font-weight: 700;
}

.calculator-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.calculator-content {
  display: flex;
  flex-wrap: wrap;
}

.input-section {
  flex: 1;
  min-width: 300px;
  padding: 35px;
  background: #f9fafc;
}

.result-section {
  flex: 1;
  min-width: 300px;
  padding: 35px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  color: #2c3e50;
  font-size: 1.4rem;
  gap: 10px;
}

.input-group {
  margin-bottom: 25px;
}

.input-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 600;
  color: #34495e;
}

.input-label span:last-child {
  font-weight: normal;
  font-size: 0.9rem;
  opacity: 0.7;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-wrapper span {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
}

input[type="number"], input[type="range"] {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid #e1e8f0;
  border-radius: 10px;
  font-size: 1.1rem;
  transition: all 0.3s;
  background: white;
}

input[type="number"]:focus, input[type="range"]:focus {
  outline: none;
  border-color: #4a6fa5;
  box-shadow: 0 0 0 3px rgba(74, 111, 165, 0.1);
}

.value-display {
  margin-top: 8px;
  font-weight: 600;
  color: #4a6fa5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.value-display input {
  flex: 1;
}

.currency-unit {
  color: #7f8c8d;
  font-weight: normal;
  min-width: 40px;
}

.buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

button {
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.calculate-btn {
  background: linear-gradient(90deg, #4a6fa5 0%, #3a5a8c 100%);
  color: white;
}

.calculate-btn:hover {
  background: linear-gradient(90deg, #3a5a8c 0%, #2a4a7c 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(58, 90, 140, 0.2);
}

.reset-btn {
  background: #f1f5f9;
  color: #4a6fa5;
  border: 2px solid #e1e8f0;
}

.reset-btn:hover {
  background: #e1e8f0;
  transform: translateY(-2px);
}

.result-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 20px;
  border-left: 5px solid #4a6fa5;
  transition: transform 0.3s;
}

.result-item:hover {
  transform: translateX(5px);
}

.result-label {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}

.result-value {
  font-size: 2.2rem;
  font-weight: 800;
  color: #2c3e50;
}

.result-note {
  font-size: 0.9rem;
  color: #94a3b8;
  margin-top: 5px;
}

.summary {
  background: #f0f7ff;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e1e8f0;
}

.summary-item:last-child {
  border-bottom: none;
  font-weight: 700;
  color: #2c3e50;
}

.language-toggle {
  text-align: center;
  padding: 20px;
  background: #f9fafc;
  border-top: 1px solid #e1e8f0;
}

.language-toggle button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 2px solid #e1e8f0;
  border-radius: 50px;
  font-weight: 600;
  color: #4a6fa5;
  cursor: pointer;
  transition: all 0.3s;
}

.language-toggle button:hover {
  background: #4a6fa5;
  color: white;
  border-color: #4a6fa5;
}

@media (max-width: 768px) {
  .calculator-content {
    flex-direction: column;
  }
  
  .calculator-header h1 {
    font-size: 2rem;
  }
  
  .input-section, .result-section {
    padding: 25px;
  }
}
</style>
