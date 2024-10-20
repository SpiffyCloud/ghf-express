import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "net.myusc.ghfexpress",
    appName: "GHF Express",
    webDir: "build",
    backgroundColor: "#093565",
    plugins: {
        SplashScreen: {
            launchAutoHide: false,
        },
    },
    // server: {
    //     url: "http://localhost:5173",
    //     cleartext: true
    // },
};

export default config;
