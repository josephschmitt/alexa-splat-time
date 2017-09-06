const responses = [
  'Booyah',
  'Always booyah back'
];

export default function handleBooyah(req, resp) {
  return resp.say(responses[Math.floor(Math.random() * responses.length)])
}
