<template>
  <div class="calendar-wrapper">
    <div class="controls">
      <button @click="goToToday" class="btn-primary">Today</button>
      
      <div class="inputs-group">
        <input 
          type="number" 
          v-model.number="inputYear" 
          min="1901" 
          max="2100" 
          class="input-box year-input"
          placeholder="YYYY"
        >
        <span class="label">Year</span>

        <select v-model.number="inputMonth" class="input-box">
          <option v-for="m in 12" :key="m" :value="m">{{ m }}</option>
        </select>
        <span class="label">Month</span>

        <input 
          type="number" 
          v-model.number="inputDay" 
          min="1" 
          max="31" 
          class="input-box day-input"
          placeholder="DD"
        >
        <span class="label">Day</span>
        
        <button @click="handleGoTo" class="btn-go">Go</button>
      </div>
    </div>

    <div class="calendar-container">
      <div class="header">
        <button @click="changeMonth(-1)" class="nav-btn">&lt;</button>
        <div class="current-date-display">
          {{ viewYear }} / {{ String(viewMonth + 1).padStart(2, '0') }}
        </div>
        <button @click="changeMonth(1)" class="nav-btn">&gt;</button>
      </div>

      <div class="weekdays-grid">
        <div v-for="day in weekDays" :key="day" class="weekday-cell">
          {{ day }}
        </div>
      </div>

      <div class="days-grid">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="day-cell"
          :class="{
            'not-current-month': !day.isCurrentMonth,
            'is-today': day.isToday,
            'is-selected': day.isSelected
          }"
          @click="selectDate(day)"
        >
          <span class="gregorian-num">{{ day.dayNum }}</span>
          <span class="lunar-text" :class="{'is-term': day.isTerm}">
            {{ day.lunarText }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Solar } from 'lunar-javascript';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// --- State ---
const now = new Date();

// 1. View State (What calendar grid is currently showing)
const viewYear = ref(now.getFullYear());
const viewMonth = ref(now.getMonth()); // 0-11

// 2. Selection State (Which specific day is highlighted)
const selectedDate = ref(new Date(now.getFullYear(), now.getMonth(), now.getDate()));

// 3. Input State (Bound to the inputs)
const inputYear = ref(now.getFullYear());
const inputMonth = ref(now.getMonth() + 1); // 1-12 (Human readable)
const inputDay = ref(now.getDate());

// --- Helpers ---

// Check if a day matches the system "Today"
const isToday = (y, m, d) => {
  const t = new Date();
  return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
};

// Check if a day matches the user's "Selected" date
const isSelected = (y, m, d) => {
  if (!selectedDate.value) return false;
  return selectedDate.value.getFullYear() === y && 
         selectedDate.value.getMonth() === m && 
         selectedDate.value.getDate() === d;
};

// --- Core Logic ---

const calendarDays = computed(() => {
  const days = [];
  
  // Start of the grid calculation
  const firstDayOfMonth = new Date(viewYear.value, viewMonth.value, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); 
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(firstDayOfMonth.getDate() - startDayOfWeek);

  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const dateObj = new Date(startDate);
    dateObj.setDate(startDate.getDate() + i);

    const y = dateObj.getFullYear();
    const m = dateObj.getMonth();
    const d = dateObj.getDate();

    // Lunar Conversion
    const solar = Solar.fromYmd(y, m + 1, d);
    const lunar = solar.getLunar();
    
    let lunarStr = lunar.getDayInChinese();
    let isTerm = false;

    // Prioritize: Term (JieQi) > 1st Day of Month > Regular Day
    const jieQi = lunar.getJieQi();
    if (jieQi) {
      lunarStr = jieQi;
      isTerm = true;
    } else if (lunar.getDay() === 1) {
      lunarStr = lunar.getMonthInChinese() + '月';
    }

    days.push({
      dateObj: dateObj,
      dayNum: d,
      isCurrentMonth: m === viewMonth.value,
      isToday: isToday(y, m, d),
      isSelected: isSelected(y, m, d),
      lunarText: lunarStr,
      isTerm: isTerm
    });
  }
  return days;
});

// --- Actions ---

// 1. "Today" Button
const goToToday = () => {
  const t = new Date();
  // Update View
  viewYear.value = t.getFullYear();
  viewMonth.value = t.getMonth();
  
  // Update Selection
  selectedDate.value = t;

  // Update Inputs
  inputYear.value = t.getFullYear();
  inputMonth.value = t.getMonth() + 1;
  inputDay.value = t.getDate();
};

// 2. "Go" Button (Process Inputs)
const handleGoTo = () => {
  let y = parseInt(inputYear.value);
  let m = parseInt(inputMonth.value);
  let d = parseInt(inputDay.value);

  // Validation
  if (isNaN(y) || y < 1901) {
    alert("Year must be 1901 or later.");
    return;
  }
  if (isNaN(d) || d < 1) d = 1;

  // JS Date handles overflow (e.g., Feb 30 becomes Mar 2)
  // We subtract 1 from month because JS Date is 0-indexed
  const newDate = new Date(y, m - 1, d);

  // Sync View
  viewYear.value = newDate.getFullYear();
  viewMonth.value = newDate.getMonth();
  
  // Sync Selection
  selectedDate.value = newDate;

  // Sync inputs back (in case date rolled over, e.g. Feb 30 -> Mar 2)
  inputYear.value = newDate.getFullYear();
  inputMonth.value = newDate.getMonth() + 1;
  inputDay.value = newDate.getDate();
};

// 3. Clicking a grid cell
const selectDate = (day) => {
  // Update Selection
  selectedDate.value = day.dateObj;
  
  // Update Inputs to match click
  inputYear.value = day.dateObj.getFullYear();
  inputMonth.value = day.dateObj.getMonth() + 1;
  inputDay.value = day.dateObj.getDate();

  // If clicked a gray date (prev/next month), switch view to that month
  if (!day.isCurrentMonth) {
    viewYear.value = day.dateObj.getFullYear();
    viewMonth.value = day.dateObj.getMonth();
  }
};

// 4. Header arrows (< >)
const changeMonth = (step) => {
  let newMonth = viewMonth.value + step;
  let newYear = viewYear.value;

  if (newMonth > 11) {
    newMonth = 0;
    newYear++;
  } else if (newMonth < 0) {
    newMonth = 11;
    newYear--;
  }

  if (newYear < 1901) {
    alert("Limit reached (1901).");
    return;
  }

  viewMonth.value = newMonth;
  viewYear.value = newYear;
};
</script>

<style scoped>
.calendar-wrapper {
  max-width: 450px;
  margin: 20px auto;
  font-family: 'Segoe UI', sans-serif;
}

/* Control Panel Styles */
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  align-items: center;
  justify-content: center;
}

.inputs-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.input-box {
  padding: 4px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.year-input { width: 60px; }
.day-input { width: 45px; }

.label {
  font-size: 0.8rem;
  color: #666;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-go {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 5px;
}

/* Calendar Grid Styles */
.calendar-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  padding: 16px;
  background: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.current-date-display {
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
}

.nav-btn {
  background: white;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover { background: #f0f0f0; }

.weekdays-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
  text-align: center;
  font-weight: 600;
  color: #888;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid transparent;
}

.day-cell:hover { background-color: #f5f5f5; }

.gregorian-num { font-size: 1rem; font-weight: 500; }
.lunar-text { font-size: 0.75rem; color: #999; }
.lunar-text.is-term { color: #d35400; font-weight: bold; } /* Solar Terms color */

/* Visual States */
.not-current-month { opacity: 0.4; }

/* System Today (Small blue dot or underline usually, here blue text) */
.is-today .gregorian-num {
  color: #007bff;
  text-decoration: underline;
  font-weight: bold;
}

/* Selected State (The clicked/active day) */
.is-selected {
  background-color: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
}
.is-selected .lunar-text { color: #1890ff; }
</style>