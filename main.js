const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron')
const isCharging = require('is-charging');
const batteryLevel = require('battery-level');
const path = require('path');
const axios = require('axios');
let ls = require('local-storage');


let mainWindow
let level = 0;
let charging = false;
let isQuiting;
let tray;

function createBrowserWindow(arg) {
  const win = new BrowserWindow({
    height: 600,
    width: 800
  });


  // Make a request for a user with a given ID
  axios.get('https://api.zippopotam.us/us/33162')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });

  win.loadURL(arg);
}

function switchOnCharger(check) {
  let apiurl = ls.get('apiurltoopen');
  switch (true) {
    case check === 'phoneon':
       // Make a request for a user with a given ID
        axios.get('https://api.zippopotam.us/us/33162') //apiurl
        .then(function (response) {
          // handle success
          console.log(response);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          // always executed
        });
      
      break;
    case check === 'phoneoff':

      // Make a request for a user with a given ID
      axios.get('https://api.zippopotam.us/us/33162') //apiurl
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });  
    
      break;
    case check === 'lapyon':
      // Make a request for a user with a given ID
      axios.get('https://api.zippopotam.us/us/33162') //apiurl
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
      break;
    case check === 'lapyoff':
      // Make a request for a user with a given ID
      axios.get('https://api.zippopotam.us/us/33162') //apiurl
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
      break;      
  
    default:
      break;
  }
 

}

function checklevelAndCallApi(level,charging){
  switch (true) {
    case parseInt(level) > 95 && charging === true:

      switchOnCharger('lapyoff')
      break;
    case parseInt(level) < 20 && charging === false:

      switchOnCharger('lapyon')
      break;  
  
    default:
      break;
  }
}

app.on('before-quit', function () {
  isQuiting = true;
});

function createWindow () {
  tray = new Tray(path.join(__dirname, 'tray.png'));

  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Show App', click: function () {
        mainWindow.show();
      }
    },
    {
      label: 'Quit', click: function () {
        isQuiting = true;
        app.quit();
      }
    }
  ]));

  mainWindow = new BrowserWindow({
    width: 800,
    height: 300,
    frame: true,
    show: true,
    fullscreenable: false,
    movable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.on('close', function (event) {
    if (!isQuiting) {
      event.preventDefault();
      mainWindow.hide();
      event.returnValue = false;
    }
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Receive async message from renderer
// See file renderer.js on line 3
ipcMain.on('ping-good', event => {
  // It's so good because below have a delay 5s to execute, and this don't lock rendereder :)
  setTimeout(() => {
    batteryLevel().then(levelBattery => {
        console.log(levelBattery);
        //=> 0.55
        level = levelBattery;
        isCharging().then(result => {
            console.log(result);
            //=> true
            charging = result;
             // Send reply to a renderer
            let levelres = (level * 100) + '%';
            checklevelAndCallApi(levelres,charging);
            event.sender.send('ping-good-reply', levelres+'~'+charging)
        });
    });
    console.log('GOOD finshed!')
    
   
  }, 5000)
})

// Receive sync message from renderer
// See file renderer.js on line 18
ipcMain.on('ping-bad', event => {
  // It's so bad because below have a delay 5s to execute, meanwhile the renderer stay locked :(
  setTimeout(() => {
    level++;
    console.log('BAD finshed!')
    event.returnValue = 'pong'+level
  }, 1000)
})

ipcMain.on('open-settings', (event,arg) => {
  createBrowserWindow(arg);
})

