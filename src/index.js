import Alexa from 'alexa-app';

import handleBooyah from './handlers/handleBooyah.js';
import handleSalmonRun from './handlers/handleSalmonRun.js';

const app = new Alexa.app('splat-time');

app.intent('Booyah', handleBooyah);
app.intent('SalmonRun', handleSalmonRun);

app.post = function (request, response, type, exception) {
  if (exception) {
    // Always turn an exception into a successful response
    response.clear().say('An error occured: ' + exception);
  }
}

export const handler = app.lambda();
