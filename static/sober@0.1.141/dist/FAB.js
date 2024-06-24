import { builder, html } from './core/element.js';
const style = /*css*/ `
:host{
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  position: relative;
  cursor: pointer;
  box-sizing: border-box;
  height: 56px;
  width: 56px;
  border-radius: 28px;
  background: var(--s-color-primary-container, #e1e0ff);
  color: var(--s-color-on-primary-container, #090764);
  transition: box-shadow .2s;
  font-size: .875rem;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1;
  text-transform: capitalize;
  box-shadow: var(--s-elevation-level2, 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12));
}
:host([size=small]){
  height: 48px;
  width: 48px;
  border-radius: 24px;
}
:host([extended=true]){
  padding: 0 16px;
  width: auto;
  height: 48px;
  border-radius: 24px;
}
:host(:not([extended=true])[size=large]){
  height: 72px;
  width: 72px;
  border-radius: 36px;
}
:host(:not([extended=true])[size=large]) ::slotted(*){
  width: 36px;
  height: 36px;
}
::slotted(s-icon){
  color: inherit;
}
::slotted(s-icon[slot=start]){
  margin: 0 8px 0 0;
}
::slotted(s-icon[slot=end]){
  margin: 0 0 0 8px;
}
@media (pointer: coarse){
  :host(:active){
    box-shadow: var(--s-elevation-level4, 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12));
  }
}
@media (pointer: fine){
  :host(:hover){
    box-shadow: var(--s-elevation-level4, 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12));
  }
}
`;
const name = 's-fab';
const props = {
    size: 'medium',
    extended: false,
};
export class FAB extends builder({
    name, style, props, propSyncs: true,
    setup() {
        let ripple;
        return {
            watches: {
                extended: (value) => ripple.setAttribute('centered', String(!value))
            },
            render: () => html `
        <s-ripple attached="true" centered="true" ref="${(el) => ripple = el}"></s-ripple>
        <slot name="start"></slot>
        <slot></slot>
        <slot name="end"></slot>
      `
        };
    }
}) {
}
FAB.define();
