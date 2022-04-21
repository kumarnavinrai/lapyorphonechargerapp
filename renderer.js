const { ipcRenderer } = require('electron')
let $ = require( "jquery" );
let ls = require('local-storage');

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

// document.getElementById('open-settings').onclick = () => {
//   // Send a IPC async message to electron
//   // See main.js on line 31
//   ipcRenderer.send('open-settings', 'ping')
// }

function isUrlValid(url) {
  return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

$( "#open-settings" ).on( "click", function( event ) {
  ls.set('urltoopen', ls.get('urltoopen'));
  $("#urltbox").show();
  $( "#open-settings" ).hide();
  $("#save-settings").show();
  $("#urltbox").val(ls.get('urltoopen'))
});

$( "#save-settings" ).on( "click", function( event ) {
  if(!isUrlValid($("#urltbox").val())){
    event.preventDefault();
    alert('Url not valid!')
    return false;
  }
  ls.set('urltoopen', $("#urltbox").val());
  $("#urltbox").hide();
  $( "#open-settings" ).show();
  $("#save-settings").hide();
  ipcRenderer.send('open-settings', $("#urltbox").val())
  
});
