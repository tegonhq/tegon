/** Copyright (c) 2024, Tegon, all rights reserved. **/

export function generateHexColor(): string {
  // Generate a random number between 0 and 16777215 (FFFFFF in decimal)
  const randomColor = Math.floor(Math.random() * 16777215);

  // Convert the decimal color to hexadecimal and pad with zeros if necessary
  const hexColor = randomColor.toString(16).padStart(6, '0');

  // Return the hex color with a '#' prefix
  return `#${hexColor}`;
}
