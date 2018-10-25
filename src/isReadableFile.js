// @flow

import fs from 'fs';

export default (filePath: string): boolean => {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);

    return true;
  } catch (error) {
    return false;
  }
};
