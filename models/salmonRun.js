module.exports = {
  name: 'SalmonRun',
  slots: [
    {
      name: 'startOrEnd',
      type: 'StartOrEnd',
      samples: []
    }
  ],
  samples: [
    'when salmon run is{ next| on| happening}',
    'when is {the next |}salmon run{ next| on| happening}',
    'when {the next |}salmon run is',
    'when does salmon run {-|startOrEnd}',
    'when salmon run {-|startOrEnd}'
  ]
};
