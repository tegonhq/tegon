export function toProperCase(text: string) {
  return text.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function convertToTitleCase(input: string): string {
  return input
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getTiptapJSON(input: string) {
  try {
    const parsedInput = JSON.parse(input);

    return JSON.stringify(parsedInput.json);
  } catch (e) {
    return undefined;
  }
}
