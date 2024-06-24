import { builder, html } from './core/element.js';
import './ripple.js';
const style = /*css*/ `
:host{
  display: flex;
  justify-content: center;
  position: relative;
  background: var(--s-color-surface, #fffbff);
  color: var(--s-color-on-surface-variant, #46464f);
}
:host::before{
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  background: var(--s-color-surface-variant, #e4e1ec);
  bottom: 0;
  left: 0;
}
.container{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  scrollbar-width: none;
  overflow-x: auto;
}
.container::-webkit-scrollbar{
  display: none;
}
:host([mode=fixed]) .container{
  overflow: hidden;
  width: 100%;
}
::slotted(s-tab-item){
  flex-shrink: 0;
  flex-basis: auto;
}
:host([mode=fixed]) ::slotted(s-tab-item){
  flex-basis: 100%;
  flex-shrink: 1;
}
`;
const name = 's-tab';
const props = {
    mode: 'scrollable',
};
export class Tab extends builder({
    name, style, props, propSyncs: ['mode'],
    setup() {
        let container;
        let options = [];
        let selectIndex = -1;
        let changing = false;
        const slotChange = (_, el) => {
            options = el.assignedElements().filter((item) => item instanceof TabItem);
            selectIndex = options.findIndex((item) => item.checked);
        };
        this.addEventListener('tab-item:change', (event) => {
            event.stopPropagation();
            if (changing)
                return;
            changing = true;
            if (!event.target)
                return;
            const target = event.target;
            const old = options[selectIndex];
            selectIndex = -1;
            options.forEach((item, index) => {
                if (item === target && target.checked)
                    return selectIndex = index;
                item.checked && (item.checked = false);
            });
            changing = false;
            const select = options[selectIndex];
            if (this.isConnected && old && select) {
                select.indicator.setAttribute('style', 'transition:none;filter:opacity(0)');
                old.indicator.addEventListener('transitionend', () => {
                    select.indicator.addEventListener('transitionend', () => old.indicator.setAttribute('style', 'visibility:hidden'), { once: true });
                    select.indicator.removeAttribute('style');
                }, { once: true });
                const oldLeft = old.indicator.getBoundingClientRect().left;
                const rect = select.indicator.getBoundingClientRect();
                old.indicator.setAttribute('style', `filter:opacity(1);transform:translateX(${rect.left - oldLeft}px);width: ${rect.width}px`);
                if (container.scrollWidth !== container.offsetWidth) {
                    const left = select.offsetLeft - container.offsetWidth + container.offsetWidth / 2 + select.offsetWidth / 2;
                    container.scrollTo({ left, behavior: 'smooth' });
                }
            }
            this.dispatchEvent(new Event('change'));
        });
        return {
            expose: {
                get options() {
                    return options;
                },
                get selectIndex() {
                    return selectIndex;
                },
            },
            render: () => html `
        <div class="container" ref="${(el) => container = el}">
          <slot @slotchange="${slotChange}"></slot>
        </div>
      `
        };
    }
}) {
}
const itemStyle = /*css*/ `
:host{
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  position: relative;
  cursor: pointer;
  font-size: .875rem;
  font-weight: 500;
  text-transform: capitalize;
  padding: 0 16px;
}
:host([checked=true]){
  color: var(--s-color-primary, #5256a9);
}
.container{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  min-height: inherit;
}
.indicator{
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 100%;
  background: var(--s-color-primary, #5256a9);
  border-radius: 1.5px 1.5px 0 0;
  transition: filter .2s, transform .2s, width .2s;
  filter: opacity(0);
}
:host([checked=true]) .indicator{
  filter: opacity(1);
}
.text{
  display: flex;
  align-items: center;
}
.icon .badge{
  position: absolute;
  top: 8px;
  left: 50%;
}
::slotted([slot=icon]){
  height: 42px;
  color: inherit;
}
::slotted([slot=text]){
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 1;
}
.icon ::slotted([slot=text]){
  height: 26px;
  margin-top: -4px;
}
::slotted([slot=badge]){
  margin-left: 4px;
}
`;
const itemName = 's-tab-item';
const itemProps = {
    checked: false
};
export class TabItem extends builder({
    name: itemName,
    style: itemStyle,
    props: itemProps,
    propSyncs: true,
    setup() {
        let icon;
        let container;
        let indicator;
        const iconSlotChange = () => {
            const length = icon.assignedElements().length;
            container.classList[length > 0 ? 'add' : 'remove']('icon');
        };
        this.addEventListener('click', () => this.checked = true);
        return {
            expose: {
                get indicator() {
                    return indicator;
                }
            },
            watches: {
                checked: () => {
                    if (!this.parentNode)
                        return;
                    this.dispatchEvent(new Event('tab-item:change', { bubbles: true }));
                },
            },
            render: () => html `
        <div class="container" ref="${(el) => container = el}">
          <slot name="icon" ref="${(el) => icon = el}" @slotchange="${iconSlotChange}"></slot>
          <div class="text">
            <slot name="text"></slot>
            <div class="badge">
              <slot name="badge"></slot>
            </div>
          </div>
          <div class="indicator" ref="${(el) => indicator = el}"></div>
        </div>
        <s-ripple attached="true"></s-ripple>
      `
        };
    }
}) {
}
Tab.define();
TabItem.define();
