/**
 * Arabic language utilities for client-side scripts
 */

/**
 * Describes a count using Arabic plural forms.
 * @param {number} count - The number to describe
 * @param {[string, string, string, string]} forms - [singular, dual, plural (3-10), plural (11+)]
 * @returns {string} The count with appropriate Arabic form
 */
function describeArabicCount(count, forms) {
  var n = Math.floor(count);
  var singular = forms[0];
  var dual = forms[1];
  var pluralUpToTen = forms[2];
  var pluralMoreThanTen = forms[3];

  if (n <= 0) {
    return '';
  } else if (n === 1) {
    return singular;
  } else if (n === 2) {
    return dual;
  } else if (n < 11) {
    return n.toLocaleString('ar-JO') + ' ' + pluralUpToTen;
  } else {
    return n.toLocaleString('ar-JO') + ' ' + pluralMoreThanTen;
  }
}

/**
 * Returns a title describing the number of bookings in Arabic.
 * @param {number} count - The number of bookings
 * @returns {string} A string describing the number of bookings in Arabic
 */
function describeNumberOfBookings(count) {
  if (count === 0) {
    return 'لا توجد عندك حجوزات';
  }
  return 'عندك ' + describeArabicCount(count, ['حجز واحد', 'حجزان اثنان', 'حجوزات', 'حجزًا']);
}

/**
 * Describes a duration in seconds as Arabic text.
 * @param {number} seconds - Duration in seconds
 * @param {boolean} [accusative=true] - Use accusative case for dual forms
 * @returns {string} Human-readable Arabic duration
 */
function describeDuration(seconds, accusative) {
  if (accusative === undefined) accusative = true;

  var minutes = 0;
  var hours = 0;
  var days = 0;

  if (seconds >= 60) {
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
  }
  if (minutes >= 60) {
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
  }
  if (hours >= 24) {
    days = Math.floor(hours / 24);
    hours = hours % 24;
  }

  // Track how many time components have been added to the description
  var componentsAdded = 0;

  // Check if we have enough components (2 is sufficient)
  function hasEnoughComponents() {
    return componentsAdded >= 2;
  }

  // Add conjunction if there's a previous description
  function addConjunction(desc) {
    return desc ? desc + ' و' : '';
  }

  var description = '';

  if (days > 0 && !hasEnoughComponents()) {
    componentsAdded++;
    var dayValue = hasEnoughComponents() ? Math.round(days) : Math.floor(days);
    description = addConjunction(description) + describeArabicCount(dayValue, [
      'يوم',
      accusative ? 'يومان' : 'يومين',
      'أيام',
      'يومًا'
    ]);
  }

  if (hours > 0 && !hasEnoughComponents()) {
    componentsAdded++;
    var hourValue = hasEnoughComponents() ? Math.round(hours) : Math.floor(hours);
    description = addConjunction(description) + describeArabicCount(hourValue, [
      'ساعة',
      accusative ? 'ساعتان' : 'ساعتين',
      'ساعات',
      'ساعة'
    ]);
  }

  if (minutes > 0 && !hasEnoughComponents()) {
    componentsAdded++;
    var minuteValue = hasEnoughComponents() ? Math.round(minutes) : Math.floor(minutes);
    description = addConjunction(description) + describeArabicCount(minuteValue, [
      'دقيقة',
      accusative ? 'دقيقتان' : 'دقيقتين',
      'دقائق',
      'دقيقة'
    ]);
  }

  if (seconds > 0 && !hasEnoughComponents()) {
    componentsAdded++;
    var secondValue = hasEnoughComponents() ? Math.round(seconds) : Math.floor(seconds);
    description = addConjunction(description) + describeArabicCount(secondValue, [
      'ثانية',
      accusative ? 'ثانيتان' : 'ثانيتين',
      'ثوانٍ',
      'ثانية'
    ]);
  }

  return description || 'فترة معدومة';
}

/**
 * Describes the time difference between a date and a reference point.
 * @param {Date|number} date - Target date or timestamp in milliseconds
 * @param {Date|number} [reference=new Date()] - Reference date or timestamp
 * @param {string} [label=''] - Optional label for the reference point
 * @returns {string} Human-readable Arabic relative time description
 */
function describeRelativeTime(date, reference, label) {
  if (reference === undefined) reference = new Date();
  if (label === undefined) label = '';

  var referenceInSeconds =
    typeof reference === 'number' ? reference / 1000 : reference.getTime() / 1000;
  var dateInSeconds =
    typeof date === 'number' ? date / 1000 : date.getTime() / 1000;
  var differenceInSeconds = dateInSeconds - referenceInSeconds;

  if (differenceInSeconds > 0) {
    // Future
    if (label) {
      return describeDuration(differenceInSeconds, false) + ' بعد ' + label;
    } else {
      return 'بعد ' + describeDuration(differenceInSeconds, false);
    }
  } else if (differenceInSeconds < 0) {
    // Past
    if (label) {
      return describeDuration(-differenceInSeconds, false) + ' قبل ' + label;
    } else {
      return 'قبل ' + describeDuration(-differenceInSeconds, false);
    }
  } else {
    // Exact match
    if (label) {
      return 'في ' + label + ' بالضبط';
    } else {
      return 'في هذه اللحظة بالضبط';
    }
  }
}

// Export to window for use in inline scripts
window.describeArabicCount = describeArabicCount;
window.describeNumberOfBookings = describeNumberOfBookings;
window.describeDuration = describeDuration;
window.describeRelativeTime = describeRelativeTime;