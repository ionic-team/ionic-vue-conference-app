import { CapacitorConfig } from '@capacitor/cli';
 
const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'heelo',
  bundledWebRuntime: false,
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    }
  },
};
 
export default config;