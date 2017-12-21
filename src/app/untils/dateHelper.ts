export function getDaysInMonth(year, month) {
    console.log(year, month);
    month = parseInt(month, 10);
    var d = new Date(year, month + 1, 0);
    return d.getDate();
}
export function getMonthWeekday(date: Date) {
    console.log(date);
    date.setDate(1);
    return date.getDay();
}

export function getMonthDays(date: Date) {

    const daysArr = [[], [], [], [], [], []]; // 6*7的日历数组
    const currentWeekday = getMonthWeekday(date); //moment(date).date(1).weekday(); // 获取当月1日为星期几
    console.log(currentWeekday);
    const lastMonthDays = getDaysInMonth(date.getFullYear(), date.getMonth() - 1); // moment(date).subtract(1, 'month').daysInMonth(); // 获取上月天数
    console.log(lastMonthDays);
    console.log(date.getMonth());
    const currentMonthDays = getDaysInMonth(date.getFullYear(), date.getMonth());//moment(date).daysInMonth(); // 获取当月天数
    console.log(currentMonthDays);
    const getDay = day => (day <= lastMonthDays ? day :
        (day <= (lastMonthDays + currentMonthDays)) ?
            day - lastMonthDays : day - (lastMonthDays + currentMonthDays)); // 日期处理
    for (let i = 0; i < 7; i += 1) {
        let virtualDay = (lastMonthDays - currentWeekday) + i + 1;
        for (let j = 0; j < 6; j += 1) {
            daysArr[j][i] = getDay(virtualDay + (j * 7));
        }
    }
    console.table(daysArr);
    for (let i = 1; i <= 7; i += 1) {
        let virtualDay = (lastMonthDays - currentWeekday) + i + 1;
        for (let j = 0; j < 6; j += 1) {
            daysArr[j][i-1] = getDay(virtualDay + (j * 7));
        }
    }
    console.table(daysArr);
}