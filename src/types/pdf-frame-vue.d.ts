declare module "@i2d/pdf-frame-vue" {
  import { DefineComponent, type HTMLAttributes } from "vue";

  interface PdfFrameConfig {
    margin?: number;
    margins?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    defaultFont?: string;
    fontRegister?: Record<string, string>;
  }

  interface PdfFrameProps extends HTMLAttributes {
    type?: "pdf" | "canvas" | "pdf-blob";
    width?: number;
    height?: number;
    config?: PdfFrameConfig;
    info?: {
      title?: string;
      author?: string;
      subject?: string;
      keywords?: string;
      creationDate?: string;
    };
    encryption?: {
      userPassword: string;
    };
    autoPagination?: boolean;

    setCtxClear?: () => void;
    needOnUpdated?: boolean;

    onUpdated?: () => void;
    onReady?: () => void;
    onResize?: () => void;
    onMouseover?: () => void;
    onMouseup?: () => void;
    onMousein?: () => void;
    onMouseout?: () => void;
  }

  const PdfFrame: DefineComponent<PdfFrameProps>;
  export default PdfFrame;
}
