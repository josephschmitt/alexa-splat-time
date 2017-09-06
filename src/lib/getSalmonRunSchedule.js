import axios from 'axios';
import config from 'config';
import moment from 'moment-timezone';

const GOOGLE_API_KEY = config.get('splatTime.googleApiKey');
const SALMON_RUN_URL = `https://www.googleapis.com/calendar/v3/calendars/7e5g474p0ng7vaejkg3mkomhks@group.calendar.google.com/events?key=${GOOGLE_API_KEY}`

export const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

/**
 * Gets a list of Salmon Run times
 *
 * @param {Boolean} returnAll -- Whether to return all items in the schedule. If true, will return
 *     runs that have already occured.
 * @returns {Array<{startTime: String, endTime: String}>}
 */
export default async function getSalmonRunSchedule(returnAll) {
  const {data} = await axios.get(SALMON_RUN_URL);

  return data.items.map((item) => {
    return {
      startTime: item.start.dateTime,
      endTime: item.end.dateTime,
    };
  }).filter((run) => { // Only return runs that haven't ended already
    return returnAll || moment(run.endTime, DATE_FORMAT).isAfter(new Date());
  });
}
