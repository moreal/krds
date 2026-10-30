import {expect,root,part,role,host,manual,events,quiet,request,tag,anchor,patchHost,teardown,form,relation,focusableInside,usableFocus,noInteractive,insideViewport,noHorizontalOverflow,outside,pointer,ownedNative,ownedList} from './catalog-outcome-helpers.mjs';
import {officialMastheadSentence} from './catalog-masthead-inspection.mjs';

export const staticOutcomes={
  masthead:{
    2:async(p,d)=>{const r=root(p,'masthead');await expect(r).toContainText('이 누리집은 대한민국 공식 전자정부 누리집입니다.');await noInteractive(r);await expect(r).not.toHaveAttribute('tabindex','0');await insideViewport(p,r);await quiet(d);},
    3:async(p,d)=>{for(const r of await root(p,'masthead').all()){expect(await r.evaluate(node=>!node.matches('a,button,[role="button"],[aria-live]'))).toBe(true);await noInteractive(r);}await quiet(d);},
  },
  identifier:{
    2:async(p,d,{initialState:s})=>{const img=root(p,'identifier').getByRole('img');await tag(img,'img');await expect(img).toHaveAttribute('alt',s.institutionName);await expect(img).toHaveAccessibleName(s.institutionName);await quiet(d);},
    3:async(p,d,{initialState:s})=>{const institution=part(p,'identifier','logo');await expect(institution).toHaveAttribute('src',s.logo.src);const service=part(p,'footer','logo');await expect(service).toHaveCount(1);expect(await service.evaluate((node,other)=>node!==document.querySelector(other),'[data-krds-component="identifier"][data-krds-part="logo"]')).toBe(true);await expect(root(p,'identifier')).toContainText(s.relationshipText);},
    4:manual('Human visual review of institution logo recognition and contrast across light/dark narrow layouts is required; DOM dimensions cannot establish readability.'),
  },
  header:{
    2:async(p,d,{initialState:s})=>{const trigger=part(p,'header','utility-trigger');await tag(trigger,'button');await trigger.focus();await p.keyboard.press('Enter');await expect(trigger).toHaveAttribute('aria-expanded','true');for(const item of s.utilityItems)await expect(role(p,'link',item.label)).toBeVisible();await p.keyboard.press('Tab');await focusableInside(part(p,'header','utilities'));},
    3:async(p,d,{initialState:s})=>{const home=role(p,'link',s.home.label);await anchor(home,s.home.href);await expect(home).toHaveAccessibleName(s.home.label);await expect(home.getByRole('img')).toHaveAttribute('alt',s.home.logo.alt);await quiet(d);},
    4:async(p,d)=>{await p.setViewportSize({width:360,height:800});const trigger=part(p,'header','mobile-trigger');await trigger.click();const dialog=p.getByRole('dialog');await expect(dialog).toBeVisible();await focusableInside(dialog);await p.keyboard.press('Escape');await expect(dialog).toBeHidden();await expect(trigger).toBeFocused();},
    5:async(p,d)=>{
      await p.evaluate(()=>scrollTo(0,700));const search=part(p,'header','search');
      await search.focus();await insideViewport(p,search);
      // This independent Header case declares no government-service Masthead.
      // A false/absent Masthead is valid, but an official claim is not invented.
      await expect(p.getByText(officialMastheadSentence,{exact:true})).toHaveCount(0);
      for(const masthead of await root(p,'masthead').all()){
        expect(await masthead.evaluate(node=>{
          const parent=current=>current.assignedSlot??current.parentNode??current.host;
          for(let current=node;current;current=parent(current))if(current.nodeType===1&&['fixed','sticky'].includes(getComputedStyle(current).position))return false;
          return true;
        })).toBe(true);
      }
    },
  },
  footer:{
    2:async(p,d)=>{await p.setViewportSize({width:360,height:800});const r=root(p,'footer');await expect(r).toBeVisible();await noHorizontalOverflow(p);const order=await r.evaluate(node=>[...node.querySelectorAll('a')].map(link=>link.textContent));await p.setViewportSize({width:1280,height:800});expect(await r.evaluate(node=>[...node.querySelectorAll('a')].map(link=>link.textContent))).toEqual(order);},
    3:async(p,d,{initialState:s})=>{const privacy=part(p,'footer','privacy-link');await anchor(privacy,s.privacyPolicy.href);await expect(privacy).toHaveAccessibleName(s.privacyPolicy.label);const style=await privacy.evaluate(node=>({weight:getComputedStyle(node).fontWeight,decoration:getComputedStyle(node).textDecorationLine}));expect(Number(style.weight)>=600||style.decoration.includes('underline')).toBe(true);},
    4:async(p,d)=>{const r=root(p,'footer');await r.scrollIntoViewIfNeeded();const box=await r.boundingBox();expect(box.y+box.height).toBeGreaterThanOrEqual(p.viewportSize().height-1);expect(await r.evaluate(node=>!['fixed','absolute'].includes(getComputedStyle(node).position))).toBe(true);},
    5:async(p,d,{initialState:s})=>{const contacts=s.contacts.filter(contact=>contact.href);expect(contacts.length,'Contact URI fixture must contain an actionable contact').toBeGreaterThan(0);for(const contact of contacts){await anchor(role(p,'link',contact.text),contact.href);expect(contact.href).toMatch(/^(tel:|mailto:)/);}},
  },
  'skip-link':{
    2:async(p,d,{initialState:s})=>{const link=role(p,'link',s.links[0].label);await link.focus();await p.keyboard.press('Enter');const target=p.locator(`[id="${s.links[0].targetId}"]`);await expect(target).toBeFocused();await p.keyboard.press('Tab');await focusableInside(target);await quiet(d);},
    3:async(p,d,{initialState:s})=>{const target=p.locator(`[id="${s.links[0].targetId}"]`);await expect(target).toHaveCount(1);await expect(target.locator('nav,header,[data-krds-component="breadcrumb"],[data-krds-component="side-navigation"]')).toHaveCount(0);},
    4:async(p,d,f)=>{await patchHost(p,d,f,{removeTarget:true});await role(p,'link',f.initialState.links[0].label).focus();await p.keyboard.press('Enter');await expect(host(p,'configuration-error')).toContainText(f.initialState.links[0].targetId);await usableFocus(p);await quiet(d);},
    5:async(p,d,{initialState:s})=>{await p.setViewportSize({width:640,height:400});const link=role(p,'link',s.links[0].label);await link.focus();await p.keyboard.press('Enter');const target=p.locator(`[id="${s.links[0].targetId}"]`);await expect(target).toBeFocused();await insideViewport(p,target);},
  },
  breadcrumb:{
    2:async(p,d,{initialState:s})=>{for(const item of s.items.filter(item=>!item.href)){const label=root(p,'breadcrumb').getByText(item.label,{exact:true});await expect(label).toBeVisible();expect(await label.evaluate(node=>node.closest('a[href],button,[tabindex="0"]')===null)).toBe(true);}await quiet(d);},
    3:async(p)=>{expect(await part(p,'breadcrumb','separator').count()).toBeGreaterThan(0);for(const separator of await part(p,'breadcrumb','separator').all())await expect(separator).toHaveAttribute('aria-hidden','true');const snapshot=await root(p,'breadcrumb').ariaSnapshot();expect(snapshot).not.toMatch(/separator|구분자/);},
    4:async(p,d,{initialState:s})=>{await p.setViewportSize({width:360,height:800});const r=root(p,'breadcrumb');await expect(r.getByText(s.home.label,{exact:true})).toBeVisible();await expect(r.getByText(s.items.at(-1).label,{exact:true})).toBeVisible();await expect(r.getByText('…',{exact:true})).toBeVisible();await noHorizontalOverflow(p);},
    5:async(p)=>{const r=root(p,'breadcrumb');const links=r.getByRole('link');expect(await links.count()).toBeGreaterThan(0);for(const link of await links.all()){await link.focus();await expect(link).toBeFocused();await expect(link).toHaveAttribute('href',/.+/);await expect(link).toBeVisible();}await expect(r.locator('button,[tabindex="0"]:not(a)')).toHaveCount(0);},
  },
  'critical-alert':{
    2:async(p,d,{initialState:s})=>{const r=root(p,'critical-alert');await expect(r).toContainText(s.label);await expect(r).toContainText(s.message);await quiet(d);},
    3:async(p,d,{initialState:s})=>{const links=root(p,'critical-alert').getByRole('link');await expect(links).toHaveCount(1);await anchor(links,s.details.href);await expect(links).toHaveAccessibleName(s.details.label);},
    4:async(p)=>{await p.setViewportSize({width:360,height:800});const r=root(p,'critical-alert');expect(await r.evaluate(node=>{
      const parentOf=element=>element.parentNode??element.host;
      for(let ancestor=parentOf(node);ancestor;ancestor=parentOf(ancestor))if(ancestor.nodeType===1&&ancestor.matches('main,[role="main"],nav,[role="navigation"],aside,[role="complementary"],article,footer,[role="contentinfo"],header'))return false;
      const allowedBefore=element=>element.matches('script,style,link,meta,[data-krds-host],[role="status"][aria-label="Fixture health"],[data-krds-component="skip-link"],[data-krds-component="masthead"],[data-krds-component="header"],[data-krds-component="main-menu"]');
      for(let current=node;current&&current!==document.body;current=parentOf(current)){for(let before=current.previousElementSibling;before;before=before.previousElementSibling)if(!allowedBefore(before))return false;}
      return true;
    })).toBe(true);await noHorizontalOverflow(p);},
    5:async(p)=>{const icon=part(p,'critical-alert','icon');await expect(icon).toHaveAttribute('aria-hidden','true');await expect(icon.getByRole('img')).toHaveCount(0);},
  },
  badge:{
    2:async(p,d,{initialState:s})=>{await expect(root(p,'badge')).toHaveText(s.label);await noInteractive(root(p,'badge'));await quiet(d);},
    3:async(p,d,{initialState:s})=>{await p.setViewportSize({width:360,height:800});const label=`${s.label} — ${'긴 예제 상태 표시의 전체 내용을 확인합니다. '.repeat(4)}`;await d.setState({label});for(const badge of await root(p,'badge').all()){await expect(badge).toHaveText(label);await noInteractive(badge);expect(await badge.evaluate(node=>node.scrollWidth<=node.clientWidth+1)).toBe(true);}await noHorizontalOverflow(p);await quiet(d);},
    4:async(p,d,f)=>{await patchHost(p,d,f,{testConfiguration:f.host.invalidConfigurations[0]});await expect(host(p,'configuration-error')).toContainText(f.host.expectedConfigurationError);},
  },
  image:{
    2:async(p)=>{const img=ownedNative(p,'image','img');await tag(img,'img');await expect(img).toHaveAttribute('alt','');await expect(p.getByRole('img')).toHaveCount(0);},
    3:async(p,d,{initialState:s,host:h})=>{const img=ownedNative(p,'image','img');await relation(img,'aria-describedby',h.descriptionText);await expect(p.getByText(h.descriptionText,{exact:true})).toBeVisible();},
    4:manual('Essential visual information and crop equivalence at responsive breakpoints require human image-content review; matching pixels or CSS object-fit is insufficient.'),
    5:async(p,d,f)=>{await patchHost(p,d,f,{imageLink:{href:'/local/application',label:'신청 안내'}});const link=role(p,'link','신청 안내');await anchor(link,'/local/application');await expect(link).toHaveAccessibleName('신청 안내');},
  },
  'text-list':{
    2:async(p,d,{initialState:s})=>{const r=await ownedList(p,'text-list',s.ordered?'ol':'ul');expect(await r.evaluate(node=>{const nested=[...node.querySelectorAll('ul,ol')];return nested.length>=2&&nested.every(list=>list.parentElement.tagName==='LI')&&nested.some(list=>list.parentElement?.closest('ul,ol')?.parentElement?.closest('ul,ol'));})).toBe(true);},
    3:async(p,d,{initialState:s})=>{const r=await ownedList(p,'text-list',s.ordered?'ol':'ul');expect(await r.evaluate(node=>['UL','OL'].includes(node.tagName))).toBe(true);if(await r.evaluate(node=>getComputedStyle(node).listStyleType==='none'))await expect(r).toHaveAttribute('role','list');await expect(r.getByRole('listitem')).not.toHaveCount(0);},
    4:async(p,d)=>{await d.setState({items:[{id:'long',content:'긴 예제 문장 '.repeat(30)}]});await p.setViewportSize({width:360,height:800});const item=root(p,'text-list').locator('li');expect(await item.evaluate(node=>node.scrollWidth<=node.clientWidth+1)).toBe(true);await noHorizontalOverflow(p);},
    5:async(p)=>{await expect(root(p,'text-list')).not.toHaveAttribute('tabindex','0');await noInteractive(root(p,'text-list'));},
  },
  favicon:{
    2:manual('Recognition of the same institution silhouette at actual 16px in light/dark browser chrome requires human visual asset review.'),
    3:async(p,d)=>{const links=await p.locator('head link[rel*="icon"]').evaluateAll(nodes=>nodes.map(node=>node.href));expect(links.length).toBeGreaterThan(0);for(const url of links)expect(new URL(url).origin).toBe(new URL(p.url()).origin);await quiet(d);},
    4:async(p,d,f)=>{const before=await p.locator('head link[rel="icon"]').evaluateAll(nodes=>nodes.map(node=>node.href));await patchHost(p,d,f,{routeChange:true});expect(await p.locator('head link[rel="icon"]').evaluateAll(nodes=>nodes.map(node=>node.href))).toEqual(before);await p.reload();await expect(p.locator('head link[rel="icon"]')).not.toHaveCount(0);},
  },
  link:{
    2:async(p,d,{initialState:s})=>{const r=root(p,'link');await expect(r).not.toHaveAttribute('href',/.+/);await expect(r).not.toHaveAttribute('tabindex','0');await pointer(p,r);await quiet(d);},
    3:async(p)=>{const link=root(p,'link');expect(await link.evaluate(node=>getComputedStyle(node).textDecorationLine.includes('underline'))).toBe(true);},
    4:async(p,d,{initialState:s})=>{const link=root(p,'link');await anchor(link,s.href);await expect(link).toHaveAttribute('target','_blank');await expect(link).toHaveAttribute('rel',/noopener/);expect(await link.getAttribute('aria-label')??await link.textContent()).toMatch(/새 창|새창|new window/i);},
    5:async(p,d,{initialState:s})=>{await expect(root(p,'link')).toHaveAccessibleName(s.label);await expect(root(p,'link')).toContainText(s.label);await quiet(d);},
  },
  table:{
    2:async(p,d,{initialState:s})=>{for(const row of s.rows)for(const column of s.columns)if(row.cells[column.id]==null)await expect(root(p,'table').locator('tbody td').nth(s.columns.indexOf(column))).toHaveText(/^[—-]$/);},
    3:async(p,d,{initialState:s})=>{for(let n=0;n<s.columns.length;n++){const cell=root(p,'table').locator('tbody tr').first().locator('td').nth(n);expect(await cell.evaluate(node=>{const css=getComputedStyle(node);return css.textAlign==='start'?(css.direction==='rtl'?'right':'left'):css.textAlign==='end'?(css.direction==='rtl'?'left':'right'):css.textAlign;})).toBe(s.columns[n].kind==='number'?'right':'left');}},
    4:async(p)=>{await expect(root(p,'table').getByRole('button')).toHaveCount(0);await expect(root(p,'table').locator('[aria-sort]')).toHaveCount(0);},
    5:async(p,d,{initialState:s})=>{const column=s.columns.findIndex(column=>column.id===s.sort.columnId);const button=root(p,'table').locator('thead tr').first().locator(':scope > th').nth(column).getByRole('button');await button.focus();const rows=await root(p,'table').locator('tbody tr').allTextContents();await p.keyboard.press('Enter');await expect(button).toBeFocused();await expect(button.locator('..')).toHaveAttribute('aria-sort','descending');expect(await root(p,'table').locator('tbody tr').allTextContents()).toEqual([...rows].reverse());await request(d,'sortChange',{columnId:s.sort.columnId,direction:'descending'});},
    6:async(p)=>{await p.setViewportSize({width:360,height:800});const region=part(p,'table','scroll-region');const before=await region.evaluate(node=>node.scrollLeft);await part(p,'table','scroll-next').click();await expect.poll(()=>region.evaluate(node=>node.scrollLeft)).toBeGreaterThan(before);},
  },
  'visually-hidden':{
    2:async(p,d,{initialState:s})=>{const style=await p.locator(`[id="${s.id}"]`).evaluate(node=>{const s=getComputedStyle(node);return {display:s.display,visibility:s.visibility,width:parseFloat(s.width),height:parseFloat(s.height),font:parseFloat(s.fontSize)};});expect(style.display).not.toBe('none');expect(style.visibility).toBe('visible');for(const key of ['width','height','font'])expect(style[key]).toBeGreaterThan(0);},
    3:async(p)=>{const control=part(p,'visually-hidden','overlay-control'),surrogate=part(p,'visually-hidden','visible-surrogate');await control.focus();await expect(control).toBeFocused();const a=await control.boundingBox(),b=await surrogate.boundingBox();for(const key of ['x','y','width','height'])expect(a[key]).toBeCloseTo(b[key],0);expect(await surrogate.evaluate(node=>getComputedStyle(node).outlineStyle)).not.toBe('none');},
    4:manual('Screen-reader virtual cursor geometry under zoom requires manual desktop/mobile AT testing; accessibility snapshots cannot prove cursor placement.'),
    5:async(p,d,{initialState:s})=>{await d.setState({lang:'en',content:'Review your application'});const text=p.locator(`[id="${s.id}"]`);await expect(text).toHaveAttribute('lang','en');await expect(text).toHaveText('Review your application');await quiet(d);},
    6:async(p,d,{initialState:s,host:h})=>{const control=role(p,'button',h.visibleControlLabel);await expect(control).toHaveAccessibleName(h.visibleControlLabel);const relations=await control.getAttribute('aria-labelledby');expect(relations?.split(/\s+/).filter(id=>id===s.id).length??0).toBeLessThanOrEqual(1);expect((await control.ariaSnapshot()).split(h.visibleControlLabel).length-1).toBe(1);},
  },
};
