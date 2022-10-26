import { Color } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const { palette } = createTheme();
const theme = createTheme({
  palette: {
    primary: {
      main: "#819DE5",
    },
    secondary: {
      main: "#E0E4FF",
    },
    appGrey: palette.augmentColor({ color: { main: "#D6D6D6" } }),
    appBlack: palette.augmentColor({ color: { main: "#575757" } }),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

declare module "@mui/material/styles" {
  interface Palette {
    appGrey: string;
    appBlack: string;
  }
  interface PaletteOptions {
    appGrey: string;
    appBlack: string;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    appGrey: true;
    appBlack: true;
  }
}

export default theme;
