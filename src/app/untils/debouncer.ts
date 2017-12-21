export interface Debouncer {
    debounce(callback: Function): void;
    cancel(): void;
}

export class TimeoutDebouncer implements Debouncer {
    private timer: number = null;
    callback: Function;

    constructor(public wait: number) { }

    debounce(callback: Function) {
        this.callback = callback;
        this.schedule();
    }

    schedule() {
        this.cancel();
        if (this.wait <= 0) {
            this.callback();
        } else {
            this.timer = setTimeout(this.callback, this.wait);
        }
    }

    cancel() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        var date = new Date();
        date.setDate(1);
        var weekday = new Array(7);
        weekday[0] = "星期日";
        weekday[1] = "星期一";
        weekday[2] = "星期二";
        weekday[3] = "星期三";
        weekday[4] = "星期四";
        weekday[5] = "星期五";
        weekday[6] = "星期六";
        alert("本月第一天是 " + weekday[date.getDay()]);
        date.setMonth(date.getMonth() + 1);
        var lastDate = new Date(date - 3600000 * 24);
        alert("本月最后一天是 " + lastDate.getDate());
    }


    private getLastMonthDays() {
        var now = new Date;
        now.setMonth(now.getMonth() - 1);
        now.setDate(1);
        var next = new Date;
        next.setDate(1);
        var arr = [];
        while (now < next) {
            arr.push(now.getDate());
            now.setDate(now.getDate() + 1);
        }
        return arr;
    }
    getMonthDays(year, month) {
        var d = new Date(year, month, 0);
        return d.getDate();
    }
    GetCurrentMonthDays() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var d = new Date(year, month, 0);
        return d.getDate();
    }
    getDaysInMonth(year, month) {
        month = parseInt(month, 10);
        var d = new Date(year, month, 0);
        return d.getDate();
    }
    private getMonthWeekday(date: Date) {
        date.setDate(1);
        return date.getDay();
    }

    monthDay(date: Date) {

        const daysArr = [[], [], [], [], [], []]; // 6*7的日历数组
        const currentWeekday = this.getMonthWeekday(date); //moment(date).date(1).weekday(); // 获取当月1日为星期几
        const lastMonthDays = this.getDaysInMonth(date.getFullYear(), date.getMonth()); // moment(date).subtract(1, 'month').daysInMonth(); // 获取上月天数
        const currentMonthDays = this.getDaysInMonth(date.getFullYear(), date.getMonth() + 1);//moment(date).daysInMonth(); // 获取当月天数
        const getDay = day => (day <= lastMonthDays ? day : (day <= (lastMonthDays + currentMonthDays)) ? day - lastMonthDays : day - (lastMonthDays + currentMonthDays)); // 日期处理
        for (let i = 0; i < 7; i += 1) {
            let virtualDay = (lastMonthDays - currentWeekday) + i;
            for (let j = 0; j < 6; j += 1) {
                daysArr[j][i] = getDay(virtualDay + (j * 7));
            }
        }
        console.table(daysArr);
    }
}