export interface IWeekDays {
    sunday: IOneDay;
    monday: IOneDay;
    tuesday: IOneDay;
    wednesday: IOneDay;
    thurday: IOneDay;
    friday: IOneDay;
    saturday: IOneDay;
    select: IOneDay;
}

export interface IOneDay {
    year?;
    month?;
    week?;
    day?;
    weekDay?;
    rem?;
    selected?;
    isCurrentMonth?: boolean;
}