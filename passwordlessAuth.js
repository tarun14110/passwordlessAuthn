

// var passwordlessAuth = document.getElementById('enablePasswordlessAuth');

//on init update the UI checkbox based on storage
// chrome.storage.sync.get('passwordlessAuth', function(data) {
//   passwordlessAuth.checked=data.hide;
// });

// passwordlessAuth.onchange = function(element) {
//   let value = this.checked;

//   //update the extension storage value
//   chrome.storage.sync.set({'passwordlessAuth': value}, function() {
//     console.log('The value is'+ value);
//   });

//   //Pass init or remove message to content script 
//   if(value){
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, {command: "init", passwordlessAuth: value}, function(response) {
//                     console.log(response.result);
//                 });
//     });
//   }else{
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, {command: "remove", passwordlessAuth: value}, function(response) {
//                     console.log(response.result);
//       });
//     });
//   }

// };

