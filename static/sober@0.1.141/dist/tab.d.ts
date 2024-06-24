import type { JSXAttributes } from './core/types/HTMLAttributes.js';
import './ripple.js';
declare const name = "s-tab";
declare const props: {
    mode: "fixed" | "scrollable";
};
declare const Tab_base: {
    new (): {
        mode: "fixed" | "scrollable";
    } & {
        readonly options: TabItem[];
        readonly selectIndex: number;
    } & HTMLElement;
    readonly define: () => void;
    prototype: HTMLElement;
};
export declare class Tab extends Tab_base {
}
declare const itemName = "s-tab-item";
declare const itemProps: {
    checked: boolean;
};
declare const TabItem_base: {
    new (): {
        checked: boolean;
    } & {
        readonly indicator: HTMLDivElement;
    } & HTMLElement;
    readonly define: () => void;
    prototype: HTMLElement;
};
export declare class TabItem extends TabItem_base {
}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            [name]: Partial<typeof props> & JSXAttributes;
            [itemName]: Partial<typeof props> & JSXAttributes;
        }
    }
    interface HTMLElementTagNameMap {
        [name]: Tab;
        [itemName]: TabItem;
    }
}
declare module 'vue' {
    interface GlobalComponents {
        [name]: typeof props;
        [itemName]: typeof itemProps;
    }
}
export {};
