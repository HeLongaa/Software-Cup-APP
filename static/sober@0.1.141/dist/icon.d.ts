import type { JSXAttributes } from './core/types/HTMLAttributes.js';
declare const name = "s-icon";
declare const props: {
    type: "menu" | "search" | "none" | "close" | "arrow_back" | "arrow_drop_up" | "more_vert" | "chevron_up" | "home" | "add" | "arrow_forward" | "arrow_upward" | "arrow_downward" | "arrow_drop_down" | "arrow_drop_left" | "arrow_drop_right" | "more_horiz" | "done" | "chevron_down" | "chevron_left" | "chevron_right" | "light_mode" | "dark_mode" | "star" | "favorite";
};
declare const Icon_base: {
    new (): {
        type: "menu" | "search" | "none" | "close" | "arrow_back" | "arrow_drop_up" | "more_vert" | "chevron_up" | "home" | "add" | "arrow_forward" | "arrow_upward" | "arrow_downward" | "arrow_drop_down" | "arrow_drop_left" | "arrow_drop_right" | "more_horiz" | "done" | "chevron_down" | "chevron_left" | "chevron_right" | "light_mode" | "dark_mode" | "star" | "favorite";
    } & HTMLElement;
    readonly define: () => void;
    prototype: HTMLElement;
};
export declare class Icon extends Icon_base {
}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            [name]: Partial<typeof props> & JSXAttributes;
        }
    }
    interface HTMLElementTagNameMap {
        [name]: Icon;
    }
}
declare module 'vue' {
    interface GlobalComponents {
        [name]: typeof props;
    }
}
export {};
