import * as vscode from 'vscode';
import { TILStorage } from '../storage';
import { TIL } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class GitIntegration {
  private gitApi: any;
  
  constructor(
    private context: vscode.ExtensionContext,
    private storage: TILStorage
  ) {}

  async initialize() {
    const gitExtension = vscode.extensions.getExtension('vscode.git');

    if (!gitExtension) {
      console.log('Git extension not found');
      return;
    }

    const git = gitExtension.isActive 
      ? gitExtension.exports 
      : await gitExtension.activate();
    
    this.gitApi = git.getAPI(1);

    // Check existing repositories
    this.gitApi.onDidOpenRepository((repo: any) => {
      this.watchRepository(repo);
    });
  }

  private watchRepository(repo: any) {
    const config = vscode.workspace.getConfiguration('tilpp');
    const autoCapture = config.get<boolean>('autoCaptureCommits', true);
    
    if (!autoCapture) {
      return;
    }

    repo.onDidCommit(async () => {
      const logEntries = await this.gitApi.repositories[0].log();
      const latestMessage = logEntries[0];

      await this.captureCommit(latestMessage, repo);
    });
  }

  private async captureCommit(commit: any, repo: any) {
    await createTILFromCommit(
      this.storage, 
      commit.message, 
      commit.hash,
      repo.rootUri.fsPath,
      commit.commitDate.toISOString()
    );
    
    vscode.window.showInformationMessage(
      `📝 Commit logged as TIL: "${commit.message.substring(0, 50)}..."`
    );
  }
}

// Shared function to create TIL from commit data
async function createTILFromCommit(
  storage: TILStorage,
  message: string,
  hash: string,
  repoPath: string,
  createdAt: string = new Date().toISOString()
): Promise<void> {
  const config = vscode.workspace.getConfiguration('tilpp');
  const template = config.get<string>('commitTemplate', '[commit] {message}');
  
  // Format the TIL content
  const content = template.replace('{message}', message);

  const til: TIL = {
    id: uuidv4(),
    content: content,
    createdAt: createdAt,
    metadata: {
      source: 'git',
      commitHash: hash,
      repository: repoPath
    }
  };

  await storage.addTIL(til);
}

// Manual command to log last commit
export async function logLastCommit(context: vscode.ExtensionContext) {
  const gitExtension = vscode.extensions.getExtension('vscode.git');
  if (!gitExtension) {
    vscode.window.showErrorMessage('Git extension not found');
    return;
  }

  const git = gitExtension.isActive 
    ? gitExtension.exports 
    : await gitExtension.activate();
  
  const api = git.getAPI(1);
  
  // Get active repository
  const repo = api.repositories[0]; // You might want to let user choose
  if (!repo) {
    vscode.window.showErrorMessage('No Git repository found');
    return;
  }

  const head = repo.state.HEAD;
  if (!head || !head.commit) {
    vscode.window.showErrorMessage('No commits found');
    return;
  }

  console.log("LOG LAST COMMIT REPO", repo);

  const logEntries = await repo.log();
  const latestMessage = logEntries[0].message;

  console.log("log entries", logEntries);
  const save = await vscode.window.showInformationMessage(
    `Save this commit as TIL?\n"${latestMessage}"`,
    'Yes', 'No'
  );

  if (save === 'No') {
    return;
  }

  const storage = new TILStorage(context);
  await createTILFromCommit(
    storage,
    latestMessage,
    logEntries[0].hash,
    repo.rootUri.fsPath
  );
  
  vscode.window.showInformationMessage('Commit saved as TIL! 📝');
}