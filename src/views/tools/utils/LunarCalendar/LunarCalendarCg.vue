<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button @click="prevMonth">Prev</button>
      <span>{{ currentDate.format("MMMM YYYY") }}</span>
      <button @click="nextMonth">Next</button>
    </div>
    <div class="calendar-grid">
      <div class="calendar-day" v-for="day in daysInMonth" :key="day.date()">
        <div class="gregorian-day">
          {{ day.date() }}
        </div>
        <div class="lunar-day">
          {{ lunarDate(day) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import 'moment-lunar';

export default {
  data() {
    return {
      currentDate: moment(), // current month and year
    };
  },
  computed: {
    // Get all the days in the current month
    daysInMonth() {
      let startOfMonth = this.currentDate.clone().startOf('month');
      let endOfMonth = this.currentDate.clone().endOf('month');
      let days = [];
      
      while (startOfMonth <= endOfMonth) {
        days.push(startOfMonth.clone());
        startOfMonth.add(1, 'day');
      }
      
      return days;
    },
  },
  methods: {
    // Navigate to the previous month
    prevMonth() {
      this.currentDate.subtract(1, 'month');
    },
    // Navigate to the next month
    nextMonth() {
      this.currentDate.add(1, 'month');
    },
    // Get lunar date for a specific day
    lunarDate(day) {
      // Using moment-lunar to get the lunar date
      let lunar = day.lunar();
      return lunar ? `${lunar.month}${lunar.day}` : '';
    }
  },
};
</script>

<style scoped>
.calendar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  padding: 10px;
}

.calendar-day {
  text-align: center;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.gregorian-day {
  font-size: 16px;
  font-weight: bold;
}

.lunar-day {
  font-size: 12px;
  color: #888;
}
</style>
