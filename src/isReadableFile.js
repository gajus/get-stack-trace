// @flow

import fs from 'fs';

const fileAccessCache: {
  [string]: boolean | typeof undefined,
  ...
} = {};

export default (filePath: string): boolean => {
  // If the file was previously unreadable, we can assume this
  // will always be the case
  let accessable = fileAccessCache[filePath];

  if (accessable !== undefined) {
    return accessable;
  }

  try {
    fs.accessSync(filePath, fs.constants.R_OK);

    accessable = true;
  } catch (error) {
    accessable = false;
  }

  fileAccessCache[filePath] = accessable;

  return accessable;
};
