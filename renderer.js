const { ipcRenderer } = require('electron')

// GOOD
// document.getElementById('ping-good').onclick = () => {
//   // Send a IPC async message to electron
//   // See main.js on line 31
//   ipcRenderer.send('ping-good', 'ping')
//   document.getElementById('ping-good-response').innerText = 'Waiting..'
// }

// BAD
// document.getElementById('ping-bad').onclick = () => {
//   // Send a IPC sync message to electron
//   // See main.js on line 42
//   document.getElementById('ping-bad-response').innerText = ipcRenderer.sendSync('ping-bad', 'ping')
// }

// Receive reply from elecron
// See file main.js on line 37

ipcRenderer.on('ping-good-reply', (event, response) => {
  let data = response.split('~');
  document.getElementById('ping-good-response').innerText = data[0]
  document.getElementById('ping-bad-response').innerText = data[1]
})

setTimeout(() => {
  ipcRenderer.send('ping-good', 'ping')
  //document.getElementById('ping-good-response').innerText = 'Waiting..'
  //document.getElementById('ping-bad-response"').innerText = 'Waiting..'
}, 1000)



setInterval(() => {
  ipcRenderer.send('ping-good', 'ping')
  //document.getElementById('ping-good-response').innerText = 'Waiting..'
  //document.getElementById('ping-bad-response"').innerText = 'Waiting..'
}, 5000)

document.getElementById('open-settings').onclick = () => {
  // Send a IPC async message to electron
  // See main.js on line 31
  ipcRenderer.send('open-settings', 'ping')
}
