import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "net.myusc.ghfexpress",
    appName: "GHF Express",
    webDir: "build",
    backgroundColor: "#093565",
    plugins: {
        SplashScreen: {
            launchAutoHide: false,
            launchFadeOutDuration: 5000,
            launchShowDuration: 10000,
        },
    },
    // server: {
    //     url: "http://localhost:5173",
    //     cleartext: true
    // },
};

export default config;
