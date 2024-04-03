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
  // Define Tailwind CSS colors at shade 400
  const colors = [
    'bg-blue-500 dark:bg-blue-800',
    'bg-green-500 dark:bg-green-800',
    'bg-yellow-500 dark:bg-yellow-800',
    'bg-red-500 dark:bg-red-800',
    'bg-indigo-500 dark:bg-indigo-800',
    'bg-purple-500 dark:bg-purple-800',
    'bg-pink-500 dark:bg-pink-800',
    'bg-teal-500 dark:bg-teal-800',
    'bg-orange-500 dark:bg-orange-800',
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

export function getTeamColor(name: string, background = false): string {
  // Define Tailwind CSS colors at shade 400
  const colors = [
    'text-blue-500',
    'text-purple-500',
    'text-green-500',
    'text-red-500',
    'text-indigo-500',
    'text-teal-500',
    'text-orange-500',
  ];

  const bgColors = [
    'bg-blue-500/10',
    'bg-purple-500/10',
    'bg-green-500/10',
    'bg-red-500/10',
    'bg-indigo-500/10',
    'bg-teal-500/10',
    'bg-orange-500/10',
  ];

  // Generate a hash value for the input name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Ensure hash value is within the range of colors array
  const index = Math.abs(hash) % colors.length;

  return background ? bgColors[index] : colors[index];
}
