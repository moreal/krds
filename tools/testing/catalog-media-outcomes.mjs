import {expect,root,part,role,manual,partial,quiet,tag,insideViewport} from './catalog-outcome-helpers.mjs';
export async function captionSemantics(page,fixture) {
  const media=part(page,'accessible-media','media');await tag(media,'video');
  await expect.poll(()=>media.evaluate(node=>node.readyState)).toBeGreaterThanOrEqual(1);
  expect(fixture.initialState.captionTracks.length).toBeGreaterThan(0);
  for(const expected of fixture.initialState.captionTracks){
    const track=media.locator(`track[srclang="${expected.lang}"]`);await expect(track).toHaveCount(1);await expect(track).toHaveAttribute('kind','captions');await expect(track).toHaveAttribute('label',expected.label);await expect(track).toHaveAttribute('src',expected.src);
    const url=new URL(expected.src,page.url());expect(url.origin).toBe(new URL(page.url()).origin);const response=await page.request.get(url.href);expect(response.ok()).toBe(true);expect(response.headers()['content-type']).toContain('text/vtt');
    await track.evaluate(node=>node.track.mode='hidden');await expect.poll(()=>track.evaluate(node=>node.readyState)).toBe(2);
    const data=await track.evaluate(node=>({duration:node.parentElement.duration,cues:[...node.track.cues].map(cue=>({start:cue.startTime,end:cue.endTime,text:cue.text}))}));
    expect(data.cues.length).toBeGreaterThan(0);for(const cue of data.cues){expect(cue.start).toBeGreaterThanOrEqual(0);expect(cue.end).toBeGreaterThan(cue.start);expect(cue.end).toBeLessThanOrEqual(data.duration+.1);expect(cue.text.trim().length).toBeGreaterThan(0);}expect(data.cues.some(cue=>/\[.+\]|[:：]/.test(cue.text)),'Caption fixture identifies a speaker or meaningful sound').toBe(true);
  }
}
export const mediaOutcomes={
  'accessible-media':{
    2:partial(async(p,d,f)=>{const media=part(p,'accessible-media','media');await tag(media,'video');await expect(media).toHaveAttribute('controls','');await expect(root(p,'accessible-media')).toContainText(f.initialState.transcript.content);await expect.poll(()=>media.evaluate(node=>node.readyState)).toBeGreaterThanOrEqual(1);expect(await media.evaluate(node=>node.paused)).toBe(true);await quiet(d);},'A human must watch the actual silent video and confirm that its descriptive transcript covers every essential visual event; browser metadata cannot establish equivalence.'),
    3:partial(async(p,d,f)=>{await captionSemantics(p,f);await quiet(d);},'Timed cues are loaded and bounded by actual media duration, but accurate speaker/sound wording and audiovisual synchronization require human content review.'),
    4:async(p,d,f)=>{const media=part(p,'accessible-media','media');await media.focus();await p.keyboard.press('Space');await expect.poll(()=>media.evaluate(node=>node.paused)).toBe(false);await p.keyboard.press('Space');await expect.poll(()=>media.evaluate(node=>node.paused)).toBe(true);if(f.initialState.transcript.href){const alternatives=root(p,'accessible-media').getByRole('link');await expect(alternatives).toHaveAttribute('href',f.initialState.transcript.href);await alternatives.focus();await expect(alternatives).toBeFocused();}else{await expect(part(p,'accessible-media','transcript')).toHaveText(f.initialState.transcript.content);await expect(part(p,'accessible-media','transcript')).toBeVisible();}},
    5:partial(async(p,d,f)=>{await p.setViewportSize({width:360,height:600});await captionSemantics(p,f);await insideViewport(p,part(p,'accessible-media','media'));},'Human narrow/zoom playback review must verify that rendered native captions do not obscure meaningful video content; cue and media bounds alone cannot prove this.'),
    6:manual('Media/alternative-content update equivalence is a content-production review obligation; a human must review each revised media asset with its transcript/captions/descriptions before acceptance.'),
  },
};
