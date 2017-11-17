moment.fn.holiday = function(_holidays) {
    var diff = 1+ (0 | (this._d.getDate() - 1) / 7),
        memorial = (this._d.getDay() === 1 && (this._d.getDate() + 7) > 30) ? "5" : null;

    return (_holidays['M'][this.format('MM/DD')] || _holidays['W'][this.format('M/'+ (memorial || diff) +'/d')]);
};

export class DateHoliday {

    constructor(_date, _holidays){
        this.date = moment(_date, "YYYY-MM-DD");
        this._holidays = _holidays;
    }

    isHoliday(){
        return this.date.holiday(this._holidays) != undefined;
    }

    getNameHoliday(){
        return this.date.holiday(this._holidays);
    }
    
}