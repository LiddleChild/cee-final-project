let storage = [];

const getEpochTime = () => Math.floor(new Date().getTime() / 1000);

exports.cache = (key, value, lifetime) => {
  let currentEpoch = getEpochTime();

  storage[key] = {
    value,
    expired: currentEpoch + lifetime,
  };
};

exports.get = (key) => {
  if (storage[key] && getEpochTime() < storage[key].expired) return storage[key].value;
  return undefined;
};
