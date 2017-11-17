import { DateHoliday } from './date.holiday';

(() => {
    'use strict';

    require('./date.service.js')
    require('./date.mask.js')
    const TEMPLATE = require('./date.template.js').default;


    const GumgaDate = ($timeout, $filter, $locale, GumgaDateService) => {
        return {
            restrict: 'E',
            template: TEMPLATE,
            scope: {
                config: '=?configuration',
                ngModel: '=',
                ngDisabled: '=?',
                ngBlur: '&?'
            },
            require: '^ngModel',
            link: (scope, elm, attrs) => {
               
                let self = scope;
                self.uid = Math.floor((Math.random() * 99999999));

                self.config = self.config || {};

                self.label = attrs.label;
                self.icon = attrs.icon;

                self.iconClick = ($event) => {
                    $event.stopPropagation();
                    let input = elm.find('input');
                    input.focus();
                }

                self.isHoliday = row => new DateHoliday(row.year + '-' + (row.mouth+1) + '-' + row.value, GumgaDateService.getHolidays()).isHoliday();
                

                self.getNameHoliday = row => new DateHoliday(row.year + '-' + (row.mouth+1) + '-' + row.value, GumgaDateService.getHolidays()).getNameHoliday();
                

                self.getWeekdayClass = row => moment(row.year + '-' + (row.mouth+1) + '-' + row.value, 'YYYY-MM-DD').format('dddd').toLowerCase()

                self.getDefaultConfiguration = () => GumgaDateService.getDefaultConfiguration();

                self.dateBlur = (evt) => {
                    if (self.ngBlur) {
                        self.ngBlur({$event: evt});
                    }
                }

                self.range = function (min, max, step) {
                    if (!self.opened) return [];
                    step = step || 1;
                    let input = [];
                    for (let i = min; i <= max; i += step) {
                        input.push(i);
                    }
                    return input;
                };

                self.getScrollSize = () => {
                    if (!self.gumgaDateValue) return;
                    let index = self.gumgaDateValue.getFullYear() - self.getMinYear();
                    return (index * 92) - 50;
                }

                self.getWeekDays = () => {
                    let dateformats = $locale.DATETIME_FORMATS;
                    return dateformats.SHORTDAY.map(day => {
                        return day.substring(0, 3);
                    });
                }

                self.getGumgaMonths = (cut) => {
                    let dateformats = $locale.DATETIME_FORMATS;
                    return dateformats.STANDALONEMONTH.map(day => {
                        return cut ? day.substring(0, 3) : day;
                    });
                }

                const formatDate = (date, format) => {
                    return $filter('date')(date, format);
                }

                const setType = () => {
                    self.type =
                        self.inputFormat.toLowerCase().indexOf('hh:mm') != -1
                        && self.inputFormat.toLowerCase().indexOf('dd') == -1 ? 'HOUR' : self.type;

                    self.type = self.inputFormat.toLowerCase().indexOf('hh:mm') != -1
                    && self.inputFormat.toLowerCase().indexOf('dd') != -1 ? 'DATE_HOUR' : self.type;

                    self.type = self.inputFormat.toLowerCase().indexOf('hh:mm') == -1
                    && self.inputFormat.toLowerCase().indexOf('dd') != -1 ? 'DATE' : self.type;

                    if (self.type == 'HOUR') {
                        self.alterView('hours');
                    } else {
                        self.alterView('days');
                    }

                }

                const init = () => {
                    self.inputFormat = self.config.format ? self.config.format : self.getDefaultConfiguration().format;
                    setType();

                    self.mask = self.inputFormat.replace(/[a-zA-Z\d]/g, '9');

                    self.inputProperties = {
                        class: self.config.inputProperties && self.config.inputProperties.class ? self.config.inputProperties.class : self.getDefaultConfiguration().inputProperties.class,
                        placeholder: self.config.inputProperties && self.config.inputProperties.placeholder ? self.config.inputProperties.placeholder : angular.noop()
                    }

                    self.style = {
                        fontColor: self.config.fontColor || self.getDefaultConfiguration().fontColor,
                        background: self.config.background || self.getDefaultConfiguration().background
                    }

                    if (self.ngModel && (self.ngModel instanceof Date)) {
                        self.gumgaDateValue = self.ngModel;
                        self.setNgModel(self.gumgaDateValue)
                    } else if (self.ngModel && (typeof self.ngModel == "string")) {
                        let date = moment(self.ngModel).toDate();
                        self.gumgaDateValue = date;
                        self.setNgModel(self.gumgaDateValue);
                    } else {
                        self.gumgaDateValue = new Date();
                    }

                }

                const isDate = function (s) {
                    let separators = ['\\.', '\\-', '\\/'];
                    let bits = s.split(new RegExp(separators.join('|'), 'g'));
                    let d = new Date(bits[2], bits[1] - 1, bits[0]);
                    return d.getFullYear() == bits[2] && d.getMonth() + 1 == bits[1];
                }


                self.alterView = view => {
                    $timeout(() => {
                        self.view = view;
                        if (view == 'months') {
                            if (!self.years)
                                self.years = self.range(self.getMinYear(), self.getMaxYear());
                            handlingScroll();
                        }
                    })
                }


                let calendar = undefined;

                const animateScroll = (size, scrollTop) => {
                    angular.element(calendar).animate({scrollTop: size}, 400);
                }

                $timeout(() => {
                    calendar = document.getElementById('year-and-month-' + self.uid)
                }, 1000)

                const handlingScroll = () => {
                    $timeout(() => {
                        let size = self.getScrollSize();
                        animateScroll(size, calendar.scrollTop)
                    })
                }

                self.handlingHours = (num) => {
                    self.gumgaDateValue.setHours(self.gumgaDateValue.getHours() + num);
                    self.setNgModel(self.gumgaDateValue)
                }

                self.handlingMinutes = (num) => {
                    self.gumgaDateValue.setMinutes(self.gumgaDateValue.getMinutes() + num);
                    self.setNgModel(self.gumgaDateValue)
                }

                self.getFormatLength = () => self.inputFormat ? self.inputFormat.replace(/[^a-zA-Z0-9]/g, '').length : 0;

                self.setGumgaDateValue = (value, event) => {
                    if (!value) return;
                    checkDateIsValid(value);
                }

                function checkDateIsValid(value, ignoreModel) {
                    self.inputFormat = self.config.format ? self.config.format : self.getDefaultConfiguration().format;
                    let minYear = self.getMinYear();
                    let maxYear = self.getMaxYear();
                    let timeZone = self.config.timeZone ? self.config.timeZone : self.getDefaultConfiguration().timeZone;
                    let date = moment(value, self.inputFormat.toUpperCase().replace('HH:MM', 'hh:mm')).tz(timeZone).toDate();
                    if (value && date != 'Invalid Date' && (date.getFullYear() >= minYear && date.getFullYear() <= maxYear)) {
                        self.gumgaDateValue = date;
                        if (!ignoreModel) {
                            self.setNgModel(self.gumgaDateValue);
                        }
                        if (self.config.change) self.config.change(self.ngModel);
                    } else {
                        self.value = null;
                    }
                }

                self.getMinYear = () => {
                    return self.config.minYear ? self.config.minYear : self.getDefaultConfiguration().minYear;
                }

                self.getMaxYear = () => {
                    return self.config.maxYear ? self.config.maxYear : self.getDefaultConfiguration().maxYear;
                }

                self.getMonth = () => {
                    if (!self.gumgaDateValue || !(self.gumgaDateValue instanceof Date)) return;
                    return self.getGumgaMonths()[self.gumgaDateValue.getMonth()];
                }

                self.setDay = (day, evt) => {
                    if (!self.gumgaDateValue || !(self.gumgaDateValue instanceof Date)) return;
                    let update = new Date();
                    update.setYear(day.year);
                    update.setMonth(day.mouth);
                    update.setDate(day.value);
                    update.setHours(self.gumgaDateValue.getHours());
                    update.setMinutes(self.gumgaDateValue.getMinutes());
                    update.setSeconds(self.gumgaDateValue.getSeconds());
                    self.gumgaDateValue = update;
                    self.setNgModel(self.gumgaDateValue)
                    if (self.config.change) self.config.change(self.ngModel);
                    if (self.config.hasOwnProperty('closeOnChange') ? self.config.closeOnChange : self.getDefaultConfiguration().closeOnChange) {
                        self.config.close();
                    }
                }

                self.setYearAndMonth = (year, month) => {
                    if (!self.gumgaDateValue || !(self.gumgaDateValue instanceof Date)) return;
                    self.getGumgaMonths(true).forEach((gumgaMonth, index) => {
                        if (gumgaMonth == month) {
                            let update = new Date();
                            update.setYear(year);
                            update.setMonth(index);
                            update.setDate(self.gumgaDateValue.getDate());
                            update.setHours(self.gumgaDateValue.getHours());
                            update.setMinutes(self.gumgaDateValue.getMinutes());
                            update.setSeconds(self.gumgaDateValue.getSeconds());
                            self.gumgaDateValue = update;
                            self.setNgModel(self.gumgaDateValue)
                            self.alterView('days');
                        }
                    });
                }

                self.getYear = () => {
                    if (!self.gumgaDateValue) return;
                    return self.gumgaDateValue.getFullYear();
                }

                self.isToday = day => {
                    return day.value == self.gumgaDateValue.getDate() && day.mouth == self.gumgaDateValue.getMonth();
                }

                self.isThatMonth = (year, mouth) => {
                    return self.getGumgaMonths(true)[self.gumgaDateValue.getMonth()] == mouth && self.gumgaDateValue.getFullYear() == year;
                }

                self.config.open = (event) => {
                    if (event) event.stopPropagation();
                    if (self.config.hasOwnProperty('showCalendar') ? self.config.showCalendar : self.getDefaultConfiguration().showCalendar) {
                        self.opened = true;
                        setType();
                        newCalendar(self.gumgaDateValue.getMonth(), self.gumgaDateValue.getFullYear());
                    }
                }

                self.config.close = () => {
                    self.opened = false;
                    self.alterView('days');
                }

                const getDaysInMonth = (date) => {
                    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
                };

                self.handlingMonths = function (date, num) {
                    self.gumgaDateValue = moment(date).add(num, 'months').toDate();
                    self.setNgModel(self.gumgaDateValue)
                    if (self.view == 'months') {
                        handlingScroll();
                    }
                }

                self.$watch('config', () => {
                    init();
                }, true)

                self.$watch('ngModel', (value) => {
                    $timeout(() => {
                        if (self.ngModel && (self.ngModel instanceof Date)) {
                            self.gumgaDateValue = self.ngModel;
                            newCalendar(value.getMonth(), value.getFullYear());
                            self.value = formatDate(angular.copy(value), self.inputFormat);
                        }
                        if (self.ngModel && (typeof self.ngModel == "string")) {
                            let date = moment(self.ngModel).toDate();
                            self.gumgaDateValue = date;
                            newCalendar(date.getMonth(), date.getFullYear());
                            let timeZone = self.config.timeZone ? self.config.timeZone : self.getDefaultConfiguration().timeZone;
                            let dateValue = moment(self.value, self.inputFormat.toUpperCase().replace('HH:MM', 'hh:mm')).tz(timeZone).toDate()
                            if (self.value != formatDate(angular.copy(date), self.inputFormat) && dateValue.getMinutes() != date.getMinutes() + 1) {
                                checkDateIsValid(formatDate(angular.copy(date), self.inputFormat), true);
                            }
                        }
                        if (!value && !self.inputFocused) {
                            self.gumgaDateValue = new Date();
                            newCalendar(self.gumgaDateValue.getMonth(), self.gumgaDateValue.getFullYear());
                            self.value = null;
                        }
                    })
                }, true)

                self.$watch('value', (value) => value ? self.setGumgaDateValue(value) : self.ngModel = null);

                self.setNgModel = (value) => {
                    let timeZone = self.config.timeZone ? self.config.timeZone : self.getDefaultConfiguration().timeZone;
                    self.ngModel = moment.tz(value, timeZone).format()
                    newCalendar(value.getMonth(), value.getFullYear());
                    self.value = formatDate(angular.copy(value), self.inputFormat);
                }

                elm.bind('click', (event) => {
                    event.stopPropagation();
                })


                const incrementDay = (event) => {
                    let day = undefined;
                    switch (event.keyCode) {
                        case 38:
                            //UP
                            day = moment(self.gumgaDateValue).add(-7, 'days').toDate();
                            break;
                        case 40:
                            //DOWN
                            day = moment(self.gumgaDateValue).add(+7, 'days').toDate();
                            break;
                        case 37:
                            //LEFT
                            day = moment(self.gumgaDateValue).add(-1, 'days').toDate();
                            break;
                        case 39:
                            //RIGHT
                            day = moment(self.gumgaDateValue).add(+1, 'days').toDate();
                            break;
                        case 13:
                            //ENTER
                            self.setNgModel(self.gumgaDateValue);
                            self.config.close();
                            break;
                        case 9:
                            let change = self.config.hasOwnProperty('changeDateOnTab') ? self.config.changeDateOnTab : self.getDefaultConfiguration().changeDateOnTab;
                            if ((self.inputFocused && !self.ngModel) && change) {
                                self.gumgaDateValue = new Date();
                                self.setNgModel(self.gumgaDateValue);
                            } else if (!self.inputFocused) {
                                self.config.close();
                            }
                            break;
                    }

                    $timeout(() => {
                        if (!self.opened || !day) return;
                        event.stopPropagation();
                        self.gumgaDateValue = day
                        self.setNgModel(self.gumgaDateValue);
                    })
                }

                const incrementMinutes = (event) => {
                    let minutes = 0;
                    switch (event.keyCode) {
                        case 38:
                            //UP
                            minutes = moment(self.gumgaDateValue).add(+1, 'minutes').toDate();
                            break;
                        case 40:
                            //DOWN
                            minutes = moment(self.gumgaDateValue).add(-1, 'minutes').toDate();
                            break;
                    }
                    $timeout(() => {
                        if (minutes == 0 || !self.opened) return;
                        event.stopPropagation();
                        self.gumgaDateValue = minutes;
                        self.setNgModel(self.gumgaDateValue);
                    })
                }

                let listenerClick = document.addEventListener('click', evt => {
                    $timeout(self.config.close);
                })

                const getOthersGumgaDate = () => {
                    let dates = angular.element('gumga-date');
                    let others = dates.filter(i => {
                        return !angular.equals(dates[i], elm[0]);
                    });
                    return others;
                }

                elm.find('input')[0].addEventListener('focus', function(){
                    angular.forEach(getOthersGumgaDate(), elment => {
                        angular.element(elment).find('div.gumga-date').scope().config.close()
                    });
                });

                let listenerKey = document.addEventListener('keydown', event => {
                    self.opened && self.view == 'days' ? incrementDay(event) : angular.noop();
                    self.opened && self.view == 'hours' ? incrementMinutes(event) : angular.noop();
                })

                self.$on('$destroy', () => {
                    document.removeEventListener('click', listenerClick);
                    document.removeEventListener('keyup', listenerKey);
                })

                const newCalendar = (mouth, year) => {
                    if (!self.opened) return;
                    let primaryDay = new Date(year, mouth, 1), count = 1;
                    let possibilities = new Array(42);

                    for (let x = 0; x < possibilities.length; x++) {
                        possibilities[x] = "";
                    }

                    for (let x = primaryDay.getDay(); x < possibilities.length; x++) {
                        let data = new Date(year, mouth, count);
                        possibilities[x] = {value: data.getDate()}
                        possibilities[x].style = data.getMonth() != mouth ? 'color: #b7aaaa !important;' : '';
                        possibilities[x].style += possibilities[x].value < 10 ? 'padding-left: 9.75px;padding-right: 9.75px;' : '';
                        possibilities[x].mouth = data.getMonth();
                        possibilities[x].year = data.getFullYear();
                        count++;
                    }

                    let previousMonth = moment(new Date(year, mouth, 1)).add(-1, 'months');
                    for (let i = 0; i < primaryDay.getDay(); i++) {
                        possibilities[(primaryDay.getDay() - 1) - i] = {
                            value: previousMonth.daysInMonth() - i,
                            style: 'color: #b7aaaa !important;',
                            mouth: previousMonth.toDate().getMonth(),
                            year: previousMonth.toDate().getFullYear()
                        }
                    }
                    self.rows = possibilities;
                }

                self.getPosition = () => {
                    let position = self.config.position ? self.config.position : self.getDefaultConfiguration().position;
                    switch (position.toUpperCase()) {
                        case 'LEFT_BOTTOM':
                            return 'top: 25px;left: -235px;';
                            break;
                        case 'LEFT_TOP':
                            if (self.view == 'days' || self.view == 'months')
                                return 'top: -290px;left: -235px;';
                            if (self.view == 'hours')
                                return 'top: -130px;left: -235px;';
                            break;
                        case 'BOTTOM_LEFT':
                            return 'left: 15px;';
                            break;
                        case 'BOTTOM_RIGHT':
                            return 'right: 15px;';
                            break;
                        case 'RIGHT_BOTTOM':
                            return 'right: -235px;';
                            break;
                        case 'RIGHT_TOP':
                            if (self.view == 'days' || self.view == 'months')
                                return 'top: -290px;right: -235px;';
                            if (self.view == 'hours')
                                return 'top: -130px;right: -235px;';
                            break;
                        case 'TOP_LEFT':
                            if (self.view == 'days' || self.view == 'months')
                                return 'top: -325px;left: 15px;';
                            if (self.view == 'hours')
                                return 'top: -165px; left: 15px;';
                            break;
                        case 'TOP_RIGHT':
                            if (self.view == 'days' || self.view == 'months')
                                return 'top: -325px;right: 15px;';
                            if (self.view == 'hours')
                                return 'top: -165px; right: 15px;';
                            break;
                    }
                }


            }
        }
    }

    GumgaDate.$inject = ['$timeout', '$filter', '$locale', 'GumgaDateService'];

    angular.module('gumga.date', ['gumga.date.service', 'gumga.date.mask'])
        .directive('gumgaDate', GumgaDate);
})();
