import { builder, html } from './core/element.js';
const style = /*css*/ `
:host{
  display: block;
  height: 100%;
}
.container{
  display: flex;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.scrim{
  background: var(--s-color-scrim, #000000);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: opacity(0);
  pointer-events: none;
  transition: filter .2s;
}
.start,
.end{
  min-width: 0;
  height: 100%;
  width: 0;
  overflow: hidden;
  flex-shrink: 0;
}
.show-start>.start,
.show-end>.end{
  width: auto;
}
.start{
  order: -1;
}
::slotted(:not([slot])){
  flex-grow: 1;
  min-width: 0;
}
::slotted([slot=start]),
::slotted([slot=end]){
  width: 280px;
  display: flow-root;
  flex-shrink: 0;
  background: var(--s-color-surface-container-low, #f6f2f7);
  border-color: var(--s-color-surface-variant, #e4e1ec);
  border-width: 1px;
  height: 100%;
  box-sizing: border-box;
  position: relative;
}
::slotted([slot=start]){
  border-right-style: solid;
}
::slotted([slot=end]){
  border-left-style: solid;
}
.folded>.start,
.folded>.end{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  visibility: hidden;
  display: flex;
}
.folded>.end{
  justify-content: flex-end;
}
.folded ::slotted([slot=start]),
.folded ::slotted([slot=end]){
  pointer-events: auto;
  max-width: 75%;
  border-style: none;
  box-shadow: var(--s-elevation-level3, 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12));
}
.folded.show-fold-start>.scrim,
.folded.show-fold-end>.scrim{
  filter: opacity(.8);
  pointer-events: auto;
}
.folded.show-fold-start>.start,
.folded.show-fold-end>.end{
  visibility: visible;
}
`;
const name = 's-drawer';
const props = {
    fold: 840
};
export class Drawer extends builder({
    name, props, style,
    setup() {
        let container;
        const elements = { start: undefined, end: undefined };
        const slots = { start: undefined, end: undefined };
        const duration = 200;
        const show = (slot = 'start', folded) => {
            const isFold = folded === undefined ? container.classList.contains('folded') : folded;
            const className = isFold ? `show-fold-${slot}` : `show-${slot}`;
            if (container.classList.contains(className))
                return;
            container.classList.add(className);
            const width = slots[slot]?.offsetWidth ?? 0;
            const translate = slot === 'start' ? width * -1 : width;
            const animate = isFold ? [{ transform: `translateX(${translate}px)` }, { transform: `translateX(0px)` }] : [{ width: 0 }, { width: `${width}px` }];
            elements[slot].animate(animate, { duration });
        };
        const dismiss = (slot = 'start', folded) => {
            const isFold = folded === undefined ? container.classList.contains('folded') : folded;
            const className = isFold ? `show-fold-${slot}` : `show-${slot}`;
            if (!container.classList.contains(className))
                return;
            const width = slots[slot]?.offsetWidth ?? 0;
            container.classList.remove(className);
            const translate = slot === 'start' ? width * -1 : width;
            const animate = isFold ? [{ transform: `translateX(0px)`, visibility: 'visible' }, { transform: `translateX(${translate}px)`, visibility: 'visible' }] : [{ width: `${width}px` }, { width: 0 }];
            elements[slot].animate(animate, { duration });
        };
        const toggle = (slot = 'start', folded) => {
            const isFold = folded === undefined ? container.classList.contains('folded') : folded;
            const className = isFold ? `show-fold-${slot}` : `show-${slot}`;
            container.classList.contains(className) ? dismiss(slot, folded) : show(slot, folded);
        };
        const obs = new ResizeObserver(() => this.offsetWidth < this.fold ? container.classList.add('folded') : container.classList.remove('folded'));
        obs.observe(this);
        return {
            expose: { show, dismiss, toggle },
            render: () => html `
        <div class="container show-start show-end" ref="${(el) => container = el}">
          <slot></slot>
          <div class="scrim" @click="${() => { dismiss('start'); dismiss('end'); }}"></div>
          <div class="start" ref="${(el) => elements.start = el}">
            <slot name="start" @slotchange="${(_, el) => slots.start = el.assignedElements()[0]}"></slot>
          </div>
          <div class="end" ref="${(el) => elements.end = el}">
            <slot name="end" @slotchange="${(_, el) => slots.end = el.assignedElements()[0]}"></slot>
          </div>
        </div>
      `
        };
    }
}) {
}
Drawer.define();
