import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { ThemeProvider } from "@mui/material";
import theme from "../muiconfig";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_APIKEY,
      authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
      projectId: process.env.NEXT_PUBLIC_PROJECTID,
      storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
      appId: process.env.NEXT_PUBLIC_APPID,
      measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID,
    };

    initializeApp(firebaseConfig);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />{" "}
    </ThemeProvider>
  );
};

export default MyApp;
