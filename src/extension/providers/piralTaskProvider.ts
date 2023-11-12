import * as vscode from 'vscode';
import { RepoType, getRepoTypeOf, getWorkspaceRoot } from '../helpers';

export class PiralTaskProvider implements vscode.TaskProvider {
  static Type = 'piral';
  private tasksPromise: Thenable<vscode.Task[]> | undefined = undefined;

  constructor() {}

  public provideTasks(): Thenable<vscode.Task[]> | undefined {
    if (!this.tasksPromise) {
      this.tasksPromise = getPiralTasks();
    }
    return this.tasksPromise;
  }

  public resolveTask(_task: vscode.Task): vscode.Task | undefined {
    return undefined;
  }
}

interface PiralTaskDefinition extends vscode.TaskDefinition {
  /**
   * The command to use.
   */
  command: string;
  /**
   * Additional build flags.
   */
  flags?: Array<string>;
}

function createDebugTask(workspaceFolder: vscode.WorkspaceFolder) {
  const kind: PiralTaskDefinition = {
    type: PiralTaskProvider.Type,
    command: 'debug',
    flags: [],
  };
  const command = ['npx', 'piral', 'debug', ...(kind.flags || [])].join(' ');
  const task = new vscode.Task(kind, workspaceFolder, 'debug', 'piral', new vscode.ShellExecution(command), [
    '$piral-cli-debug',
  ]);
  task.isBackground = true;
  task.group = vscode.TaskGroup.Build;
  return task;
}

function createBuildTask(workspaceFolder: vscode.WorkspaceFolder) {
  const kind: PiralTaskDefinition = {
    type: PiralTaskProvider.Type,
    command: 'build',
    flags: [],
  };
  const command = ['npx', 'piral', 'build', ...(kind.flags || [])].join(' ');
  const task = new vscode.Task(kind, workspaceFolder, 'build', 'piral', new vscode.ShellExecution(command));
  task.group = vscode.TaskGroup.Build;
  return task;
}

function createValidateTask(workspaceFolder: vscode.WorkspaceFolder) {
  const kind: PiralTaskDefinition = {
    type: PiralTaskProvider.Type,
    command: 'validate',
    flags: [],
  };
  const command = ['npx', 'piral', 'validate', ...(kind.flags || [])].join(' ');
  const task = new vscode.Task(kind, workspaceFolder, 'validate', 'piral', new vscode.ShellExecution(command));
  task.group = vscode.TaskGroup.Test;
  return task;
}

function createDeclarationTask(workspaceFolder: vscode.WorkspaceFolder) {
  const kind: PiralTaskDefinition = {
    type: PiralTaskProvider.Type,
    command: 'declaration',
    flags: [],
  };
  const command = ['npx', 'piral', 'declaration', ...(kind.flags || [])].join(' ');
  const task = new vscode.Task(kind, workspaceFolder, 'declaration', 'piral', new vscode.ShellExecution(command));
  task.group = vscode.TaskGroup.Build;
  return task;
}

async function getPiralTasks(): Promise<vscode.Task[]> {
  const workspaceFolder = getWorkspaceRoot();
  const repoType = getRepoTypeOf(workspaceFolder);
  const result: vscode.Task[] = [];

  if (workspaceFolder && repoType === RepoType.Piral) {
    result.push(
      createDebugTask(workspaceFolder),
      createBuildTask(workspaceFolder),
      createValidateTask(workspaceFolder),
      createDeclarationTask(workspaceFolder),
    );
  }

  return result;
}
