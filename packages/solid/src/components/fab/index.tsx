import { For, Show, createUniqueId, createEffect } from 'solid-js';
import type { FABContract } from '@unofficial-krds/contracts';
import { owned, stateValue, ignoredKey, assertSemanticIds } from '../../internal/catalog';

export type FABProps = FABContract;

export function FAB(props: FABProps) {
  const uid = createUniqueId(); createEffect(()=>{if((props.actions?.length??0)>3)throw new TypeError('FAB supports at most three actions');assertSemanticIds(props.actions??[]);});
  const expanded = stateValue(
    () => props.expanded, props.defaultExpanded, false,
    expanded => props.onExpandedChange?.({ expanded }),
  );
  let trigger!: HTMLButtonElement;

  function collapse() {
    expanded.request(false);
    queueMicrotask(() => {
      if (!expanded.read()) trigger.focus();
    });
  }

  return <div
    {...owned('fab', 'root', expanded.read() ? 'expanded' : 'collapsed')}
    data-krds-variant={props.actions?.length ? 'expandable' : props.showLabel === false ? 'single-icon' : 'extended-label'}
    onKeyDown={event => {
      if (!ignoredKey(event) && event.key === 'Escape' && expanded.read()) {
        event.preventDefault();
        collapse();
      }
    }}
  >
    <Show when={props.actions?.length && expanded.read()}>
      <div {...owned('fab', 'overlay', 'expanded')} aria-hidden="true" onClick={collapse}/>
    </Show>
    <button
      ref={trigger} type="button" {...owned('fab', 'trigger')}
      disabled={props.disabled}
      aria-label={props.showLabel === false ? props.label : undefined}
      aria-expanded={props.actions?.length ? expanded.read() : undefined}
      aria-controls={props.actions?.length ? uid : undefined}
      onClick={() => props.actions?.length ? expanded.request(!expanded.read()) : props.onAction?.()}
    >
      <span aria-hidden="true" {...owned('fab', 'icon')}>
        <Show when={props.icon === 'plus' || props.icon === 'add'} fallback={props.icon}>
          <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" tabIndex={-1}>
            <path d="M12 4v16M4 12h16"/>
          </svg>
        </Show>
      </span>
      <span {...owned('fab', 'label')} hidden={props.showLabel === false}>{props.label}</span>
    </button>
    <Show when={props.actions?.length}>
      <div id={uid} hidden={!expanded.read()} {...owned('fab', 'actions')}>
        <For each={props.actions}>{action =>
          <button type="button" {...owned('fab', 'action')} disabled={props.disabled} onClick={action.onAction}>{action.label}</button>
        }</For>
      </div>
    </Show>
  </div>;
}
