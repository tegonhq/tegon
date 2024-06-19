/** Copyright (c) 2024, Tegon, all rights reserved. **/

/**
 * Generates an OKLCH color string with fixed lightness, chroma, and a random hue.
 * @returns {string} - The generated OKLCH color string.
 */
export function generateOklchColor(): string {
  // Generate a random number between 30 and 360 for the hue
  const hue = Math.floor(Math.random() * (360 - 30 + 1)) + 30;

  // Fixed lightness and chroma values
  const lightness = 66;
  const chroma = 0.1835;

  // Construct the OKLCH color string
  const oklchColor = `oklch(${lightness}% ${chroma} ${hue})`;

  return oklchColor;
}

export function getTailwindColor(name: string): string {
  const colors = [
    '#B56455',
    '#7B8A34',
    '#1C91A8',
    '#886DBC',
    '#AD6E30',
    '#54935B',
    '#4187C0',
    '#A165A1',
    '#997D1D',
    '#2B9684',
    '#2B9684',
    '#B0617C',
  ];

  // Generate a hash value for the input name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Ensure hash value is within the range of colors array
  const index = Math.abs(hash) % colors.length;

  return colors[index];
}

export function getTeamColor(name: string): string {
  const bgColors = ['bg-[#89C794]', 'bg-[#90C5D6]', 'bg-[#D2A1BB]'];

  // Generate a hash value for the input name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 3) - hash);
  }

  // Ensure hash value is within the range of colors array
  const index = Math.abs(hash) % bgColors.length;

  return bgColors[index];
}
