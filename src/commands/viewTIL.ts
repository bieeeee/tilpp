import * as vscode from 'vscode';
import * as fs from 'fs';

export function viewTIL(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    'tilppView',
    '🧠 TIL++',
    vscode.ViewColumn.One,
    {
      enableScripts: true
    }
  );

  const tilFile = vscode.Uri.joinPath(context.globalStorageUri, 'tils.json').fsPath;

  let tilData: { content: string; createdAt: string }[] = [];

  try {
    if (fs.existsSync(tilFile)) {
      const raw = fs.readFileSync(tilFile, 'utf-8');
      tilData = JSON.parse(raw);
    }
  } catch (err: any) {
    console.error(err);
  }

  const htmlContent = getTILHtml(tilData);
  panel.webview.html = htmlContent;
}


function getTILHtml(tils: { content: string; createdAt: string }[]): string {
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}