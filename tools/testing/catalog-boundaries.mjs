import {assertMastheadPolicy} from './catalog-masthead-inspection.mjs';
import {expect,root,part,role,tag,ownedNative,ownedList} from './catalog-outcome-helpers.mjs';

/** Native semantic preconditions supplement each distinct outcome action. They
 * prevent empty part-marked shells or role-only replacements from passing a
 * narrow state assertion. They never render UI or replace the outcome itself. */
export async function assertCatalogBoundary(page,fixture) {
  const {componentId:id,initialState:s,host:h}=fixture;
  switch(id) {
    case 'radio-group':
      await tag(role(page,'group',s.label),'fieldset');
      for(const option of s.options){const control=role(page,'radio',option.label);await tag(control,'input');await expect(control).toHaveAttribute('type','radio');await expect(control).toHaveAttribute('name',s.name);}return;
    case 'checkbox': case 'switch': {
      const control=role(page,id==='switch'?'switch':'checkbox',s.label);await tag(control,'input');await expect(control).toHaveAttribute('type','checkbox');await expect(control).toHaveAttribute('name',s.name);return;
    }
    case 'text-input': await tag(role(page,'textbox',s.label),'input');return;
    case 'textarea': await tag(role(page,'textbox',s.label),'textarea');return;
    case 'range-slider': await tag(role(page,'slider',s.label),'input');await expect(role(page,'slider',s.label)).toHaveAttribute('type','range');return;
    case 'quantity-toggle': await tag(part(page,id,'decrement'),'button');await tag(part(page,id,'increment'),'button');await expect(part(page,id,'output')).toContainText(String(s.value??s.defaultValue));return;
    case 'disclosure': await tag(role(page,'button',s.label),'button');return;
    case 'accordion': for(const item of s.items)await tag(role(page,'button',item.title),'button');return;
    case 'badge': {const badges=root(page,id);if(fixture.caseId==='outcome-03'){const samples=[s,...h.samples.map(sample=>({...s,...sample}))];await expect(badges).toHaveCount(samples.length);expect((await badges.evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-krds-size')))).sort()).toEqual(samples.map(sample=>sample.size).sort());for(const badge of await badges.all())await expect(badge).toHaveText(s.label);}else await expect(badges).toHaveText(s.label);return;}
    case 'tag': await expect(root(page,id)).toHaveCount(1);for(const item of s.items)await expect(root(page,id)).toContainText(item.label);return;
    case 'link': await tag(root(page,id),'a');await expect(root(page,id)).toContainText(s.label);return;
    case 'image': await tag(ownedNative(page,id,'img'),'img');await expect(ownedNative(page,id,'img')).toHaveAttribute('alt',s.alt);return;
    case 'text-list': {const list=await ownedList(page,id,s.ordered?'ol':'ul');await expect(list.locator(':scope > li')).toHaveCount(s.items.length);return;}
    case 'table': {
      const table=ownedNative(page,id,'table');await tag(table,'table');await expect(table.locator(':scope > caption')).toHaveText(s.caption);
      const headers=table.locator('thead tr').first().locator(':scope > th');await expect(headers).toHaveCount(s.columns.length);
      for(let column=0;column<s.columns.length;column++){await expect(headers.nth(column)).toContainText(s.columns[column].label);await expect(headers.nth(column)).toHaveAttribute('scope','col');}
      const rows=table.locator('tbody tr');await expect(rows).toHaveCount(s.rows.length);
      for(let row=0;row<s.rows.length;row++){const cells=rows.nth(row).locator(':scope > th, :scope > td');await expect(cells).toHaveCount(s.columns.length);for(let column=0;column<s.columns.length;column++)await expect(cells.nth(column)).toHaveText(String(s.rows[row].cells[s.columns[column].id]??'—'));}
      return;
    }
    case 'masthead': await assertMastheadPolicy(page,fixture);return;
    case 'identifier': await expect(root(page,id)).toContainText(s.relationshipText);await tag(root(page,id).getByRole('img',{name:s.institutionName,exact:true}),'img');return;
    case 'header': await tag(root(page,id),'header');await tag(role(page,'link',s.home.label),'a');return;
    case 'footer': await tag(root(page,id),'footer');await expect(root(page,id)).toContainText(s.copyrightText);return;
    case 'skip-link': for(const link of s.links)await tag(role(page,'link',link.label),'a');return;
    case 'main-menu': case 'side-navigation': case 'in-page-navigation': case 'pagination': case 'breadcrumb': case 'tab-bar':
      await tag(root(page,id),'nav');return;
    case 'structured-list': await expect(root(page,id).locator('[data-krds-part="item"]')).toHaveCount(s.items.length);for(const item of s.items)await expect(root(page,id)).toContainText(item.title);return;
    case 'critical-alert': await expect(root(page,id)).toContainText(s.label);await expect(root(page,id)).toContainText(s.message);return;
    case 'fab': await tag(part(page,id,'trigger'),'button');await expect(part(page,id,'trigger')).toHaveAccessibleName(s.label);return;
    case 'carousel': await expect(part(page,id,'slide')).toHaveCount(s.items.length);for(let n=0;n<s.items.length;n++)await expect(part(page,id,'slide').nth(n)).toContainText(s.items[n].content);return;
    case 'step-indicator': await ownedList(page,id,'ol');for(const step of s.steps)await expect(root(page,id)).toContainText(step.label);return;
    case 'spinner': await expect(root(page,id)).toContainText(s.pending?s.label:s.completionMessage);return;
    case 'help-panel': if(!h.removePanelOpener)await tag(part(page,id,'opener'),'button');if(s.open??s.defaultOpen)await tag(part(page,id,'close'),'button');return;
    case 'tutorial-panel': await tag(part(page,id,'opener'),'button');if(s.open??s.defaultOpen)await tag(part(page,id,'close'),'button');return;
    case 'coach-mark': if(!(s.open??s.defaultOpen)){await tag(page.locator(`[id="${s.startActionId}"]`),'button');await expect(part(page,id,'popover')).toBeHidden();return;}await expect(part(page,id,'popover')).toBeVisible();await expect(part(page,id,'title')).toContainText(s.steps.find(step=>step.id===(s.stepId??s.defaultStepId))?.title??s.steps[0].title);return;
    case 'contextual-help': await tag(role(page,'button',s.triggerLabel),'button');return;
    case 'tooltip': await tag(page.locator(`[id="${s.triggerId}"]`),'button');return;
    case 'tts': await tag(part(page,id,'play'),'button');return;
    case 'file-upload': await tag(part(page,id,'file-input'),'input');await expect(part(page,id,'file-input')).toHaveAttribute('type','file');await tag(role(page,'button','파일 선택'),'button');return;
    case 'language-switcher': if(s.options.length>2)await tag(part(page,id,'trigger'),'button');else await tag(role(page,'link',s.options.find(option=>option.locale!==s.currentLocale).nativeLabel),'a');return;
    case 'resize': await tag(part(page,id,'trigger'),'button');return;
    case 'accessible-media': await tag(part(page,id,'media'),s.media.kind==='audio'?'audio':'video');return;
    case 'visually-hidden': await expect(page.locator(`[id="${s.id}"]`)).toHaveCount(1);return;
    case 'back-button': await tag(role(page,s.canGoBack?'button':'link',s.label),s.canGoBack?'button':'a');return;
    case 'bottom-sheet': await expect(role(page,'dialog',s.title)).toBeVisible();await tag(role(page,'dialog',s.title).getByRole('button',{name:'닫기',exact:true}),'button');return;
    case 'toast': case 'snackbar': await expect(root(page,id)).toHaveCount(1);await expect(root(page,id).getByRole('status')).toContainText(s.message.text);return;
    case 'favicon': await expect(page.locator('head link[rel="icon"]')).not.toHaveCount(0);return;
    default: throw new Error(`No native semantic boundary for ${id}`);
  }
}
