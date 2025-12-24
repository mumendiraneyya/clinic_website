/**
 * Arabic language utilities for server-side (TypeScript) use.
 * For client-side usage, see public/scripts/arabic-utils.js
 */

type ArabicPluralForms = [string, string, string, string];

/**
 * Describes a count using Arabic plural forms.
 * @param count - The number to describe
 * @param forms - [singular, dual, plural (3-10), plural (11+)]
 * @returns The count with appropriate Arabic form
 */
export function describeArabicCount(count: number, forms: ArabicPluralForms): string {
  const n = Math.floor(count);
  const [singular, dual, pluralUpToTen, pluralMoreThanTen] = forms;
  const arabicNumerals = n.toLocaleString('ar-JO');

  if (n <= 0) {
    return '';
  } else if (n === 1) {
    return singular;
  } else if (n === 2) {
    return dual;
  } else if (n < 11) {
    return `${arabicNumerals} ${pluralUpToTen}`;
  } else {
    return `${arabicNumerals} ${pluralMoreThanTen}`;
  }
}

/**
 * Returns a description of the number of posts in Arabic.
 * @param count - The number of posts
 * @returns A string describing the number of posts in Arabic
 */
export function describeNumberOfPosts(count: number): string {
  if (count <= 0) return '';
  return describeArabicCount(count, ['منشور واحد', 'منشوران اثنان', 'منشورات', 'منشورًا']);
}

/**
 * Returns a title describing the number of bookings in Arabic.
 * @param count - The number of bookings
 * @returns A string describing the number of bookings in Arabic
 */
export function describeNumberOfBookings(count: number): string {
  if (count === 0) {
    return 'لا توجد عندك حجوزات';
  }
  return 'عندك ' + describeArabicCount(count, ['حجز واحد', 'حجزان اثنان', 'حجوزات', 'حجزًا']);
}

/**
 * Describes a duration in seconds as Arabic text.
 * @param seconds - Duration in seconds
 * @param accusative - Use accusative case for dual forms (default: true)
 * @returns Human-readable Arabic duration
 */
export function describeDuration(seconds: number, accusative = true): string {
  let minutes = 0;
  let hours = 0;
  let days = 0;

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

  let componentsAdded = 0;
  const hasEnoughComponents = () => componentsAdded >= 2;
  const addConjunction = (desc: string) => (desc ? desc + ' و' : '');

  let description = '';

  if (days > 0 && !hasEnoughComponents()) {
    componentsAdded++;
    const dayValue = hasEnoughComponents() ? Math.round(days) : Math.floor(days);
    description = addConjunction(description) + describeArabicCount(dayValue, [
      'يوم',
      accusative ? 'يومان' : 'يومين',
      'أيام',
      'يومًا',
    ]);
  }

  if (hours > 0 && !hasEnoughComponents()) {
    componentsAdded++;
    const hourValue = hasEnoughComponents() ? Math.round(hours) : Math.floor(hours);
    description = addConjunction(description) + describeArabicCount(hourValue, [
      'ساعة',
      accusative ? 'ساعتان' : 'ساعتين',
      'ساعات',
      'ساعة',
    ]);
  }

  if (minutes > 0 && !hasEnoughComponents()) {
    componentsAdded++;
    const minuteValue = hasEnoughComponents() ? Math.round(minutes) : Math.floor(minutes);
    description = addConjunction(description) + describeArabicCount(minuteValue, [
      'دقيقة',
      accusative ? 'دقيقتان' : 'دقيقتين',
      'دقائق',
      'دقيقة',
    ]);
  }

  if (seconds > 0 && !hasEnoughComponents()) {
    componentsAdded++;
    const secondValue = hasEnoughComponents() ? Math.round(seconds) : Math.floor(seconds);
    description = addConjunction(description) + describeArabicCount(secondValue, [
      'ثانية',
      accusative ? 'ثانيتان' : 'ثانيتين',
      'ثوانٍ',
      'ثانية',
    ]);
  }

  return description || 'فترة معدومة';
}

/**
 * Describes the time difference between a date and a reference point.
 * @param date - Target date or timestamp in milliseconds
 * @param reference - Reference date or timestamp (default: now)
 * @param label - Optional label for the reference point
 * @returns Human-readable Arabic relative time description
 */
export function describeRelativeTime(
  date: Date | number,
  reference: Date | number = new Date(),
  label = ''
): string {
  const referenceInSeconds =
    typeof reference === 'number' ? reference / 1000 : reference.getTime() / 1000;
  const dateInSeconds =
    typeof date === 'number' ? date / 1000 : date.getTime() / 1000;
  const differenceInSeconds = dateInSeconds - referenceInSeconds;

  if (differenceInSeconds > 0) {
    // Future
    if (label) {
      return `${describeDuration(differenceInSeconds, false)} بعد ${label}`;
    } else {
      return 'بعد ' + describeDuration(differenceInSeconds, false);
    }
  } else if (differenceInSeconds < 0) {
    // Past
    if (label) {
      return `${describeDuration(-differenceInSeconds, false)} قبل ${label}`;
    } else {
      return 'قبل ' + describeDuration(-differenceInSeconds, false);
    }
  } else {
    // Exact match
    if (label) {
      return `في ${label} بالضبط`;
    } else {
      return 'في هذه اللحظة بالضبط';
    }
  }
}