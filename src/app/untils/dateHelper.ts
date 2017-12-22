
export function getDaysInMonth(year, month) {
    month = parseInt(month, 10);
    var d = new Date(year, month + 1, 0);
    return d.getDate();
}
export function getMonthWeekday(date: Date) {
    date.setDate(1);
    return date.getDay();
}

export function getDateRangeDays(dateStart, dateEnd, mondayAsFrist: boolean = false, resultAsObjectArray: boolean = true) {
    let yearMonths = getYearAndMonth(dateStart, dateEnd);
    let results = getMonthDays(new Date(yearMonths[0].year, yearMonths[0].month - 1), mondayAsFrist, resultAsObjectArray);
    yearMonths.slice(1).forEach(item => {
        results = results.concat(getMonthDays(new Date(item.year, item.month - 1, 1), mondayAsFrist).slice(2));
    });
    return results;
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

export function getMonthDays(date: Date, mondayAsFrist: boolean = false, resultAsObjectArray: boolean = true) {
    // 6*7的日历数组
    const daysArr = [[], [], [], [], [], []];
    // 获取当月1日为星期几
    const currentWeekday = getMonthWeekday(date);
    // 获取上月天数
    const lastMonthDays = getDaysInMonth(date.getFullYear(), date.getMonth() - 1);
    // 获取当月天数
    const currentMonthDays = getDaysInMonth(date.getFullYear(), date.getMonth());
    // 日期处理

    const getDay = day => (day <= lastMonthDays ? day :
        (day <= (lastMonthDays + currentMonthDays)) ?
            day - lastMonthDays :
            day - (lastMonthDays + currentMonthDays));

    if (mondayAsFrist) {
        for (let i = 1; i <= 7; i += 1) {
            let virtualDay = (lastMonthDays - (currentWeekday == 0 ? 7 : currentWeekday)) + i + 1;
            for (let j = 0; j < 6; j += 1) {
                daysArr[j][i - 1] = getDay(virtualDay + (j * 7));
            }
        }
    } else {
        for (let i = 0; i < 7; i += 1) {
            let virtualDay = (lastMonthDays - (currentWeekday == 0 ? 7 : currentWeekday)) + i + 1;
            for (let j = 0; j < 6; j += 1) {
                daysArr[j][i] = getDay(virtualDay + (j * 7));
            }
        }
    }
    if (resultAsObjectArray)
        return convertToObject(date.getFullYear(), date.getMonth() + 1, daysArr, mondayAsFrist);
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