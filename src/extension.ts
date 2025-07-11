import * as vscode from 'vscode';
import { addTIL } from './commands/addTIL';
import { viewTIL } from './commands/viewTIL';

export function activate(context: vscode.ExtensionContext) {
  console.log('TIL++ is active!');

  context.subscriptions.push(
		vscode.commands.registerCommand('tilpp.addTIL', () => addTIL(context)),
    vscode.commands.registerCommand('tilpp.viewTILs', () => viewTIL(context))
	);
}

export function deactivate() {}

