// data to be used in processing the beacons:
// var beaconData = {
//   service: null,
//   characteristic: null,
//   rssi: null,
//   localname: null,
//   points:null
// };

var beaconData = {
  service: 'A495FF20-C5B1-4B44-B512-1370F02D74DE',
  characteristic: 'A495FF25-C5B1-4B44-B512-1370F02D74DE',
  rssi: -30,
  localname: null,
  points:null,
  id: null
};

// data about the server:
var server = {
  url: 'http://104.236.16.105:8080'
};

// data about the user:
var user = {
 name: 'jw3884',
 token: null
};

// the app functions:
var app = {
  // initialize runs when the app starts
  initialize: function() {
    this.bindEvents();
    
  },

// bindEvents adds listeners for the DOM elements:
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    loginButton.addEventListener('touchstart', this.login, false);
    logoutButton.addEventListener('touchstart', this.logout, false);
    scanButton.addEventListener('touchstart', this.startScanning, false);
    //deviceList.addEventListener('touchstart', this.connectSuccess, false);
  },

// onDeviceReady runs when the page finishes loading:
  onDeviceReady: function() {
    alert('device ready');
    //console.log('device is ready');
    //ble.scan([], 5, app.discoverGoldenEgg, app.onError);
  },

  // discoverGoldenEgg: function(device) {
  //   if (device.name === || device.localname ===){
  //      var listItem = document.createElement('li'),
  //         html = '<b>' + device.name + '</b><br/>' +
  //             'RSSI: ' + device.rssi;

  //   }
  // },

  startScanning: function(){
    //alert("start scanning");
    //$('#beacons').empty();
    //deviceList.innerHTML = '';
    $('#deviceList').empty(); 
    //ble.scan([], 5, app.onDiscoverDevice, app.onError);
    ble.scan(['A495FF20-C5B1-4B44-B512-1370F02D74DE'], 5, app.onDiscoverDevice, app.onError);
  },

  onDiscoverDevice: function(device) {
    if (device.name){
      var name = device.name;
      console.log(name);

      beaconData.id = device.id;
       var listItem = document.createElement('li'),
          html = '<b>' + device.name + '</b><br/>' +
              'RSSI: ' + device.rssi;

        //listItem.dataset.deviceId = device.id;  // TODO
        listItem.innerHTML = html;
        //$('#deviceList').append(listItem);
        console.log(listItem);

        //listItem.addEventListener('click', this.connectSuccess, false);
        // Maybe like this, so it 
        listItem.addEventListener('click', function() {
          console.log('hit?');
          //app.connectSuccess(device);
          ble.connect(device.id, app.connectSuccess, app.onError);
          return false;
        }.bind(this), false);


        deviceList.appendChild(listItem);

    }
  },

  onError: function(reason) {
        alert("ERROR: " + reason); // real apps should use notification.alert
  },

  //ble.connect(device.id, app.connectSuccess, app.onError);

  // stopScanSuccess: function() {
  //       console.log("Stop Scan Success");
  // },

  // stopScanFailure: function() {
  //         console.log("Stop Scan Failure");
  // },

  connectSuccess: function(device) {
        //var deviceId = e.target.dataset.deviceId,
        console.log(device);
        console.log("rssi: "+device.rssi);

        beaconData.localname = device.advertising.kCBAdvDataLocalName;


        $('#deviceList').empty();
        var listItem = document.createElement('p');
        var html = '<b>' + device.name + '</b><br/>' +
              'localname: ' + device.advertising.kCBAdvDataLocalName + '</b><br/>' +
              'RSSI: ' + device.rssi + '</b><br/>' +
              'service: ' +device.advertising.kCBAdvDataServiceUUIDs[0] + '</b><br/>' +
              'characteristic: ' +device.characteristic;

        //listItem.dataset.deviceId = device.id;  // TODO
        listItem.innerHTML = html;
        //$('#deviceList').append(listItem);
        //console.log(listItem);

        deviceList.appendChild(listItem);

        console.log(beaconData);
        postResult.innerHTML = "beaconData: "+ JSON.stringify(beaconData);

        // if (device.advertising.kCBAdvDataLocalName === "Golden Egg"){
        //   beaconData.localname = device.advertising.kCBAdvDataLocalName;
        //   ble.read(device.id, beaconData.service, beaconData.characteristic, app.successRead, app.onError);
        // }

        // if (device.advertising.kCBAdvDataServiceUUIDs[0] === "A495FF20-C5B1-4B44-B512-1370F02D74DE"){
        //   alert('reading!');
        //   beaconData.localname = device.advertising.kCBAdvDataLocalName;
        // ble.read(device.id, service_UUID, characteristic.UUID, app.successRead, app.onError);
        // //ble.read(device.id, "A495FF20-C5B1-4B44-B512-1370F02D74DE", "A495FF25-C5B1-4B44-B512-1370F02D74DE", app.successRead, app.onError);

        // }

        ble.read(device.id, 'A495FF20-C5B1-4B44-B512-1370F02D74DE', 'A495FF25-C5B1-4B44-B512-1370F02D74DE', app.successRead, app.onError);

        // We want to be notified
        //alert('Connected to: '+ peripheral);
  },

  successRead: function(data){
    postResult.innerHTML = 'reading...';
    alert("success reading!");
    var d = new Uint8Array(data);
    beaconData.points = d[0];
    console.log(d[0]);

    console.log(beaconData);

    app.beacon();
    ble.disconnect(beaconData.id, app.successDisconnect, app.onError);

  },

  onError: function(reason) {
        alert("ERROR: " + reason); // real apps should use notification.alert
  },

  successDisconnect: function(){
    console.log('disconnected');
  },

  beacon: function(){

    var data = 'token=' + user.token +    
        '&localname=' + beaconData.localname + 
        '&rssi=' + beaconData.rssi + 
        '&characteristic=' + beaconData.characteristic + 
        '&points=' + beaconData.points; 
    //alert('posting: ' + data);
    postResult.innerHTML = 'POSTING: '+JSON.stringify(data);
    var target = server.url + '/beacon'; 
    app.postBeacon(data, target); 

  },

  postBeacon: function(data, target) {
    var request = new XMLHttpRequest();
    request.open("POST", target, true);

    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("Content-length", data.length);

    request.onreadystatechange = function() {
      // if you got a good request:
      if(request.readyState == 4 && request.status == 200) {
        // the response is a JSON object. Parse it:
        responseJson = JSON.parse(request.responseText);
        // show the whole result in the postResult div:
        postResult.innerHTML = JSON.stringify(responseJson);

      }
    };

    request.send(data);

    if (beaconData.localname === "Golden Egg"){
      alert('found the golden egg!');
    }
  },

// login is called by the login button:
  login: function() {
    data = 'username=' + user.name;     // format the data as form-urlencoded
    var target = server.url + '/login'; // add the route to the base URL
    app.postRequest(data, target);      // make the POST request
  },
  // logout is called by the logout button:
  logout: function() {
    data = 'username=' + user.name +    // format the data as form-urlencoded
        '&token=' + user.token;         // add the user token as well
    var target = server.url + '/logout';// add the route to the base URL
    app.postRequest(data, target);      // make the POST request
  },

  // postRequest is called by the login and logout functions:
  postRequest: function(data, target) {
    // instantiate a request object
    var request = new XMLHttpRequest();
    // get the user token:
    var tokenField = document.getElementById('token');
    // open a POST request for the URL and route:
    request.open("POST", target, true);
    // set headers for the POST:
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("Content-length", data.length);

// this is called if the ready state of the request changes
// (i.e. if a response comes in):
    request.onreadystatechange = function() {
      // if you got a good request:
      if(request.readyState == 4 && request.status == 200) {
        // the response is a JSON object. Parse it:
        responseJson = JSON.parse(request.responseText);

        // put the token in the token field so you don't have to type it:
        tokenField.value = responseJson.token;
        // put the rest of the results in the appropriate objects:
        user.token = responseJson.token;
        //beaconData.characteristic = responseJson.characteristic;
        //beaconData.service = responseJson.service;
        // show the whole result in the postResult div:
        postResult.innerHTML = JSON.stringify(responseJson);

      }
    };
    // send the actual request:
    request.send(data);
  }
};
