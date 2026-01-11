<template>
  <div class="container">
    <div class="header">
      <h1>{{ $t('loanCalculator') }}</h1>
      <button class="language-toggle" @click="toggleLanguage">
        {{ currentLanguage === 'en' ? '中文' : 'English' }}
      </button>
    </div>
    
    <div class="content">
      <div class="input-section">
        <h2 class="section-title">
          <span>📊</span> {{ $t('loanDetails') }}
        </h2>
        
        <div class="form-group">
          <label>{{ $t('loanAmount') }}</label>
          <div class="input-with-unit">
            <input 
              type="number" 
              v-model.number="loanAmount" 
              min="1000" 
              max="10000000"
              @input="updateFromInput"
            >
            <div class="unit">{{ currencySymbol }}</div>
          </div>
          <div class="slider-container">
            <input 
              type="range" 
              min="1000" 
              max="10000000" 
              step="1000"
              v-model.number="loanAmount"
              @input="updateFromSlider"
            >
          </div>
        </div>
        
        <div class="form-group">
          <label>{{ $t('interestRate') }} (%)</label>
          <div class="input-with-unit">
            <input 
              type="number" 
              v-model.number="interestRate" 
              min="0.1" 
              max="50"
              step="0.1"
              @input="updateFromInput"
            >
            <div class="unit">%</div>
          </div>
          <div class="slider-container">
            <input 
              type="range" 
              min="0.1" 
              max="50" 
              step="0.1"
              v-model.number="interestRate"
              @input="updateFromSlider"
            >
          </div>
        </div>
        
        <div class="form-group">
          <label>{{ $t('loanTerm') }} ({{ $t('years') }})</label>
          <div class="input-with-unit">
            <input 
              type="number" 
              v-model.number="loanTerm" 
              min="1" 
              max="30"
              @input="updateFromInput"
            >
            <div class="unit">{{ $t('years') }}</div>
          </div>
          <div class="slider-container">
            <input 
              type="range" 
              min="1" 
              max="30" 
              v-model.number="loanTerm"
              @input="updateFromSlider"
            >
          </div>
        </div>
      </div>
      
      <div class="result-section">
        <h2 class="section-title">
          <span>📈</span> {{ $t('results') }}
        </h2>
        
        <div class="result-card">
          <div class="result-item">
            <span class="result-label">{{ $t('monthlyPayment') }}:</span>
            <span class="result-value">{{ formatCurrency(monthlyPayment) }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">{{ $t('totalInterest') }}:</span>
            <span class="result-value">{{ formatCurrency(totalInterest) }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">{{ $t('totalPayment') }}:</span>
            <span class="result-value">{{ formatCurrency(totalPayment) }}</span>
          </div>
        </div>
        
        <div class="payment-schedule" v-if="showSchedule">
          <div class="schedule-header">
            <div>{{ $t('year') }}</div>
            <div>{{ $t('principal') }}</div>
            <div>{{ $t('interest') }}</div>
            <div>{{ $t('balance') }}</div>
          </div>
          <div 
            class="schedule-row" 
            v-for="(year, index) in paymentSchedule" 
            :key="index"
          >
            <div>{{ year.year }}</div>
            <div>{{ formatCurrency(year.principal) }}</div>
            <div>{{ formatCurrency(year.interest) }}</div>
            <div :class="{ highlight: year.balance <= 0 }">
              {{ formatCurrency(Math.max(0, year.balance)) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      {{ $t('footerText') }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Language state
const currentLanguage = ref('en')

// Translation object
const translations = {
  en: {
    loanCalculator: 'Loan Calculator',
    loanDetails: 'Loan Details',
    loanAmount: 'Loan Amount',
    interestRate: 'Annual Interest Rate',
    loanTerm: 'Loan Term',
    years: 'Years',
    results: 'Calculation Results',
    monthlyPayment: 'Monthly Payment',
    totalInterest: 'Total Interest',
    totalPayment: 'Total Payment',
    year: 'Year',
    principal: 'Principal',
    interest: 'Interest',
    balance: 'Balance',
    footerText: 'This calculator provides estimates only. Actual payments may vary.'
  },
  zh: {
    loanCalculator: '贷款计算器',
    loanDetails: '贷款详情',
    loanAmount: '贷款金额',
    interestRate: '年利率',
    loanTerm: '贷款期限',
    years: '年',
    results: '计算结果',
    monthlyPayment: '每月还款额',
    totalInterest: '总利息',
    totalPayment: '总还款额',
    year: '年份',
    principal: '本金',
    interest: '利息',
    balance: '余额',
    footerText: '此计算器仅提供估算。实际付款可能会有所不同。'
  }
}

// Reactive data
const loanAmount = ref(250000)
const interestRate = ref(4.5)
const loanTerm = ref(15)
const showSchedule = ref(true)

// Computed properties
const monthlyPayment = computed(() => {
  const principal = loanAmount.value
  const monthlyRate = interestRate.value / 100 / 12
  const numberOfPayments = loanTerm.value * 12
  
  if (monthlyRate === 0) {
    return principal / numberOfPayments
  }
  
  const payment = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / 
                 (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  return payment
})

const totalPayment = computed(() => {
  return monthlyPayment.value * loanTerm.value * 12
})

const totalInterest = computed(() => {
  return totalPayment.value - loanAmount.value
})

const paymentSchedule = computed(() => {
  const schedule = []
  let balance = loanAmount.value
  const monthlyRate = interestRate.value / 100 / 12
  const payment = monthlyPayment.value
  
  for (let year = 1; year <= loanTerm.value; year++) {
    let yearlyPrincipal = 0
    let yearlyInterest = 0
    
    for (let month = 0; month < 12; month++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = payment - interestPayment
      
      yearlyInterest += interestPayment
      yearlyPrincipal += principalPayment
      balance -= principalPayment
      
      if (balance <= 0) break
    }
    
    schedule.push({
      year,
      principal: yearlyPrincipal,
      interest: yearlyInterest,
      balance: Math.max(0, balance)
    })
    
    if (balance <= 0) break
  }
  
  return schedule
})

const currencySymbol = computed(() => {
  return currentLanguage.value === 'zh' ? '¥' : '$'
})

// Methods
const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'en' ? 'zh' : 'en'
}

const $t = (key) => {
  return translations[currentLanguage.value][key] || key
}

const formatCurrency = (value) => {
  if (currentLanguage.value === 'zh') {
    return `¥${value.toLocaleString('zh-CN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`
  }
  return `$${value.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`
}

const updateFromInput = () => {
  loanAmount.value = Math.min(Math.max(loanAmount.value, 1000), 10000000)
  interestRate.value = Math.min(Math.max(interestRate.value, 0.1), 50)
  loanTerm.value = Math.min(Math.max(loanTerm.value, 1), 30)
}

const updateFromSlider = () => {
  // Slider updates are already constrained by min/max
}
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background: linear-gradient(to right, #4b6cb7, #182848);
  color: white;
  padding: 25px;
  border-radius: 20px 20px 0 0;
  text-align: center;
  position: relative;
}

.header h1 {
  font-size: 2.2rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.language-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.language-toggle:hover {
  background: rgba(255, 255, 255, 0.3);
}

.content {
  display: flex;
  flex-wrap: wrap;
  padding: 30px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0 0 20px 20px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
}

.input-section {
  flex: 1;
  min-width: 300px;
  padding: 20px;
}

.result-section {
  flex: 1;
  min-width: 300px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.section-title {
  font-size: 1.4rem;
  margin-bottom: 25px;
  color: #2c3e50;
  padding-bottom: 10px;
  border-bottom: 2px solid #4b6cb7;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.05rem;
}

.input-with-unit {
  display: flex;
  align-items: center;
  border: 2px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.3s;
}

.input-with-unit:focus-within {
  border-color: #4b6cb7;
}

.input-with-unit input {
  flex: 1;
  padding: 14px;
  border: none;
  outline: none;
  font-size: 1.1rem;
}

.unit {
  background: #f0f5ff;
  padding: 0 15px;
  font-weight: 600;
  color: #4b6cb7;
}

.slider-container {
  margin-top: 10px;
}

input[type="range"] {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e0e0e0;
  outline: none;
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #4b6cb7;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.result-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  border: 1px solid #e0e6f5;
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px dashed #d0d8e8;
}

.result-item:last-child {
  border-bottom: none;
}

.result-label {
  font-weight: 600;
  color: #2c3e50;
}

.result-value {
  font-weight: 700;
  color: #4b6cb7;
  font-size: 1.2rem;
}

.payment-schedule {
  margin-top: 25px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

.schedule-header {
  background: #4b6cb7;
  color: white;
  padding: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  font-weight: 600;
}

.schedule-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
}

.schedule-row:last-child {
  border-bottom: none;
}

.schedule-row:nth-child(even) {
  background-color: #f9fbfd;
}

.highlight {
  color: #e74c3c;
  font-weight: 700;
}

.footer {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
  font-size: 0.9rem;
  background: #f8f9fa;
  border-radius: 0 0 20px 20px;
  margin-top: -20px;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }
  
  .header h1 {
    font-size: 1.8rem;
  }
}
</style>
