import { Uri } from 'vscode';

export function getRef(iconUri: Uri) {
  const { scheme, authority, path } = iconUri;
  return `${scheme}://${authority}${path}`;
}
