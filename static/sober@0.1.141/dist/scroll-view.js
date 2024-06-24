import { builder, html } from './core/element.js';
const style = /*css*/ `
:host{
  display: block;
  overflow: auto;
}
@media (pointer: fine){
  :host::-webkit-scrollbar{
    width: 6px;
    height: 6px;
    background: transparent;
  }
  :host::-webkit-scrollbar-thumb{
    background: var(--s-color-outline-variant, #c7c5d0);
    border-radius: 3px;
  }
  @supports not selector(::-webkit-scrollbar){
    :host{
      scrollbar-color: var(--s-color-outline-variant, #c7c5d0) transparent;
    }
  }
}
`;
const name = 's-scroll-view';
const props = {};
export class ScrollView extends builder({
    name, style, props,
    setup() {
        return {
            render: () => html `
        <slot></slot>
      `
        };
    }
}) {
}
ScrollView.define();
