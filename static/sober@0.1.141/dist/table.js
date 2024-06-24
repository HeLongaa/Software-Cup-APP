import { builder, html } from './core/element.js';
const style = /*css*/ `
:host{
  display: block;
  font-size: .875rem;
  border: solid 1px var(--s-color-outline-variant, #c7c5d0);
  border-radius: 8px;
  white-space: nowrap;
  overflow: hidden;
}
.container{
  display: table;
  width: 100%;
  border-collapse: collapse;
}
`;
const name = 's-table';
const props = {};
export class Table extends builder({
    name, style, props,
    setup() {
        return {
            render: () => html `
        <div class="container" part="container">
          <slot></slot>
        </div>
      `
        };
    }
}) {
}
const theadStyle = /*css*/ `
:host{
  display: table-header-group;
  font-weight: 600;
  color: var(--s-color-on-surface-variant, #46464f);
}
`;
const theadName = 's-thead';
const theadProps = {};
export class Thead extends builder({
    name: theadName,
    style: theadStyle,
    props: theadProps,
    setup() {
        return {
            render: () => html `
        <slot></slot>
      `
        };
    }
}) {
}
const tbodyStyle = /*css*/ `
:host{
  display: table-row-group;
  color: var(--s-color-on-surface, #1c1b1f);
  position: relative;
}
::slotted(s-tr){
  border-top: solid 1px var(--s-color-outline-variant, #c7c5d0);
}
`;
const tbodyName = 's-tbody';
const tbodyProps = {};
export class Tbody extends builder({
    name: tbodyName,
    style: tbodyStyle,
    props: tbodyProps,
    setup() {
        return {
            render: () => html `
        <slot></slot>
      `
        };
    }
}) {
}
const trStyle = /*css*/ `
:host{
  display: table-row;
}
`;
const trName = 's-tr';
const trProps = {};
export class Tr extends builder({
    name: trName,
    style: trStyle,
    props: trProps,
    setup() {
        return {
            render: () => html `
        <slot></slot>
      `
        };
    }
}) {
}
const thStyle = /*css*/ `
:host{
  display: table-cell;
  padding: 16px;
}
:host(:not(:first-child)){
  width: 0;
  text-align: right;
}
`;
const thName = 's-th';
const thProps = {};
export class Th extends builder({
    name: thName,
    style: thStyle,
    props: thProps,
    setup() {
        return {
            render: () => html `
        <slot></slot>
      `
        };
    }
}) {
}
const tdStyle = /*css*/ `
:host{
  display: contents;
  user-select: text;
  padding: 12px 16px;
}
:host(:not(:first-child)){
  text-align: right;
}
td{
  padding: inherit;
  vertical-align: middle;
}
`;
const tdName = 's-td';
const tdProps = {
    colspan: 1,
    rowspan: 1
};
export class Td extends builder({
    name: tdName,
    style: tdStyle,
    props: tdProps,
    setup() {
        let td;
        return {
            watches: {
                colspan: (value) => td.colSpan = value,
                rowspan: (value) => td.rowSpan = value
            },
            render: () => html `
        <td ref="${(el) => td = el}" rowspan="${this.rowspan}" colspan="${this.colspan}">
          <slot></slot>
        </td>
      `
        };
    }
}) {
}
Table.define();
Thead.define();
Tbody.define();
Tr.define();
Th.define();
Td.define();
