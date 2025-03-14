declare module 'markdown-it' {
  class MarkdownIt {
    constructor(options?: any);
    render(markdownText: string): string;
  }
  export default MarkdownIt;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
} 