<template>
  <div class="lunar-calendar">
    <div class="calendar-header">
      <div class="header-controls">
        <button @click="prevMonth" class="nav-btn">&lt;</button>
        <h2 class="current-month">{{ formatDate(currentDate) }}</h2>
        <button @click="nextMonth" class="nav-btn">&gt;</button>
      </div>
      <div class="year-controls">
        <button @click="prevYear" class="nav-btn">&lt;&lt;</button>
        <button @click="goToToday" class="today-btn">今天</button>
        <button @click="nextYear" class="nav-btn">&gt;&gt;</button>
      </div>
    </div>
    
    <div class="calendar-weekdays">
      <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
    </div>
    
    <div class="calendar-grid">
      <div
        v-for="(day, index) in daysInMonth"
        :key="index"
        :class="[
          'calendar-day',
          { 'today': isToday(day.date), 'other-month': !day.isCurrentMonth, 'weekend': day.isWeekend }
        ]"
        @click="selectDay(day)"
      >
        <div class="solar-date">{{ day.day }}</div>
        <div class="lunar-date">{{ day.lunarDay }}</div>
        <div v-if="day.solarTerm" class="solar-term">{{ day.solarTerm }}</div>
        <div v-if="day.festival" class="festival">{{ day.festival }}</div>
        <div v-if="isToday(day.date)" class="today-indicator"></div>
      </div>
    </div>
    
    <div v-if="selectedDay" class="selected-info">
      <h3>选择日期详情</h3>
      <p><strong>公历：</strong>{{ selectedDay.date.toLocaleDateString('zh-CN') }}</p>
      <p><strong>农历：</strong>{{ selectedDay.lunarDate }}</p>
      <p v-if="selectedDay.solarTerm"><strong>节气：</strong>{{ selectedDay.solarTerm }}</p>
      <p v-if="selectedDay.festival"><strong>节日：</strong>{{ selectedDay.festival }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getLunarInfo, isToday as checkToday } from './lunarUtils';

// 当前显示的月份/年份
const currentDate = ref(new Date());

// 选择的日期
const selectedDay = ref(null);

// 星期显示
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

// 格式化日期显示
const formatDate = (date) => {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
};

// 导航到上个月
const prevMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentDate.value = newDate;
};

// 导航到下个月
const nextMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentDate.value = newDate;
};

// 导航到上一年
const prevYear = () => {
  const newDate = new Date(currentDate.value);
  newDate.setFullYear(newDate.getFullYear() - 1);
  currentDate.value = newDate;
};

// 导航到下一年
const nextYear = () => {
  const newDate = new Date(currentDate.value);
  newDate.setFullYear(newDate.getFullYear() + 1);
  currentDate.value = newDate;
};

// 跳转到今天
const goToToday = () => {
  currentDate.value = new Date();
  selectToday();
};

// 选择今天
const selectToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  
  const lunarInfo = getLunarInfo(year, month + 1, day);
  selectedDay.value = {
    date: today,
    day: day,
    lunarDay: lunarInfo.lunarDay,
    lunarDate: lunarInfo.lunarDate,
    solarTerm: lunarInfo.solarTerm,
    festival: lunarInfo.festival,
    isCurrentMonth: true
  };
};

// 选择日期
const selectDay = (day) => {
  selectedDay.value = { ...day };
};

// 判断是否为今天
const isToday = (date) => {
  return checkToday(date);
};

// 计算当前月份的所有天数
const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  // 当前月的第一天
  const firstDay = new Date(year, month, 1);
  // 当前月的最后一天
  const lastDay = new Date(year, month + 1, 0);
  // 当前月的天数
  const daysInMonth = lastDay.getDate();
  // 第一天是星期几 (0 = 星期日)
  const firstDayOfWeek = firstDay.getDay();
  
  const days = [];
  
  // 添加上个月的最后几天
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const date = new Date(year, month - 1, day);
    const lunarInfo = getLunarInfo(year, month, day);
    
    days.push({
      date,
      day,
      lunarDay: lunarInfo.lunarDay,
      lunarDate: lunarInfo.lunarDate,
      solarTerm: lunarInfo.solarTerm,
      festival: lunarInfo.festival,
      isCurrentMonth: false,
      isWeekend: date.getDay() === 0 || date.getDay() === 6
    });
  }
  
  // 添加当前月的所有天
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const lunarInfo = getLunarInfo(year, month + 1, i);
    
    days.push({
      date,
      day: i,
      lunarDay: lunarInfo.lunarDay,
      lunarDate: lunarInfo.lunarDate,
      solarTerm: lunarInfo.solarTerm,
      festival: lunarInfo.festival,
      isCurrentMonth: true,
      isWeekend: date.getDay() === 0 || date.getDay() === 6
    });
  }
  
  // 添加下个月的前几天，使日历总天数为42（6周）
  const totalDays = days.length;
  const nextMonthDays = 42 - totalDays;
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(year, month + 1, i);
    const lunarInfo = getLunarInfo(year, month + 2, i);
    
    days.push({
      date,
      day: i,
      lunarDay: lunarInfo.lunarDay,
      lunarDate: lunarInfo.lunarDate,
      solarTerm: lunarInfo.solarTerm,
      festival: lunarInfo.festival,
      isCurrentMonth: false,
      isWeekend: date.getDay() === 0 || date.getDay() === 6
    });
  }
  
  return days;
});

// 组件挂载时选择今天
onMounted(() => {
  selectToday();
});
</script>

<style scoped>
.lunar-calendar {
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calendar-header {
  background: linear-gradient(135deg, #4a6fa5, #2c3e50);
  color: white;
  padding: 20px;
  text-align: center;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.current-month {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 300;
  letter-spacing: 1px;
}

.year-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.nav-btn, .today-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.nav-btn:hover, .today-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.today-btn {
  background: #e74c3c;
  font-weight: 600;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f8f9fa;
  border-bottom: 1px solid #eaeaea;
}

.weekday {
  padding: 15px 0;
  text-align: center;
  font-weight: 600;
  color: #4a6fa5;
}

.weekday:nth-child(1), .weekday:nth-child(7) {
  color: #e74c3c;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #f0f0f0;
}

.calendar-day {
  background: white;
  min-height: 100px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.calendar-day:hover {
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.calendar-day.other-month {
  color: #aaa;
  background: #f9f9f9;
}

.calendar-day.today {
  background: #e8f4fd;
  border: 2px solid #4a6fa5;
}

.calendar-day.weekend:not(.other-month) {
  background: #fef8f0;
}

.solar-date {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.other-month .solar-date {
  color: #ccc;
}

.weekend:not(.other-month) .solar-date {
  color: #e74c3c;
}

.lunar-date {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 4px;
}

.other-month .lunar-date {
  color: #bbb;
}

.solar-term {
  font-size: 0.75rem;
  color: #e74c3c;
  font-weight: 600;
  margin-top: 4px;
}

.festival {
  font-size: 0.75rem;
  color: #2c7c46;
  font-weight: 600;
  margin-top: 2px;
}

.today-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  background: #e74c3c;
  border-radius: 50%;
}

.selected-info {
  background: #f8f9fa;
  padding: 20px;
  border-top: 1px solid #eaeaea;
  margin-top: 10px;
}

.selected-info h3 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 2px solid #4a6fa5;
  padding-bottom: 10px;
}

.selected-info p {
  margin: 8px 0;
  color: #555;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .calendar-day {
    min-height: 80px;
    padding: 8px 5px;
  }
  
  .solar-date {
    font-size: 1.2rem;
  }
  
  .lunar-date, .solar-term, .festival {
    font-size: 0.7rem;
  }
  
  .current-month {
    font-size: 1.5rem;
  }
}
</style>