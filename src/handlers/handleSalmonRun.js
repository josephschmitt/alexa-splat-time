import echolocate from 'echolocate';
import moment from 'moment-timezone';

import getSalmonRunSchedule, {DATE_FORMAT} from '../lib/getSalmonRunSchedule.js';

export default async function handleSalmonRun(req, resp) {
  const startOrEnd = req.slot('startOrEnd');
  const isReqStart = /start(s)?/.test(startOrEnd);
  const isReqEnd = /end(s)?/.test(startOrEnd);
  let timeZoneId = 'GMT';

  try {
    const session = req.getSession();
    const consentToken = session.details.user.permissions.consentToken;
    const deviceId = req.context.System.device.deviceId;
    const location = await echolocate(deviceId, {consentToken});

    timeZoneId = location.timezone.timeZoneId;
  } catch (e) {
    // Will default to GMT
  }

  const runs = await getSalmonRunSchedule();

  if (!runs.length) {
    resp.say('Sorry, no Salmon Run scheduled times found.');
  }

  const {startTime, endTime} = runs[0];
  const formattedStart = formatTime(startTime, timeZoneId);
  const formattedEnd = formatTime(endTime, timeZoneId);

  let respText = 'Salmon Run ';
  const isOnNow = !moment(startTime).isAfter(new Date());

  if (isOnNow) {
    if (isReqStart) {
      respText += `is on now!`;
    } else if (!isReqEnd) {
      respText += `is on now until `;
    }
  } else {
    if (isReqStart) {
      respText += `starts on ${formattedStart} `;
    } else if (!isReqEnd) {
      respText += `will start on ${formattedStart} and end on `;
    }
  }

  if (isReqEnd) {
    respText += `ends on ${formattedEnd}`;
  } else if (!isReqStart) {
    respText += formattedEnd;
  }

  return resp
    .say(respText)
    .card({
      type: 'Simple',
      title: 'Salmon Run Schedule',
      content: `${isOnNow ? `Live Now!\n${formattedStart} – ${formattedEnd}` : ''}
---
Up-coming
${formatRuns(runs, timeZoneId, isOnNow)}`,
    });
}

/**
 * Takes a time string received from the Salmon Run schedule API and formats it so for Alexa to
 * respond with.
 *
 * @param {String} timeStr
 * @returns {String}
 */
function formatTime(timeStr, timeZoneId) {
  let date = moment(timeStr, DATE_FORMAT);
  if (timeZoneId) {
    date = date.tz(timeZoneId);
  }

  // If within 7 days, no need to give the full date
  const nextWeek = date.clone().add(6, 'days');
  if (date.isSameOrBefore(nextWeek)) {
    return `${date.format('dddd')} at ${date.format('ha')}`;
  }

  return `${date.format('dddd, MMMM Do')} at ${date.format('ha')}`;
}

function formatRuns(runs, timeZoneId, isOnNow) {
  return runs.map(({startTime, endTime}) => {
    return `${formatTime(startTime, timeZoneId)} – ${formatTime(endTime, timeZoneId)}`;
  })
  .filter((item, index) => isOnNow ? index > 0 : true)
  .join('\n');
}
