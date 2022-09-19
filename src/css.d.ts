// My css.d.ts file
import type * as CSS from "csstype";

declare module "csstype" {
  interface Properties {
    "--left"?: number;
    "--cooked"?: number;
  }
}
