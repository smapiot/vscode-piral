import * as vscode from 'vscode';
import { RepoType, getRepoTypeOf, getWorkspaceRoot } from '../helpers';

export class PiletTaskProvider implements vscode.TaskProvider {
  static Type = 'pilet';
  private tasksPromise: Thenable<vscode.Task[]> | undefined = undefined;

  constructor() {}

  public provideTasks(): Thenable<vscode.Task[]> | undefined {
    if (!this.tasksPromise) {
      this.tasksPromise = getPiletTasks();
    }
    return this.tasksPromise;
  }

  public resolveTask(_task: vscode.Task): vscode.Task | undefined {
    return undefined;
  }
}

interface PiletTaskDefinition extends vscode.TaskDefinition {
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
  const kind: PiletTaskDefinition = {
    type: PiletTaskProvider.Type,
    command: 'debug',
    flags: [],
  };
  const command = ['npx', 'pilet', 'debug', ...(kind.flags || [])].join(' ');
  const task = new vscode.Task(
    kind,
    workspaceFolder,
    'debug',
    PiletTaskProvider.Type,
    new vscode.ShellExecution(command),
    ['$piral-cli-debug'],
  );
  task.isBackground = true;
  task.runOptions.reevaluateOnRerun = true;
  task.presentationOptions.panel = vscode.TaskPanelKind.New;
  task.group = vscode.TaskGroup.Build;
  return task;
}

function createBuildTask(workspaceFolder: vscode.WorkspaceFolder) {
  const kind: PiletTaskDefinition = {
    type: PiletTaskProvider.Type,
    command: 'build',
    flags: [],
  };
  const command = ['npx', 'pilet', 'build', ...(kind.flags || [])].join(' ');
  const task = new vscode.Task(
    kind,
    workspaceFolder,
    'build',
    PiletTaskProvider.Type,
    new vscode.ShellExecution(command),
  );
  task.group = vscode.TaskGroup.Build;
  task.runOptions.reevaluateOnRerun = true;
  task.presentationOptions.panel = vscode.TaskPanelKind.New;
  return task;
}

function createValidateTask(workspaceFolder: vscode.WorkspaceFolder) {
  const kind: PiletTaskDefinition = {
    type: PiletTaskProvider.Type,
    command: 'validate',
    flags: [],
  };
  const command = ['npx', 'pilet', 'validate', ...(kind.flags || [])].join(' ');
  const task = new vscode.Task(
    kind,
    workspaceFolder,
    'validate',
    PiletTaskProvider.Type,
    new vscode.ShellExecution(command),
  );
  task.group = vscode.TaskGroup.Test;
  task.runOptions.reevaluateOnRerun = true;
  task.presentationOptions.panel = vscode.TaskPanelKind.New;
  return task;
}

function createPackTask(workspaceFolder: vscode.WorkspaceFolder) {
  const kind: PiletTaskDefinition = {
    type: PiletTaskProvider.Type,
    command: 'pack',
    flags: [],
  };
  const command = ['npx', 'pilet', 'pack', ...(kind.flags || [])].join(' ');
  const task = new vscode.Task(
    kind,
    workspaceFolder,
    'pack',
    PiletTaskProvider.Type,
    new vscode.ShellExecution(command),
  );
  task.group = vscode.TaskGroup.Build;
  task.runOptions.reevaluateOnRerun = true;
  task.presentationOptions.panel = vscode.TaskPanelKind.New;
  return task;
}

async function getPiletTasks(): Promise<vscode.Task[]> {
  const workspaceFolder = getWorkspaceRoot();
  const repoType = getRepoTypeOf(workspaceFolder);
  const result: vscode.Task[] = [];

  if (workspaceFolder && repoType === RepoType.Pilet) {
    result.push(
      createDebugTask(workspaceFolder),
      createBuildTask(workspaceFolder),
      createValidateTask(workspaceFolder),
      createPackTask(workspaceFolder),
    );
  }

  return result;
}
