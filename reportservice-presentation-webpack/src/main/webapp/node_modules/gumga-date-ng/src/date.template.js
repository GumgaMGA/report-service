import style from './date.style.js'

function useGumgaLayout(){
  try {
    return !!angular.module('gumga.layout');
  } catch (error) {
    return false;
  }
}

const input = useGumgaLayout() ?
  `
    <div style="{{label ? 'height: 34px;' : ''}}">
      <input  ng-focus="config.open();inputFocused = true;"
              ng-blur="inputFocused = false;dateBlur($event);"
              ng-model="value"
              gumga-date-mask="{{mask}}"
              ng-disabled="ngDisabled"
              class="gumga-date-input {{inputProperties.class}}"
              placeholder="{{inputProperties.placeholder}} "/>
        <span class="bar"></span>
        <label for="email" class="control-label" ng-if="label">{{label}}</label>
        <i class="material-icons" ng-show="icon" ng-click="iconClick($event);">{{icon}}</i>
    </div>
  `
  :
  `
   <div>
    <input  ng-focus="config.open();inputFocused = true;"
            ng-blur="inputFocused = false;dateBlur($event);"
            ng-model="value"
            gumga-date-mask="{{mask}}"
            ng-disabled="ngDisabled"
            class="gumga-date-input {{inputProperties.class}}"
            placeholder="{{inputProperties.placeholder}} "/>
    </div>
  `;

export default `
  <style>${style}</style>

  ${input}

  <div class="gumga-date" ng-show="opened" id="gumga-date-{{uid}}" style="{{getPosition()}}">
    <div class="month" style="background:{{config.background ? config.background : getDefaultConfiguration().background}}">
      <ul>
        <span data-ng-click="alterView('hours')"
              ng-hide="type == 'DATE'" ng-show="view != 'hours' || type == 'HOUR'"
              class="hours">
              {{gumgaDateValue.getHours() < 10 ? "0"+gumgaDateValue.getHours() : gumgaDateValue.getHours()}}
                :
              {{gumgaDateValue.getMinutes() < 10 ? "0"+gumgaDateValue.getMinutes() : gumgaDateValue.getMinutes()}}
              </span><br>

        <span data-ng-click="alterView('days')"
              ng-show="view == 'hours' && (type == 'DATE' || type == 'DATE_HOUR') || type == 'DATE'"
              class="hours">{{value}}</span>

        <br>
        <li ng-show="view != 'hours' && (type == 'DATE' || type == 'DATE_HOUR')" class="prev" ng-click="handlingMonths(gumgaDateValue, -1)">&#10094;</li>
        <li ng-show="view != 'hours' && (type == 'DATE' || type == 'DATE_HOUR')" class="next" ng-click="handlingMonths(gumgaDateValue, +1)">&#10095;</li>
        <li ng-show="view != 'hours' && (type == 'DATE' || type == 'DATE_HOUR')" style="text-align:center">
          <span style="padding: 10px;" data-ng-click="alterView('months')">{{getMonth()}}</span><br>
          <span data-ng-click="alterView('months')" style="font-size:18px">{{getYear()}}</span>
        </li>

        <div class="gumga-date-hour" ng-show="view == 'hours'">
            <span class="glyphicon glyphicon-chevron-up" ng-click="handlingHours(1)"></span>
              <li>{{gumgaDateValue.getHours() < 10 ? "0"+gumgaDateValue.getHours() : gumgaDateValue.getHours()}}</li>
            <span class="glyphicon glyphicon-chevron-down" ng-click="handlingHours(-1)"></span>
        </div>
        <div ng-show="view == 'hours'" class="gumga-date-separator">
          <span>:</span>
        </div>
        <div class="gumga-date-minutes" ng-show="view == 'hours'">
          <span class="glyphicon glyphicon-chevron-up" ng-click="handlingMinutes(1)"></span>
            <li >{{gumgaDateValue.getMinutes() < 10 ? "0"+gumgaDateValue.getMinutes() : gumgaDateValue.getMinutes()}}</li>
          <span class="glyphicon glyphicon-chevron-down" ng-click="handlingMinutes(-1)"></span>
        </div>

      </ul>
    </div>

    <div class="year-and-month" id="year-and-month-{{uid}}">
      <ul class="change-month" ng-show="view == 'months'" ng-repeat="year in years">
        <span class="year">{{year}}</span>

        <div style="width: 170px;float: right;">
          <li data-ng-repeat="month in getGumgaMonths(true)" data-ng-click="setYearAndMonth(year, month)">
            <span ng-class="{'active' : isThatMonth(year, month)}">{{month}}</span>
          </li>
        </div>

      </ul>
    </div>

    <ul class="weekdays" ng-show="view == 'days'">
      <li ng-repeat="weekday in getWeekDays()">{{weekday}}</li>
    </ul>
    <ul class="days" ng-show="view == 'days'">
      <li data-ng-click="setDay(row, $event)" data-ng-repeat="row in rows track by $index" class="{{getWeekdayClass(row)}}">
          <span ng-class="{'active' : isToday(row), 'holiday': isHoliday(row)}"
                data-tooltip="{{getNameHoliday(row)}}"
                style="{{row.style}}">
                {{row.value}}
          </span>
      </li>
    </ul>
  </div>

`;
