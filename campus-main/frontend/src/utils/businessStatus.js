const parseTimeToMinutes = (time) => {
  if (!time || !time.includes(':')) {
    return null;
  }

  const [hours, minutes] = time.split(':').map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
};

export const formatBusinessHours = (business) => {
  if (!business.openingTime || !business.closingTime) {
    return 'Hours unavailable';
  }

  return `${business.openingTime} - ${business.closingTime}`;
};

export const getBusinessStatus = (business) => {
  const opening = parseTimeToMinutes(business.openingTime);
  const closing = parseTimeToMinutes(business.closingTime);

  if (opening === null || closing === null) {
    return {
      label: 'Hours unavailable',
      isOpen: null,
      hoursText: formatBusinessHours(business)
    };
  }

  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const isOpen = opening === closing
    ? true
    : opening < closing
      ? current >= opening && current < closing
      : current >= opening || current < closing;

  return {
    label: isOpen ? 'Open' : 'Closed',
    isOpen,
    hoursText: formatBusinessHours(business)
  };
};
