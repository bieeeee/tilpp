import { TIL } from "./types";

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
}

export function formatDetail(til: TIL): string {
  const parts = [] as any[];
  return parts.join(' | ');
}

export function formatTILForExport(til: TIL): string {
  let text = `${til.content}\n`;
  text += `Date: ${new Date(til.createdAt).toLocaleString()}`;
  return text;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function getTILHtml(tils: { content: string; createdAt: string }[]): string {
  const listItems = tils
    .map(
      (til) => `
      <li style="margin-bottom: 1em;">
        <div><strong>${new Date(til.createdAt).toLocaleString()}</strong></div>
        <div>${escapeHtml(til.content)}</div>
      </li>`
    )
    .join('\n');

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>TIL++</title>
  </head>
  <body>
    <h2>TIL++ 📝 What You’ve Learned</h2>
    <ul style="list-style: none; padding: 0;">${listItems}</ul>
  </body>
  </html>`;
}