/** Presentation-only inputs: no request IDs, driver, URL reader, or settlement API. */
export type LayoutId = 'overview' | 'form' | 'search' | 'consent' | 'accessibility' | 'privacy';
type FormField = 'title' | 'category' | 'detail';
type Category = 'all' | 'guide' | 'example' | 'reference';
type Phase = 'editing' | 'invalid' | 'confirming' | 'loading' | 'success' | 'error';
type Values = Record<FormField, string>;
interface View {
    phase: Phase;
    error: string | null;
}
export type PatternView = View & {
    patternId: 'form-errors';
    values: Values;
    errors: readonly {
        field: FormField;
        targetId: string;
        errorId: string;
        message: string;
    }[];
    receipt: Values & {
        id: string;
    } | null;
} | View & {
    patternId: 'search-results';
    query: string;
    appliedQuery: string;
    category: Category;
    page: number;
    pageCount: number;
    total: number;
    items: readonly {
        id: string;
        title: string;
        category: Exclude<Category, 'all'>;
        summary: string;
        date: string;
    }[];
} | View & {
    patternId: 'consent-confirmation';
    requiredChoice: boolean | null;
    optionalChoice: boolean;
    modalOpen: boolean;
    receipt: {
        id: string;
        requiredChoice: boolean | null;
        optionalChoice: boolean;
    } | null;
} | View & {
    patternId: 'service-layout';
    currentId: LayoutId;
    expandedIds: readonly string[];
    mobileOpen: boolean;
};
export type PresentationAction = {
    type: 'field';
    field: FormField;
    value: string;
} | {
    type: 'error-link';
    field: FormField;
} | {
    type: 'submit' | 'retry' | 'reset' | 'search' | 'review' | 'confirm' | 'close';
} | {
    type: 'query';
    value: string;
} | {
    type: 'filter';
    category: Category;
} | {
    type: 'page';
    page: number;
} | {
    type: 'consent';
    field: 'requiredChoice' | 'optionalChoice';
    value: boolean;
} | {
    type: 'expand';
    id: 'examples' | 'help';
    expanded: boolean;
} | {
    type: 'mobile';
    open: boolean;
} | {
    type: 'navigate';
    id: LayoutId;
};
export interface PatternContent {
    demoIdentity: {
        name: string;
        notice: string;
        dataNotice: string;
        copyrightText: string;
    };
    fieldIds: Record<FormField, string>;
    formCategories: readonly {
        value: string;
        label: string;
    }[];
    resourceCategories: readonly {
        value: Category;
        label: string;
    }[];
    consentContent: readonly {
        id: 'requiredChoice' | 'optionalChoice';
        title: string;
        paragraphs: readonly string[];
    }[];
    layoutNavigation: readonly {
        id: string;
        label: string;
        children?: readonly {
            id: string;
            label: string;
        }[];
    }[];
    layoutSections: Readonly<Record<LayoutId, {
        title: string;
        body: string;
    }>>;
}
