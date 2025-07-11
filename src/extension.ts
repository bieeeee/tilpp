import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  console.log('TIL++ is active!');

  const disposable = vscode.commands.registerCommand('tilpp.addTIL', async () => {
		setInterval(() => {
			remindToAddTIL(context);
		}, 10 * 1000);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

async function remindToAddTIL(context: vscode.ExtensionContext) {
  const selection = await vscode.window.showInformationMessage(
    '🧠 Ready to log something you learned?',
    'Add TIL'
  );

  if (selection === 'Add TIL') {
    await promptTILInput(context);
  }
}

async function promptTILInput(context: vscode.ExtensionContext) {
  const input = await vscode.window.showInputBox({
    prompt: 'What did you learn today?',
    placeHolder: 'e.g. TanStack Table rowSelectionStateRef usage',
  });

  if (!input || input.trim() === '') {
    vscode.window.showWarningMessage('No TIL entered. Cancelled.');
    return;
  }

  const tilData = {
    content: input.trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    const storageFolder = context.globalStorageUri.fsPath;
    const tilFile = vscode.Uri.joinPath(context.globalStorageUri, 'tils.json').fsPath;

    fs.mkdirSync(storageFolder, { recursive: true });

    let existing: any[] = [];
    if (fs.existsSync(tilFile)) {
      const raw = fs.readFileSync(tilFile, 'utf-8');
      existing = JSON.parse(raw);
    }

    existing.unshift(tilData);
    fs.writeFileSync(tilFile, JSON.stringify(existing, null, 2), 'utf-8');

    vscode.window.showInformationMessage('✅ TIL saved!');
  } catch (err: any) {
    console.error(err);
    vscode.window.showErrorMessage(`❌ Failed to save TIL: ${err.message}`);
  }
}
