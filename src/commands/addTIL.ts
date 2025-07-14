import * as vscode from 'vscode';
import { TIL } from '../types';
import { TILStorage } from '../storage';
import { v4 as uuidv4 } from 'uuid';

export async function addTIL(context: vscode.ExtensionContext) {
  const storage = new TILStorage(context);

  const content = await vscode.window.showInputBox({
    prompt: 'What did you learn today?',
    placeHolder: 'e.g. TanStack Table rowSelectionStateRef usage',
    validateInput: (value) => {
      if (!value.trim()) {
        return 'Please enter something you learned';
      }
      return null;
    }
  });

  if (!content) {
    return;
  }

  const til: TIL = {
    id: uuidv4(),
    content: content.trim(),
    createdAt: new Date().toISOString()
  };

  try {
    await storage.addTIL(til);
    
    const selection = await vscode.window.showInformationMessage(
      `TIL logged! 📝`,
      'View All', 'Add Another'
    );

    if (selection === 'View All') {
      vscode.commands.executeCommand('tilpp.viewTILs');
    } else if (selection === 'Add Another') {
      vscode.commands.executeCommand('tilpp.addTIL');
    }
  } catch (err: any) {
    vscode.window.showErrorMessage(`Failed to save TIL: ${err.message}`);
  }
}