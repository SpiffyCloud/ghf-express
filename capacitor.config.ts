import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.myusc.ghfexpress',
  appName: 'GHF Express',
  webDir: 'dist',
  backgroundColor: '#093565',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
    },
  },
};

export default config;
