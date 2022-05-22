import * as vscode from 'vscode';

export const piralCliDebugTask: vscode.TaskProvider<vscode.Task> = {
  provideTasks() {
    return [
      new vscode.Task(
        { type: 'piral', task: 'piral debug' },
        vscode.TaskScope.Workspace,
        'Debug Piral instance',
        'Piral',
        new vscode.ShellExecution('npx piral debug'),
        ['$piral'],
      ),
      new vscode.Task(
        { type: 'piral', task: 'pilet debug' },
        vscode.TaskScope.Workspace,
        'Debug pilet',
        'Piral',
        new vscode.ShellExecution('npx pilet debug'),
        ['$piral'],
      ),
    ];
  },
  resolveTask(task) {
    return task;
  },
};
