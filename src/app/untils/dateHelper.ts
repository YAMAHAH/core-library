import { IOneDay, IWeekDays } from '../Models/IWeekDays';

export function getDaysInMonth(year, month) {
    month = parseInt(month, 10);
    let d = new Date(year, month + 1, 0);
    return { days: d.getDate(), year: d.getFullYear(), month: d.getMonth() + 1 };
}
export function getMonthWeekday(date: Date) {
    date.setDate(1);
    return date.getDay();
}

export function getDateRangeDays(dateStart, dateEnd, mondayAsFrist: boolean = false, resultAsObjectArray: boolean = true) {
    let yearMonths = getYearAndMonth(dateStart, dateEnd);
    let results: any = getMonthDays(new Date(yearMonths[0].year, yearMonths[0].month - 1), mondayAsFrist, resultAsObjectArray);
    let lastMonths = results;
    yearMonths.slice(1).forEach(item => {

        if (resultAsObjectArray) {
            let monthInDays: any[] = getMonthDays(new Date(item.year, item.month - 1, 1), mondayAsFrist, resultAsObjectArray);
            let isContainsDay = lastRowContainsLastMonth(lastMonths[5], 1);
            results = results.concat(monthInDays.slice((isContainsDay ? 1 : 2)));
            lastMonths = monthInDays;
        } else {
            let monthInDays: any = getMonthDays(new Date(item.year, item.month - 1, 1), mondayAsFrist, resultAsObjectArray);
            results = results.concat(monthInDays.slice(2));
        }
    });
    return results;
}
/**
 * 上个月的指定数据是否同时包含当前月和上个月的号
 * @param lastMonthWeekDay 上个月的数据
 * @param currentMonthDay  包含的天号数,比如1号,2号
 */
function lastRowContainsLastMonth(lastMonthWeekDay, currentMonthDay) {
    let weekDays: IOneDay[] = [];
    for (const key in lastMonthWeekDay) {
        if (weekDayNames.contains(key)) weekDays.push(lastMonthWeekDay[key]);
    }
    let containsDay = weekDays.some(i => i.day == currentMonthDay && !i.isCurrentMonth) &&
        weekDays.some(i => i.isCurrentMonth);
    return containsDay;
}
export function getYearAndMonth(start, end) {
    let result: { year: number, month: number }[] = [];
    let starts = start.split('-');
    let ends = end.split('-');
    let staYear = parseInt(starts[0]);
    let staMon = parseInt(starts[1]);
    let endYear = parseInt(ends[0]);
    let endMon = parseInt(ends[1]);
    while (staYear <= endYear) {
        if (staYear === endYear) {
            while (staMon <= endMon) {
                result.push({ year: staYear, month: staMon });
                staMon++;
            }
            staYear++;
        } else {
            if (staMon > 12) {
                staMon = 1;
                staYear++;
            }
            result.push({ year: staYear, month: staMon });
            staMon++;
        }
    }

    return result;
}
const weekDayNames = ['monday', 'tuesday', 'wednesday', 'thurday', 'friday', 'saturday', 'sunday'];
export function getMonthDays(date: Date, mondayAsFrist: boolean = false, resultAsObjectArray: boolean = true) {
    // 6*7的日历数组
    const daysArr = [[], [], [], [], [], []];
    const daysArra2: IWeekDays[] = [];
    // 获取当月1日为星期几
    const currentWeekday = getMonthWeekday(date);
    // 获取上月天数
    const lastDateInfo = getDaysInMonth(date.getFullYear(), date.getMonth() - 1);
    const lastMonthDays = lastDateInfo.days;
    // 获取当月天数
    const currentDateInfo = getDaysInMonth(date.getFullYear(), date.getMonth());
    const currentMonthDays = currentDateInfo.days;
    //获取下月天数
    const nextDateInfo = getDaysInMonth(date.getFullYear(), date.getMonth() + 1);
    // 日期处理
    ;
    const getDay = day => {
        if (day <= lastMonthDays) {
            return day;
        }
        else if (day <= (lastMonthDays + currentMonthDays)) {
            return day - lastMonthDays;
        } else {
            return day - (lastMonthDays + currentMonthDays);
        }
    }
    const getDay2 = day => {
        if (day <= lastMonthDays) {
            return {
                year: lastDateInfo.year,
                month: lastDateInfo.month,
                day: day,
                week: getWeekNumber(lastDateInfo.year, lastDateInfo.month, day),
                weekDay: -1,
                rem: null,
                selected: false,
                isCurrentMonth: false
            };
        }
        else if (day <= (lastMonthDays + currentMonthDays)) {
            return {
                year: currentDateInfo.year,
                month: currentDateInfo.month,
                day: day - lastMonthDays,
                week: getWeekNumber(currentDateInfo.year, currentDateInfo.month, day - lastMonthDays),
                weekDay: -1,
                rem: null,
                selected: false,
                isCurrentMonth: true
            };
        } else {
            return {
                year: nextDateInfo.year,
                month: nextDateInfo.month,
                day: day - (lastMonthDays + currentMonthDays),
                week: getWeekNumber(nextDateInfo.year, nextDateInfo.month, day - (lastMonthDays + currentMonthDays)),
                weekDay: -1,
                rem: null,
                selected: false,
                isCurrentMonth: false
            };
        }
    }
    if (resultAsObjectArray)
        for (let index = 0; index < 6; index++) {
            let weekData: IWeekDays = {
                monday: { year: 0, month: 0, day: 0, week: -1, weekDay: 1, selected: false },
                tuesday: { year: 0, month: 0, day: 0, week: -1, weekDay: 2, selected: false },
                wednesday: { year: 0, month: 0, day: 0, week: -1, weekDay: 3, selected: false },
                thurday: { year: 0, month: 0, day: 0, week: -1, weekDay: 4, selected: false },
                friday: { year: 0, month: 0, day: 0, week: -1, weekDay: 5, selected: false },
                saturday: { year: 0, month: 0, day: 0, week: -1, weekDay: 6, selected: false },
                sunday: { year: 0, month: 0, day: 0, week: -1, weekDay: 0, selected: false },
                select: { selected: false }
            };
            daysArra2.push(weekData);
        }

    if (mondayAsFrist) {
        for (let i = 1; i <= 7; i += 1) {
            let virtualDay = (lastMonthDays - (currentWeekday == 0 ? 7 : currentWeekday)) + i + 1;
            for (let j = 0; j < 6; j += 1) {
                if (!resultAsObjectArray)
                    daysArr[j][i - 1] = getDay(virtualDay + (j * 7));
                else {
                    let oneDay = getDay2(virtualDay + (j * 7));
                    oneDay.weekDay = i == 7 ? 0 : i;
                    daysArra2[j][weekDayNames[i - 1]] = oneDay;
                }
            }
        }
    } else {
        for (let i = 0; i < 7; i += 1) {
            let virtualDay = (lastMonthDays - (currentWeekday == 0 ? 7 : currentWeekday)) + i + 1;
            for (let j = 0; j < 6; j += 1) {
                if (!resultAsObjectArray)
                    daysArr[j][i] = getDay(virtualDay + (j * 7));
                else {
                    let index = (((i - 1) == -1) ? (i + 6) : (i - 1));
                    let oneDay = getDay2(virtualDay + (j * 7));
                    oneDay.weekDay = i;
                    daysArra2[j][weekDayNames[index]] = oneDay;
                }
            }
        }
    }
    if (resultAsObjectArray)
        return daysArra2; // convertToObject(date.getFullYear(), date.getMonth() + 1, daysArr, mondayAsFrist);
    else
        return daysArr;
}

function convertToObject(year, month, monthDays: number[][], mondayAsFirst: boolean = false) {
    let weekDays: any[] = [];
    monthDays.forEach(item => {
        let index = (mondayAsFirst ? 0 : 1);
        let data = {
            year: year,
            month: month,
            monday: item[0 + index],
            tuesday: item[1 + index],
            wednesday: item[2 + index],
            thurday: item[3 + index],
            friday: item[4 + index],
            saturday: item[5 + index],
            sunday: item[(6 + index) % 7]
        };
        weekDays.push(data);
    });
    return weekDays;
}

/**
 * 获取某年的某天是第几周
 * @param {Number} y
 * @param {Number} m
 * @param {Number} d
 * @returns {Number}
 */
export function getWeekNumber(y, m, d) {
    let now = new Date(y, m - 1, d),
        year = now.getFullYear(),
        month = now.getMonth(),
        days = now.getDate();
    //那一天是那一年中的第多少天
    for (let i = 0; i < month; i++) {
        days += getDaysInMonth(year, i).days;
    }

    //那一年第一天是星期几
    let yearFirstDay = new Date(year, 0, 1).getDay() || 7;

    let week = null;
    if (yearFirstDay == 1) {
        week = Math.ceil(days / yearFirstDay);
    } else {
        days -= (7 - yearFirstDay + 1);
        week = Math.ceil(days / 7) + 1;
    }

    return week;
}