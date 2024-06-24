import type { JSXAttributes } from './core/types/HTMLAttributes.js';
import './ripple.js';
declare const name = "s-segmented-button";
declare const props: {};
declare const SegmentedButton_base: {
    new (): {
        readonly options: SegmentedButtonItem[];
        readonly selectIndex: number;
    } & HTMLElement;
    readonly define: () => void;
    prototype: HTMLElement;
};
export declare class SegmentedButton extends SegmentedButton_base {
}
declare const itemName = "s-segmented-button-item";
declare const itemProps: {
    checked: boolean;
    disabled: boolean;
    selectable: boolean;
};
declare const SegmentedButtonItem_base: {
    new (): {
        checked: boolean;
        disabled: boolean;
        selectable: boolean;
    } & HTMLElement;
    readonly define: () => void;
    prototype: HTMLElement;
};
export declare class SegmentedButtonItem extends SegmentedButtonItem_base {
}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            [name]: Partial<typeof props> & JSXAttributes;
            [itemName]: Partial<typeof itemProps> & JSXAttributes;
        }
    }
    interface HTMLElementTagNameMap {
        [name]: SegmentedButton;
        [itemName]: SegmentedButtonItem;
    }
}
declare module 'vue' {
    interface GlobalComponents {
        [name]: typeof props;
        [itemName]: typeof itemProps;
    }
}
export {};
