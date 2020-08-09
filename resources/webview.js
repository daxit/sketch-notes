// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', e => {
  e.preventDefault();
});

// call the plugin from the webview
var actions = document.getElementsByClassName('action');
for (let i = 0; i < actions.length; i++) {
  actions[i].addEventListener('click', () => {
    // document.getElementById('answer').innerHTML = 'Action Taken: ' + actions[i].id + ' Comment(s)';
    window.postMessage(actions[i].id, 'Action Taken: ' + actions[i].id + ' Comment(s)');
  });
}

document.getElementById('close').addEventListener('click', () => {
  window.postMessage('close', 'Window closed.');
});

// call the webview from the plugin
// window.setRandomNumber = (randomNumber) => {
//   document.getElementById('answer').innerHTML = 'Random number from the plugin: ' + randomNumber
// }
