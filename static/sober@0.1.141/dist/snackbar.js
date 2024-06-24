import { builder, html } from './core/element.js';
import { getStackingContext } from './core/utils.js';
const style = /*css*/ `
:host{
  display: inline-flex;
  vertical-align: middle;
}
.wrapper{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}
.container{
  background: var(--s-color-inverse-surface, #313034);
  color: var(--s-color-inverse-on-surface, #f3eff4);
  min-height: 48px;
  border-radius: 4px;
  box-shadow: var(--s-elevation-level3, 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12));
  line-height: 1.6;
  display: inline-flex;
  align-items: center;
  min-width: 320px;
  max-width: 480px;
  font-size: .875rem;
  font-weight: 400;
  margin: 16px;
  pointer-events: auto;
  transform: translateY(100%);
  filter: opacity(0);
  transition: transform .2s, filter .2s;
}
.wrapper.show .container{
  transform: translateY(0%);
  filter: opacity(1);
}
.supporting-text{
  margin: 12px 16px;
  flex-grow: 1;
  user-select: text;
  -webkit-user-select: text;
}
::slotted(s-button[slot=action]){
  font-size: inherit;
  flex-shrink: 0;
  border-radius: 4px;
  color: var(--s-color-inverse-primary, #c0c1ff);
  margin-right: 8px;
  margin-left: -8px;
  height: 36px;
}
@media (max-width: 320px){
  .container{
    margin: 8px;
    flex-grow: 1;
    min-width: auto;
  }
}
`;
const name = 's-snackbar';
const props = {
    duration: 5000
};
const show = (options) => {
    let root = document.body;
    const snackbar = new Snackbar();
    const page = document.body.firstElementChild;
    if (page && page.tagName === 'S-PAGE') {
        root = page;
    }
    if (typeof options === 'string') {
        snackbar.textContent = options;
    }
    else {
        if (options.root)
            root = options.root;
        snackbar.textContent = options.text;
        if (options.action) {
            const action = document.createElement('s-button');
            action.type = 'text';
            action.slot = 'action';
            action.textContent = options.action.text;
            if (options.action.click)
                action.addEventListener('click', options.action.click);
            snackbar.appendChild(action);
        }
        if (options.duration)
            snackbar.duration = options.duration;
    }
    root.appendChild(snackbar);
    snackbar.addEventListener('dismissed', () => root.removeChild(snackbar));
    snackbar.show();
};
class Snackbar extends builder({
    name, style, props,
    setup(shadowRoot) {
        let wrapper;
        const state = { timer: 0 };
        const show = () => {
            const stackingContext = getStackingContext(shadowRoot);
            if (stackingContext.top !== 0 || stackingContext.left !== 0) {
                wrapper.setAttribute('style', `width: ${innerWidth}px;height: ${innerHeight}px;top: ${0 - stackingContext.top}px;left: ${0 - stackingContext.left}px`);
            }
            clearTimeout(state.timer);
            getComputedStyle(wrapper).top;
            wrapper.classList.add('show');
            this.dispatchEvent(new Event('show'));
            if (this.duration > 0)
                state.timer = setTimeout(dismiss, this.duration);
        };
        const dismiss = () => {
            clearTimeout(state.timer);
            wrapper.classList.remove('show');
            this.dispatchEvent(new Event('dismiss'));
        };
        const transitionEnd = (event) => {
            if (event.propertyName !== 'transform')
                return;
            const showed = wrapper.classList.contains('show');
            this.dispatchEvent(new Event(showed ? 'showed' : 'dismissed'));
        };
        return {
            expose: { show, dismiss },
            render: () => html `
        <slot name="trigger" @click="${show}"></slot>
        <div class="wrapper" ref="${(el) => wrapper = el}" @transitionend="${transitionEnd}">
          <div class="container" part="container">
            <div class="supporting-text">
              <slot></slot>
            </div>
            <slot name="action" @click="${dismiss}"></slot>
          </div>
        </div>
      `
        };
    }
}) {
    static show = show;
}
Snackbar.define();
export { Snackbar };
