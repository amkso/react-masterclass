// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    red: string;
    black: {
      veryDark: string;
      darker: string;
      lighter: string;
    };
    white: {
      darker: string;
      lighter: string;
    };

    // optional
    bgColor?: string;
    textColor?: string;
    accentColor?: string;
    cardBgColor?: string;
    cardColor?: string;
    boardColor?: string;
  }
}
