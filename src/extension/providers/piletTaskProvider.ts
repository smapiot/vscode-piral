import * as vscode from 'vscode';

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
    const flags = _task.definition.flags || [];
    const command = ['npx', 'pilet', 'debug', ...flags].join(' ');
    const definition = _task.definition;

    return new vscode.Task(
      definition,
      _task.scope ?? vscode.TaskScope.Workspace,
      'debug',
      PiletTaskProvider.Type,
      new vscode.ShellExecution(command),
      ['$piral-cli-debug'],
    );
  }
}

interface PiletTaskDefinition extends vscode.TaskDefinition {
  /**
   * Additional build flags
   */
  flags?: Array<string>;
}

async function getPiletTasks(): Promise<vscode.Task[]> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const result: vscode.Task[] = [];

  if (workspaceFolders?.length) {
    for (const workspaceFolder of workspaceFolders) {
      const kind: PiletTaskDefinition = {
        type: PiletTaskProvider.Type,
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
      task.group = vscode.TaskGroup.Build;
      result.push(task);
    }
  }

  return result;
}
