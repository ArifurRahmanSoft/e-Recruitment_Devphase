export class ApiConst {
  constructor() { }
  IsLive: boolean = true;
  autohost(location) {
    debugger;
    var apiHost = '';
    if (this.IsLive) {
      apiHost = 'https://app.citygroupbd.com/erecruite_api/api/'//Real Live
    }
    else {
      apiHost = 'http://localhost:5001/api/'; //Local
    }

    //var apiHost='http://192.168.61.246:81/api/'; //Live

    return apiHost;
  }
}