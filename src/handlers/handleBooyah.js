const responses = [
  'Booyah',
  'Always booyah back',
  'Never squid-bag in anger, only in celebration'
];

export default function handleBooyah(req, resp) {
  return resp.say(responses[Math.floor(Math.random() * responses.length)])
}
