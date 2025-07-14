import * as vscode from 'vscode';
import * as fs from 'fs';
import { getTILHtml } from '../utils';

export async function viewTIL(context: vscode.ExtensionContext) {

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