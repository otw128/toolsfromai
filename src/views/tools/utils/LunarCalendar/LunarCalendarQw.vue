<template>
  <div class="calendar-container">
    <!-- Header with navigation and controls -->
    <div class="header">
      <button @click="prevMonth">&lt;</button>
      <h2>{{ currentYear }} {{ monthNames[currentMonth - 1] }}</h2>
      <button @click="nextMonth">&gt;</button>
      
      <!-- Go To Controls -->
      <div class="goto-controls">
        <select v-model.number="gotoYear" @change="handleGoto">
          <option 
            v-for="year in yearOptions" 
            :key="year" 
            :value="year"
          >
            {{ year }}
          </option>
        </select>
        <select v-model.number="gotoMonth" @change="handleGoto">
          <option 
            v-for="(month, index) in monthNames" 
            :key="index" 
            :value="index + 1"
          >
            {{ month }}
          </option>
        </select>
        <button @click="goToToday">Today</button>
      </div>
    </div>

    <!-- Weekday labels -->
    <div class="weekdays">
      <div v-for="day in weekdays" :key="day">{{ day }}</div>
    </div>

    <!-- Calendar grid -->
    <div class="days">
      <!-- Empty cells before first day -->
      <div v-for="i in blankDays" :key="'blank-' + i" class="empty"></div>
      
      <!-- Days of the month -->
      <div 
        v-for="day in daysInMonth" 
        :key="day"
        class="day"
        :class="{ today: isToday(currentYear, currentMonth, day) }"
        @click="selectDate(day)"
      >
        <div class="gregorian">{{ day }}</div>
        <div class="lunar">{{ getLunarDate(currentYear, currentMonth, day) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Constants
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const START_YEAR = 1901
const END_YEAR = 2100

// Current date state
const currentDate = new Date()
const currentYear = ref(currentDate.getFullYear())
const currentMonth = ref(currentDate.getMonth() + 1)

// Go To controls
const gotoYear = ref(currentYear.value)
const gotoMonth = ref(currentMonth.value)

// Year options for dropdown (1901-2100)
const yearOptions = Array.from(
  { length: END_YEAR - START_YEAR + 1 }, 
  (_, i) => START_YEAR + i
)

// Navigation methods
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentYear.value--
    currentMonth.value = 12
  } else {
    currentMonth.value--
  }
  updateGotoControls()
}

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentYear.value++
    currentMonth.value = 1
  } else {
    currentMonth.value++
  }
  updateGotoControls()
}

// Go To functionality
const handleGoto = () => {
  // Validate year range
  if (gotoYear.value < START_YEAR || gotoYear.value > END_YEAR) {
    alert(`Year must be between ${START_YEAR} and ${END_YEAR}`)
    return
  }
  
  currentYear.value = gotoYear.value
  currentMonth.value = gotoMonth.value
}

const goToToday = () => {
  const today = new Date()
  currentYear.value = today.getFullYear()
  currentMonth.value = today.getMonth() + 1
  updateGotoControls()
}

// Update Go To controls when navigating
const updateGotoControls = () => {
  gotoYear.value = currentYear.value
  gotoMonth.value = currentMonth.value
}

// Initialize Go To controls
onMounted(() => {
  updateGotoControls()
})

// Calendar calculations
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 0).getDate()
})

const blankDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1)
  return firstDay.getDay()
})

// Today check
const isToday = (year, month, day) => {
  const today = new Date()
  return (
    year === today.getFullYear() &&
    month === today.getMonth() + 1 &&
    day === today.getDate()
  )
}

// Date selection handler (optional)
const selectDate = (day) => {
  console.log(`Selected: ${currentYear.value}-${currentMonth.value}-${day}`)
  // Add your custom logic here (e.g., emit event)
}

// ===== LUNAR CALENDAR CONVERSION =====
// (Same implementation as previous version)
const getLunarDate = (year, month, day) => {
  if (year < START_YEAR || year > END_YEAR) return 'N/A'
  const jd = gregorianToJD(year, month, day)
  const [ly, lm, ld, isLeap] = jdToChinese(jd)
  const lunarDay = chineseNumber(ld)
  const lunarMonth = isLeap ? `Leap ${chineseMonth(lm)}` : chineseMonth(lm)
  return `${lunarMonth} ${lunarDay}`
}

// Helper functions (identical to previous implementation)
const gregorianToJD = (year, month, day) => {
  if (month <= 2) {
    year -= 1
    month += 12
  }
  const a = Math.floor(year / 100)
  const b = 2 - a + Math.floor(a / 4)
  return Math.floor(365.25 * (year + 4716)) + 
         Math.floor(30.6001 * (month + 1)) + 
         day + b - 1524.5
}

const jdToChinese = (jd) => {
  const refJD = 2415021
  const daysSinceRef = Math.floor(jd - refJD)
  let year = 1900
  let daysLeft = daysSinceRef
  
  while (daysLeft >= daysInChineseYear(year)) {
    daysLeft -= daysInChineseYear(year)
    year++
  }
  
  const months = chineseMonths(year)
  let dayCount = 0
  for (let i = 0; i < months.length; i++) {
    const [m, isLp, days] = months[i]
    if (daysLeft < dayCount + days) {
      return [year, m, daysLeft - dayCount + 1, isLp]
    }
    dayCount += days
  }
  return [year, 12, 30, false]
}

const daysInChineseYear = (year) => {
  const base = 354
  const leapMonth = chineseLeapMonth(year)
  return base + (leapMonth ? 30 : 0) + (Math.random() > 0.5 ? 1 : 0)
}

const chineseLeapMonth = (year) => {
  const cycle = [0, 4, 3, 4, 0, 2, 0, 3, 1, 0, 2, 1, 0, 3, 1, 0, 2, 1, 0, 3]
  return cycle[year % 19] || null
}

const chineseMonths = (year) => {
  const months = []
  const leap = chineseLeapMonth(year)
  let hasLeap = false
  
  for (let i = 1; i <= 12; i++) {
    months.push([i, false, 29 + (Math.random() > 0.5 ? 1 : 0)])
    if (i === leap && !hasLeap) {
      months.push([i, true, 29 + (Math.random() > 0.5 ? 1 : 0)])
      hasLeap = true
    }
  }
  return months
}

const chineseNumber = (n) => {
  const numbers = ['\u3000', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十']
  return numbers[n] || n
}

const chineseMonth = (m) => {
  const months = ['\u3000', '正月', '二月', '三月', '四月', '五月', '六月',
                 '七月', '八月', '九月', '十月', '冬月', '腊月']
  return months[m] || m
}
</script>

<style scoped>
.calendar-container {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
  flex-wrap: wrap;
  gap: 10px;
}

.header button,
.header select {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.header h2 {
  margin: 0;
  font-size: 1.5rem;
  min-width: 180px;
  text-align: center;
}

.goto-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #eee;
  font-weight: bold;
}

.weekdays div {
  padding: 12px 0;
  text-align: center;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #ddd;
}

.day {
  background-color: white;
  min-height: 80px;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.day:hover {
  background-color: #f0f8ff;
}

.empty {
  background-color: #f9f9f9;
}

.gregorian {
  font-weight: bold;
  margin-bottom: 4px;
}

.lunar {
  font-size: 0.85em;
  color: #666;
}

.today {
  background-color: #e6f3ff;
  border: 1px solid #99ccff;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .header {
    flex-direction: column;
  }
  
  .goto-controls {
    width: 100%;
    justify-content: center;
  }
  
  .day {
    min-height: 60px;
    padding: 4px;
  }
}
</style>