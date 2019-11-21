// @flow

import type {
  CallSiteType,
} from './types';

export default (callSite: CallSiteType) => {
  return Boolean(callSite.getFileName());
};
