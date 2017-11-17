export default `

  scrollbar[orient="vertical"] scrollbarbutton,
  scrollbar[orient="vertical"] slider,
  scrollbar[orient="horizontal"] scrollbarbutton,
  scrollbar[orient="horizontal"] slider{
    display:none;
  }

  .gumga-date-input{
    width: 100%;
  }

  .year-and-month::-webkit-scrollbar {
      width: 10px;
  }

  .year-and-month::-webkit-scrollbar-track{
      -webkit-box-shadow: inset 0 0 6px #f5f5f5;
  }

  .year-and-month::-webkit-scrollbar-thumb {
    background-color: #ccc;
    outline: 1px solid slategrey;
  }

  .gumga-date-hour::-webkit-scrollbar, .gumga-date-minutes::-webkit-scrollbar {
    display: none;
    width: 1px;
  }

  .gumga-date-hour::-webkit-scrollbar-track, .gumga-date-minutes::-webkit-scrollbar-track {
    display: none;
  }

  .gumga-date-hour::-webkit-scrollbar-thumb, .gumga-date-minutes::-webkit-scrollbar-thumb {
    display: none;
  }

  .gumga-date {
    font-family: Verdana,sans-serif;
    box-sizing:border-box;
    width: 250px;
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
    position: absolute;
    z-index: 999999999;
    display: inline-block;
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
       -khtml-user-select: none; /* Konqueror HTML */
         -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none;
  }

  .gumga-date-hour{
    width: 93px;
    float: left;
    text-align: center;
    height: 100px;
    overflow: hidden;
    overflow-y: scroll;
  }

  #gumga-date-{{uid}} .gumga-date-hour > span, #gumga-date-{{uid}} .gumga-date-minutes > span {
    color: {{config.fontColor ? config.fontColor : getDefaultConfiguration().fontColor}} !important;
    cursor: pointer;
  }

  #gumga-date-{{uid}} .gumga-date-separator{
    float: left;
    width: 13px;
    height: 100%;
    font-size: 25px;
    color: {{config.fontColor ? config.fontColor : getDefaultConfiguration().fontColor}} !important;
    padding-top: 35px;
  }

  .gumga-date-minutes{
    width: 93px;
    text-align: center;
    height: 100px;
    overflow: hidden;
    overflow-y: scroll;
  }

  .gumga-date-hour > li,  .gumga-date-minutes > li{
    font-size: 40px !important;
  }

  #gumga-date-{{uid}} > .month > ul .hours {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    padding: 6px;
    font-size: 14px;
    cursor : pointer;
    text-align: center;
    color: {{style.fontColor ? style.fontColor : '#fff'}} !important;
    background: rgba(43, 38, 38, 0.21);
    height: 32px;
  }

  .gumga-date > .month > ul .hours:hover {
    font-size: 15px;
    transition: all 1s;
  }

  .gumga-date > .month {
      padding: 25px 25px;
      width: 100%;
  }

  .gumga-date > .month ul {
      margin: 0;
      list-style: none;
      padding: 0;
  }

  .gumga-date > .month ul li {
      color: white;
      font-size: 18px;
      text-transform: uppercase;
      cursor: pointer;
      letter-spacing: 3px;
  }

  .gumga-date > .month .prev {
      float: left;
      padding-top: 10px;
      outline: none;
      cursor: pointer;
  }

  .gumga-date > .month .next {
      float: right;
      padding-top: 10px;
      cursor: pointer;
      outline: none;
  }

  .gumga-date > .year-and-month {
      background-color: #eee;
      max-height: 204px;
      text-align: center;
      overflow-x: auto;
      transition-property: all;
       transition-duration: .5s;
  }

  .gumga-date > .weekdays,  .gumga-date > .year-and-month >  .change-month{
      margin: 0;
      padding: 10px 0;
      background-color: #ddd;
      padding-left: 3px;
      list-style: none;
  }

  .gumga-date > .year-and-month > .change-month {
    background-color: #eee;
    max-height: 210px;
    text-align: center;
    overflow: auto;
  }

  .gumga-date > .year-and-month > .change-month li {
      cursor: pointer;
      padding: 5px;
      width: 40px;
      text-align: center;
      float: left;
      font-size: 10px;
  }

  .gumga-date > .year-and-month > .change-month > .year{
      display: block;
      text-align: left;
      font-weight: 800;
      padding-left: 15px;
      margin-top: 27px;
      float: left;
      width: 60px;
  }

  .gumga-date > .weekdays li {
      display: inline-block;
      width: 35px;
      color: #666;
      text-align: center;
  }

  .gumga-date > .days {
      background: #eee;
      margin: 0;
      padding: 0;
  }

  .gumga-date > .days li {
      list-style-type: none;
      display: inline-block;
      width: 35.7px;
      text-align: center;
      margin-bottom: 0px;
      font-size:12px;
      color: #777;
      cursor: pointer;
  }

  .gumga-date > .days li .active {
      padding: 5px;
      color: white !important
  }

  @media screen and (max-width:720px) {
      .gumga-date > .weekdays li, .days li {width: 13.1%;}
  }

  @media screen and (max-width: 420px) {
      .gumga-date > .weekdays li, .days li {
        width: 12.5%;
      }
      .gumga-date > .days li .active {
        padding: 2px;
      }
  }

  @media screen and (max-width: 290px) {
      .gumga-date > .weekdays li, .days li {
        width: 12.2%;
      }
  }
  #gumga-date-{{uid}} > .month ul li {
    color: {{config.fontColor ? config.fontColor : getDefaultConfiguration().fontColor}};
  }
  #gumga-date-{{uid}} > .days li .active{
    background: {{config.primaryColor ? config.primaryColor : getDefaultConfiguration().primaryColor}} !important;
    border-radius: 50%;
  }
  #gumga-date-{{uid}} > .days li:hover{
    color: {{config.primaryColor ? config.primaryColor : getDefaultConfiguration().primaryColor}};
  }
  #gumga-date-{{uid}} > .year-and-month > .change-month  li:hover{
    color: {{config.primaryColor ? config.primaryColor : getDefaultConfiguration().primaryColor}} !important;
  }
  #gumga-date-{{uid}} > .year-and-month > .change-month  li .active{
    background: {{config.primaryColor ? config.primaryColor : getDefaultConfiguration().primaryColor}} !important;
    color: {{config.fontColor ? config.fontColor : getDefaultConfiguration().fontColor}} !important;
    padding: 5px;
    border-radius: 10px;
  }


  gumga-date > div {
    position: relative;
  }

  gumga-date i.material-icons{
    position: absolute;
    font-size: 20px;
    display: inline-block;
    height: 100%;
    vertical-align: middle;
    margin: auto;
    top: 0;
    right: 10px;
    text-align: center;
    bottom: 0;
    padding-top: 7px;
  }

  gumga-date li span.holiday {
    color: #F34235;
  }

  /* Add this attribute to the element that needs a tooltip */
  [data-tooltip] {
    position: relative;
    z-index: 2;
    cursor: pointer;
  }
  
  /* Hide the tooltip content by default */
  [data-tooltip]:before,
  [data-tooltip]:after {
    visibility: hidden;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=0);
    opacity: 0;
    pointer-events: none;
  }
  
  /* Position tooltip above the element */
  [data-tooltip]:before {
    position: absolute;
    bottom: 150%;
    left: 50%;
    margin-bottom: 5px;
    margin-left: -80px;
    padding: 7px;
    width: 160px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    background-color: #000;
    background-color: hsla(0, 0%, 20%, 0.9);
    color: #fff;
    content: attr(data-tooltip);
    text-align: center;
    font-size: 14px;
    line-height: 1.2;
  }
  
  /* Triangle hack to make tooltip look like a speech bubble */
  [data-tooltip]:after {
    position: absolute;
    bottom: 150%;
    left: 50%;
    margin-left: -5px;
    width: 0;
    border-top: 5px solid #000;
    border-top: 5px solid hsla(0, 0%, 20%, 0.9);
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    content: " ";
    font-size: 0;
    line-height: 0;
  }
  
  /* Show tooltip content on hover */
  [data-tooltip]:hover:before,
  [data-tooltip]:hover:after {
    visibility: visible;
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
    filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=100);
    opacity: 1;
  }


  [data-tooltip=""]:after, [data-tooltip=""]:before{
    display: none;
  }

  .gumga-date > .days li{
    padding: 5px 0 5px 0;
  }

  gumga-date li.sunday, gumga-date li.saturday{
    background-color: rgba(255, 255, 255, 0.22);
  }


`
