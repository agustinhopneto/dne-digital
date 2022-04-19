import { extendTheme } from 'native-base';

import { colors } from './colors';
import { fontConfig, fonts } from './fonts';

export const theme = extendTheme({
  colors,
  fonts,
  fontConfig,
});
