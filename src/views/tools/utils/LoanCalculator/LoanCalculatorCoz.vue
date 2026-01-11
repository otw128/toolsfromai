<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          Loan Calculator / 贷款计算器
        </h1>
        <p class="text-gray-600">
          Calculate your monthly payments easily / 轻松计算您的月供
        </p>
      </div>

      <!-- Calculator Card -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Form Section -->
        <div class="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h2 class="text-2xl font-semibold mb-6">
            Loan Details / 贷款信息
          </h2>

          <div class="space-y-6">
            <!-- Loan Amount -->
            <div>
              <label class="block text-sm font-medium mb-2">
                Loan Amount / 贷款金额
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70">
                  $
                </span>
                <input
                  v-model.number="loanAmount"
                  type="number"
                  min="0"
                  step="1000"
                  class="w-full pl-8 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  placeholder="Enter loan amount"
                >
              </div>
            </div>

            <!-- Interest Rate -->
            <div>
              <label class="block text-sm font-medium mb-2">
                Annual Interest Rate / 年利率
              </label>
              <div class="relative">
                <input
                  v-model.number="interestRate"
                  type="number"
                  min="0"
                  step="0.1"
                  class="w-full pl-4 pr-12 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                  placeholder="Enter interest rate"
                >
                <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70">
                  %
                </span>
              </div>
            </div>

            <!-- Loan Term -->
            <div>
              <label class="block text-sm font-medium mb-2">
                Loan Term / 贷款期限
              </label>
              <div class="grid grid-cols-2 gap-4">
                <div class="relative">
                  <input
                    v-model.number="loanTerm"
                    type="number"
                    min="1"
                    class="w-full pl-4 pr-16 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                    placeholder="Enter term"
                  >
                  <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70">
                    {{ termUnit === 'years' ? 'Years / 年' : 'Months / 月' }}
                  </span>
                </div>
                <select
                  v-model="termUnit"
                  class="px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                >
                  <option value="years">Years / 年</option>
                  <option value="months">Months / 月</option>
                </select>
              </div>
            </div>

            <!-- Calculate Button -->
            <button
              @click="calculate"
              class="w-full py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              Calculate / 计算
            </button>
          </div>
        </div>

        <!-- Results Section -->
        <div v-if="showResults" class="p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">
            Calculation Results / 计算结果
          </h2>

          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <!-- Monthly Payment -->
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <p class="text-blue-100 text-sm mb-1">
                Monthly Payment / 月供
              </p>
              <p class="text-3xl font-bold">
                ${{ monthlyPayment.toFixed(2) }}
              </p>
            </div>

            <!-- Total Payment -->
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <p class="text-purple-100 text-sm mb-1">
                Total Payment / 总还款
              </p>
              <p class="text-3xl font-bold">
                ${{ totalPayment.toFixed(2) }}
              </p>
            </div>

            <!-- Total Interest -->
            <div class="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
              <p class="text-pink-100 text-sm mb-1">
                Total Interest / 总利息
              </p>
              <p class="text-3xl font-bold">
                ${{ totalInterest.toFixed(2) }}
              </p>
            </div>
          </div>

          <!-- Progress Chart -->
          <div class="mb-8 bg-gray-50 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">
              Payment Breakdown / 还款构成
            </h3>
            <div class="relative">
              <div class="h-8 bg-gray-200 rounded-full overflow-hidden flex">
                <div
                  class="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                  :style="{ width: `${(principal / totalPayment) * 100}%` }"
                ></div>
                <div
                  class="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
                  :style="{ width: `${(totalInterest / totalPayment) * 100}%` }"
                ></div>
              </div>
            </div>
            <div class="flex justify-center gap-8 mt-4">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
                <span class="text-sm text-gray-600">Principal / 本金 ({{ ((principal / totalPayment) * 100).toFixed(1) }}%)</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded"></div>
                <span class="text-sm text-gray-600">Interest / 利息 ({{ ((totalInterest / totalPayment) * 100).toFixed(1) }}%)</span>
              </div>
            </div>
          </div>

          <!-- Payment Schedule Toggle -->
          <div class="mb-4">
            <button
              @click="showSchedule = !showSchedule"
              class="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <span class="transform transition-transform" :class="{ 'rotate-180': showSchedule }">
                ▼
              </span>
              <span>
                {{ showSchedule ? 'Hide' : 'Show' }} Payment Schedule / {{ showSchedule ? '隐藏' : '显示' }}还款计划
              </span>
            </button>
          </div>

          <!-- Payment Schedule Table -->
          <div v-show="showSchedule" class="overflow-hidden rounded-xl border border-gray-200">
            <table class="w-full text-sm">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-gray-600 font-semibold">
                    # / 期数
                  </th>
                  <th class="px-4 py-3 text-right text-gray-600 font-semibold">
                    Payment / 还款额
                  </th>
                  <th class="px-4 py-3 text-right text-gray-600 font-semibold">
                    Principal / 本金
                  </th>
                  <th class="px-4 py-3 text-right text-gray-600 font-semibold">
                    Interest / 利息
                  </th>
                  <th class="px-4 py-3 text-right text-gray-600 font-semibold">
                    Balance / 余额
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(payment, index) in paymentSchedule"
                  :key="index"
                  class="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  :class="{ 'bg-blue-50': index === 0 }"
                >
                  <td class="px-4 py-3 text-gray-700 font-medium">{{ payment.period }}</td>
                  <td class="px-4 py-3 text-right text-gray-700">
                    ${{ payment.payment.toFixed(2) }}
                  </td>
                  <td class="px-4 py-3 text-right text-green-600">
                    ${{ payment.principal.toFixed(2) }}
                  </td>
                  <td class="px-4 py-3 text-right text-purple-600">
                    ${{ payment.interest.toFixed(2) }}
                  </td>
                  <td class="px-4 py-3 text-right text-gray-700">
                    ${{ payment.balance.toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-12 text-center">
          <div class="text-6xl mb-4">💰</div>
          <p class="text-gray-500 text-lg">
            Enter loan details and click Calculate to see results / 输入贷款信息并点击计算查看结果
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 text-gray-500 text-sm">
        <p>
          Results are estimates only. Contact your lender for accurate figures / 结果仅供参考，请联系贷款机构获取准确数据
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const loanAmount = ref(100000)
const interestRate = ref(5.5)
const loanTerm = ref(30)
const termUnit = ref('years')
const showResults = ref(false)
const showSchedule = ref(false)
const monthlyPayment = ref(0)
const totalPayment = ref(0)
const totalInterest = ref(0)
const principal = ref(0)
const paymentSchedule = ref([])

const calculate = () => {
  // Validate inputs
  if (!loanAmount.value || !interestRate.value || !loanTerm.value) {
    alert('Please fill in all fields / 请填写所有字段')
    return
  }

  // Convert term to months if in years
  const months = termUnit.value === 'years' ? loanTerm.value * 12 : loanTerm.value
  const monthlyRate = interestRate.value / 100 / 12

  // Calculate monthly payment using standard amortization formula
  if (monthlyRate === 0) {
    monthlyPayment.value = loanAmount.value / months
  } else {
    monthlyPayment.value = loanAmount.value * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
  }

  // Calculate totals
  totalPayment.value = monthlyPayment.value * months
  totalInterest.value = totalPayment.value - loanAmount.value
  principal.value = loanAmount.value

  // Generate payment schedule
  const schedule = []
  let balance = loanAmount.value

  for (let i = 1; i <= months; i++) {
    const interestPayment = balance * monthlyRate
    const principalPayment = monthlyPayment.value - interestPayment
    balance -= principalPayment

    schedule.push({
      period: i,
      payment: monthlyPayment.value,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance)
    })
  }

  paymentSchedule.value = schedule
  showResults.value = true
  showSchedule.value = true
}
</script>

<style scoped>
/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Smooth animations */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* Number input styling */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Focus visible for accessibility */
input:focus-visible,
select:focus-visible,
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
