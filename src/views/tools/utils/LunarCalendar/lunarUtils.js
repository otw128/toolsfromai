/**
 * 农历工具类
 * 支持1901-2100年
 */

// 农历数据（1901-2100年）
// 每个数据为16进制，表示该年的闰月月份和每月天数
const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1901-1910
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1911-1920
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1921-1930
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1931-1940
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1941-1950
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1951-1960
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1961-1970
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1971-1980
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1981-1990
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, // 1991-2000
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2001-2010
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2011-2020
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2021-2030
  0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2031-2040
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2041-2050
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, // 2051-2060
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2061-2070
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2071-2080
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2081-2090
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, // 2091-2100
];

// 农历月份名称
const lunarMonthNames = [
  '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '冬月', '腊月'
];

// 农历日期名称
const lunarDayNames = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

// 节气名称
const solarTerms = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
  '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
  '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
];

// 传统节日
const traditionalFestivals = {
  '0101': '春节',
  '0115': '元宵节',
  '0505': '端午节',
  '0707': '七夕',
  '0715': '中元节',
  '0815': '中秋节',
  '0909': '重阳节',
  '1208': '腊八节',
  '1223': '小年',
  '0100': '除夕'
};

// 公历节日
const gregorianFestivals = {
  '0101': '元旦',
  '0214': '情人节',
  '0308': '妇女节',
  '0312': '植树节',
  '0401': '愚人节',
  '0501': '劳动节',
  '0504': '青年节',
  '0601': '儿童节',
  '0701': '建党节',
  '0801': '建军节',
  '0910': '教师节',
  '1001': '国庆节',
  '1031': '万圣节',
  '1224': '平安夜',
  '1225': '圣诞节'
};

/**
 * 获取农历年份信息
 * @param {number} year 公历年份
 * @returns {Object} 农历年份信息
 */
function getLunarYearInfo(year) {
  if (year < 1901 || year > 2100) {
    throw new Error('仅支持1901-2100年');
  }
  
  const lunarData = lunarInfo[year - 1901];
  const leapMonth = lunarData >> 12; // 闰月月份，0表示无闰月
  const monthData = lunarData & 0x0fff; // 月份数据
  
  // 将月份数据转换为二进制数组，表示每个月的天数（1大月30天，0小月29天）
  const monthDays = [];
  for (let i = 0; i < 12; i++) {
    monthDays.push((monthData >> (11 - i)) & 1);
  }
  
  return { leapMonth, monthDays };
}

/**
 * 获取农历日期
 * @param {number} year 公历年份
 * @param {number} month 公历月份 (1-12)
 * @param {number} day 公历日期
 * @returns {Object} 农历信息
 */
export function getLunarInfo(year, month, day) {
  // 将公历日期转换为农历
  const date = new Date(year, month - 1, day);
  const lunarDate = solarToLunar(date);
  
  // 获取节气
  const solarTerm = getSolarTerm(year, month, day);
  
  // 获取节日
  const festival = getFestival(year, month, day, lunarDate);
  
  return {
    lunarDay: lunarDate.dayName,
    lunarDate: `${lunarDate.year}年${lunarDate.monthName}${lunarDate.dayName}`,
    solarTerm,
    festival,
    isLeapMonth: lunarDate.isLeapMonth
  };
}

/**
 * 公历转农历
 * @param {Date} solarDate 公历日期
 * @returns {Object} 农历日期
 */
function solarToLunar(solarDate) {
  const year = solarDate.getFullYear();
  const month = solarDate.getMonth() + 1;
  const day = solarDate.getDate();
  
  // 简化计算：这里使用一个近似算法
  // 实际项目中应使用更精确的农历转换算法
  
  // 计算从1900年2月8日（春节）到当前日期的天数
  const baseDate = new Date(1900, 1, 8); // 1900年春节
  const currentDate = new Date(year, month - 1, day);
  const offsetDays = Math.floor((currentDate - baseDate) / (1000 * 60 * 60 * 24));
  
  // 简化计算农历年份
  let lunarYear = 1900;
  let days = offsetDays;
  
  while (days > 0) {
    const yearInfo = getLunarYearInfo(lunarYear);
    const yearDays = getLunarYearDays(lunarYear);
    
    if (days < yearDays) {
      break;
    }
    
    days -= yearDays;
    lunarYear++;
  }
  
  // 计算农历月份和日期
  const yearInfo = getLunarYearInfo(lunarYear);
  let lunarMonth = 1;
  let lunarDay = 1;
  let remainingDays = days;
  let isLeapMonth = false;
  
  for (let m = 0; m < 12; m++) {
    const monthDays = yearInfo.monthDays[m] ? 30 : 29;
    
    if (remainingDays < monthDays) {
      lunarMonth = m + 1;
      lunarDay = remainingDays + 1;
      break;
    }
    
    remainingDays -= monthDays;
    
    // 如果有闰月并且当前月份是闰月前一个月
    if (yearInfo.leapMonth > 0 && m + 1 === yearInfo.leapMonth) {
      const leapMonthDays = yearInfo.monthDays[m] ? 30 : 29; // 闰月天数同前一个月
      
      if (remainingDays < leapMonthDays) {
        lunarMonth = m + 1;
        lunarDay = remainingDays + 1;
        isLeapMonth = true;
        break;
      }
      
      remainingDays -= leapMonthDays;
    }
  }
  
  // 处理农历年显示
  const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  
  const stemIndex = (lunarYear - 4) % 10;
  const branchIndex = (lunarYear - 4) % 12;
  const zodiacIndex = (lunarYear - 4) % 12;
  
  const lunarYearName = `${heavenlyStems[stemIndex]}${earthlyBranches[branchIndex]}年(${zodiacAnimals[zodiacIndex]})`;
  
  return {
    year: lunarYearName,
    month: lunarMonth,
    monthName: lunarMonthNames[lunarMonth - 1],
    day: lunarDay,
    dayName: lunarDayNames[lunarDay - 1],
    isLeapMonth
  };
}

/**
 * 获取农历年的总天数
 * @param {number} year 农历年份
 * @returns {number} 天数
 */
function getLunarYearDays(year) {
  const yearInfo = getLunarYearInfo(year);
  let days = 0;
  
  for (let i = 0; i < 12; i++) {
    days += yearInfo.monthDays[i] ? 30 : 29;
  }
  
  // 如果有闰月，添加闰月天数
  if (yearInfo.leapMonth > 0) {
    const leapMonthIndex = yearInfo.leapMonth - 1;
    days += yearInfo.monthDays[leapMonthIndex] ? 30 : 29;
  }
  
  return days;
}

/**
 * 获取节气
 * @param {number} year 年
 * @param {number} month 月
 * @param {number} day 日
 * @returns {string|null} 节气名称
 */
function getSolarTerm(year, month, day) {
  // 简化的节气计算（实际应使用精确的天文计算）
  const solarTermTable = {
    '0105': '小寒', '0120': '大寒',
    '0203': '立春', '0218': '雨水',
    '0305': '惊蛰', '0320': '春分',
    '0404': '清明', '0420': '谷雨',
    '0505': '立夏', '0521': '小满',
    '0605': '芒种', '0621': '夏至',
    '0707': '小暑', '0722': '大暑',
    '0807': '立秋', '0823': '处暑',
    '0907': '白露', '0923': '秋分',
    '1008': '寒露', '1023': '霜降',
    '1107': '立冬', '1122': '小雪',
    '1207': '大雪', '1221': '冬至'
  };
  
  const key = `${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
  return solarTermTable[key] || null;
}

/**
 * 获取节日
 * @param {number} year 年
 * @param {number} month 月
 * @param {number} day 日
 * @param {Object} lunarDate 农历日期
 * @returns {string|null} 节日
 */
function getFestival(year, month, day, lunarDate) {
  // 公历节日
  const gregorianKey = `${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
  if (gregorianFestivals[gregorianKey]) {
    return gregorianFestivals[gregorianKey];
  }
  
  // 农历节日
  const lunarKey = `${lunarDate.month.toString().padStart(2, '0')}${lunarDate.day.toString().padStart(2, '0')}`;
  if (traditionalFestivals[lunarKey]) {
    return traditionalFestivals[lunarKey];
  }
  
  // 特殊处理除夕
  if (lunarDate.month === 12 && lunarDate.day === 30) {
    return '除夕';
  }
  
  return null;
}

/**
 * 检查是否为今天
 * @param {Date} date 日期
 * @returns {boolean}
 */
export function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}