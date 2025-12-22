/**
 * Returns a description of the number of posts in Arabic.
 * @param count - The number of posts
 * @returns A string describing the number of posts in Arabic
 */
export function describeNumberOfPosts(count: number): string {
  if (count <= 0) return '';

  const arabicNumerals = count.toLocaleString('ar-JO');
  if (count === 1) {
    return 'منشور واحد';
  }
  else if (count === 2) {
    return 'منشوران اثنان';
  }
  else if (count <= 10) {
    return `${arabicNumerals} منشورات`;
  }
  else {
    return `${arabicNumerals} منشوراً`;
  }
}
