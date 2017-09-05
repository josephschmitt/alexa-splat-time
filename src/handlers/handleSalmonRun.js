import axios from 'axios';
import echolocate from 'echolocate';
import moment from 'moment-timezone';

const SALMON_RUN_URL = 'http://splatooniverse.com/ajax/get-salmon.php';

export default async function handleSalmonRun(req, resp) {
  let timeZoneId;

  try {
    const session = req.getSession();
    const consentToken = session.details.user.permissions.consentToken;
    const deviceId = req.context.System.device.deviceId;
    const location = await echolocate(deviceId, {consentToken});

    timeZoneId = location.timezone.timeZoneId;
  } catch (e) {
    // Will default to GMT
  }

  const {data} = await axios.get(SALMON_RUN_URL);

  const [nextRun] = data.runs;
  return resp.say(`Salmon Run is live from ${formatTime(nextRun.start, timeZoneId)} until` +
      formatTime(nextRun.end, timeZoneId));
}

/**
 * Takes a time string received from the Salmon Run schedule API and formats it so for Alexa to
 * respond with.
 *
 * @param {String} timeStr
 * @returns {String}
 */
function formatTime(timeStr, timeZoneId = '') {
  const date = moment(timeStr, 'HH:mm Do MMMM').tz(timeZoneId);
  return `${date.format('dddd, MMMM Do')} at ${date.format('ha')}`;
}
