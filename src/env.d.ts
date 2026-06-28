/// <reference types="astro/client" />

declare module '*.yaml?raw' {
  const content: string;
  export default content;
}

declare module '@waline/client/style';
