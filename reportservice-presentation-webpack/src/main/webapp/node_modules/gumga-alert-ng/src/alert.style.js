export default `

  div.gumga-alert-popup{
    border-radius: 5px;
  }

  div.gumga-alert-popup.alert-success{
    background-color: #51ab63;
    border-color: #51ab63;
  }

  div.gumga-alert-popup.alert-danger{
    background-color: #F44336;
    border-color: #F44336;
  }

  div.gumga-alert-popup.alert-warning{
    background-color: #FF9800;
    border-color: #FF9800;
  }

  div.gumga-alert-popup.alert-info{
    background-color: #03A9F4;
    border-color: #03A9F4;
  }

  button.gumga-alert-popup-icon-close-success{
    background-color: #51ab63;
  }

  button.gumga-alert-popup-icon-close-danger{
    background-color: #F44336;
  }

  button.gumga-alert-popup-icon-close-warning{
    background-color: #FF9800;
  }

  button.gumga-alert-popup-icon-close-info{
    background-color: #03A9F4;
  }

  button.gumga-alert-popup-icon-close{
    opacity: 1;
    color: #fff;
    border: 1px solid #fff;
    width: 27px;
    position: absolute;
    right: -14px;
    border-radius: 50%;
    top: -10px;
    font-size: 25px;
    outline: none;
  }

  button.gumga-alert-popup-icon-close:hover{
    opacity: 1;
  }

  div.gumga-alert-popup span[data-notify="message"], div.gumga-alert-popup-content span[data-notify="title"]{
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
  }

  div.gumga-alert-popup-content{
    width: 100%;
    color: #fff;
    padding-left: 55px;
  }

  div.gumga-alert-popup-icon{
    height: 100%;
    color: #fff;
    font-size: 30px;
    position: absolute;
  }

  span.gumga-alert-popup-icon-circle{
    width: 45px;
    height: 45px;
    background-color: transparent;
    position: absolute;
    top: -5px;
    left: -5px;
    border-radius: 50%;
    border: 2px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span.gumga-alert-popup-icon-circle > div{
    font-size: 25px;
  }




`
