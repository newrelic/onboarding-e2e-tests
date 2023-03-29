const fs = require('fs');

fs.unlink('e2e/sessions/storageState.json', (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('login session deleted successfully');
});


/* To run this file `node helpers/clearSession.js` */ 