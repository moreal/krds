import { component$ } from '@builder.io/qwik';
import { Pagination } from '../../src/components/pagination';
import { Resize } from '../../src/components/resize';
import { StepIndicator } from '../../src/components/step-indicator';

/** Local-only fixtures for the official KRDS guide checks: no API, CDN or external assets. */
export const PaginationGuide = component$(() => <Pagination defaultPage={15} pageCount={30} hrefTemplate="#page-{page}"/>);
export const ResizeGuide = component$(() => <Resize/>);
export const StepIndicatorGuide = component$(() => <StepIndicator mode="adaptive" steps={[{ id: 'a', label: '약관 확인', status: 'complete', href: '#a' }, { id: 'b', label: '정보 입력', status: 'current' }, { id: 'c', label: '신청 완료', status: 'pending', href: '#c' }]}/>);
