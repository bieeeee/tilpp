import * as vscode from 'vscode';
import { TILConfig } from './types';

export class ReminderManager {
  private intervalId?: NodeJS.Timeout;
  
  constructor(private context: vscode.ExtensionContext) {}

  start() {
    this.stop();
    
    const config = vscode.workspace.getConfiguration('tilpp') as unknown as TILConfig;
    const interval = config.reminderInterval;
    
    if (interval === 'never') {
      console.log('TIL reminders disabled');
      return;
    }

    const minutes = Number(interval);
    if (isNaN(minutes) || minutes < 1) {
      return;
    }

    this.intervalId = setInterval(() => {
      this.showReminder();
    }, minutes * 60 * 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private async showReminder() {
    const selection = await vscode.window.showInformationMessage(
      '🧠 Ready to log something you learned?',
      'Add TIL', 
      'View Recent'
    );

    if (selection === 'Add TIL') {
      vscode.commands.executeCommand('tilpp.addTIL');
    } else if (selection === 'View Recent') {
      vscode.commands.executeCommand('tilpp.viewTILs');
    }
  }
}