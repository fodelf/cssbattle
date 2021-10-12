declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}
interface Lsp {
  new (options: any): Lsp;
  connect: Function;
  join: Function;
  send: Function;
  on: Function;
  shareScreen: Function;
  publishVideo: Function;
  peerClient: any;
}
interface Window {
  Lsp: Lsp;
}
