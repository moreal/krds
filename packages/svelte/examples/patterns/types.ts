/** Structural presentation data. No fixture model, action, request, URL or bridge dependency. */
export interface Identity {
    name: string;
    notice: string;
    dataNotice: string;
    copyrightText: string;
}
export interface Option {
    value: string;
    label: string;
}
export interface FormView {
    phase: string;
    values: {
        title: string;
        category: string;
        detail: string;
    };
    errors: {
        field: 'title' | 'category' | 'detail';
        targetId: string;
        errorId: string;
        message: string;
    }[];
    error: string | null;
    receipt: ({
        id: string;
        title: string;
    }) | null;
}
export interface SearchView {
    phase: string;
    query: string;
    appliedQuery: string;
    category: string;
    page: number;
    pageCount: number;
    total: number;
    error: string | null;
    items: {
        id: string;
        title: string;
        category: string;
        date: string;
        summary: string;
    }[];
}
export interface ConsentView {
    phase: string;
    requiredChoice: boolean | null;
    optionalChoice: boolean;
    modalOpen: boolean;
    error: string | null;
    receipt: {
        id: string;
        requiredChoice: boolean | null;
        optionalChoice: boolean;
    } | null;
}
export interface NavigationItem {
    id: string;
    label: string;
    href?: string;
    children?: readonly NavigationItem[];
}
export interface LayoutView {
    currentId: string;
    expandedIds: string[];
    mobileOpen: boolean;
}
