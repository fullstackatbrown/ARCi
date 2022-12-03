import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { ThemeProvider } from "@mui/material";
import theme from "../muiconfig";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

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

  const [authorized, setAuthorized] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} authorized = {authorized} setAuthorized = {setAuthorized} />{" "}
    </ThemeProvider>
  );
};

export default MyApp;
