/** Copyright (c) 2024, Tegon, all rights reserved. **/

export function generateHexColor(): string {
  // Generate a random number between 0 and 16777215 (FFFFFF in decimal)
  const randomColor = Math.floor(Math.random() * 16777215);

  // Convert the decimal color to hexadecimal and pad with zeros if necessary
  const hexColor = randomColor.toString(16).padStart(6, '0');

  // Return the hex color with a '#' prefix
  return `#${hexColor}`;
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
  const bgColors = [
    'bg-[#89C794]',
    'bg-[#89C794]',
    'bg-[#D2A1BB]',
    'bg-[#89C794]',
    'bg-[#89C794]',
  ];

  // Generate a hash value for the input name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Ensure hash value is within the range of colors array
  const index = Math.abs(hash) % bgColors.length;

  return bgColors[index];
}
