import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import { TIL } from './types';

export class TILStorage {
  private tilsPath: string;

  constructor(private context: vscode.ExtensionContext) {
    this.tilsPath = path.join(context.globalStorageUri.fsPath, 'tils.json');
  }

  async ensureStorage(): Promise<void> {
    await fs.mkdir(this.context.globalStorageUri.fsPath, { recursive: true });
  }

  async getTILs(): Promise<TIL[]> {
    try {
      await this.ensureStorage();
      const data = await fs.readFile(this.tilsPath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
        return [];
      }
      if (err instanceof SyntaxError) {
        console.error('Corrupted TIL file, returning empty array');
        return [];
      }
      throw err;
    }
  }

  async saveTILs(tils: TIL[]): Promise<void> {
    await this.ensureStorage();
    
    const tempPath = `${this.tilsPath}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(tils, null, 2), 'utf-8');
    await fs.rename(tempPath, this.tilsPath);
  }

  async addTIL(til: TIL): Promise<void> {
    const tils = await this.getTILs();
    tils.unshift(til);
    await this.saveTILs(tils);
  }
}