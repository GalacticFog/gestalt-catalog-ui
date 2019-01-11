export function truncate(string, at, trailing = '...') {
  if (string) {
    if (string.length < at) {
      return string;
    }

    return `${string.substring(0, at).trim()}${trailing}`;
  }

  return string;
}
