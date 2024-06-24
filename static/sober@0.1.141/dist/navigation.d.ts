import './ripple.js';
import type { JSXAttributes } from './core/types/HTMLAttributes.js';
declare const name = "s-navigation";
declare const props: {
    mode: "bottom" | "rail";
};
declare const Navigation_base: {
    new (): {
        mode: "bottom" | "rail";
    } & {
        readonly options: NavigationItem[];
        readonly selectIndex: number;
    } & HTMLElement;
    readonly define: () => void;
    prototype: HTMLElement;
};
export declare class Navigation extends Navigation_base {
}
declare const itemName = "s-navigation-item";
declare const itemProps: {
    checked: boolean;
};
declare const NavigationItem_base: {
    new (): {
        checked: boolean;
    } & HTMLElement;
    readonly define: () => void;
    prototype: HTMLElement;
};
export declare class NavigationItem extends NavigationItem_base {
}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            [name]: Partial<typeof props> & JSXAttributes;
            [itemName]: Partial<typeof itemProps> & JSXAttributes;
        }
    }
    interface HTMLElementTagNameMap {
        [name]: Navigation;
        [itemName]: NavigationItem;
    }
}
declare module 'vue' {
    interface GlobalComponents {
        [name]: typeof props;
        [itemName]: typeof itemProps;
    }
}
export {};
