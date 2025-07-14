import * as vscode from 'vscode';
import { addTIL } from './commands/addTIL';
import { viewTIL } from './commands/viewTIL';
import { ReminderManager } from './reminder';

let reminderManager: ReminderManager | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('TIL++ is active!');

  reminderManager = new ReminderManager(context);

  context.subscriptions.push(
    vscode.commands.registerCommand('tilpp.addTIL', () => addTIL(context)),
    vscode.commands.registerCommand('tilpp.viewTILs', () => viewTIL(context))
  );

  // Start reminder loop
  reminderManager.start();

  // Restart reminder when config changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('tilpp')) {
        reminderManager?.start();
      }
    })
  );

  // Status bar item
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = '$(lightbulb) TIL';
  statusBarItem.command = 'tilpp.addTIL';
  statusBarItem.tooltip = 'Add a new TIL';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
}

export function deactivate() {
  reminderManager?.stop();
}