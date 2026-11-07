import { useState } from 'react';
import type { ImageContract } from '@unofficial-krds/contracts';
import { part } from '../../catalog-utils.js';
export type ImageProps = ImageContract;
export function Image({ src, alt, width, height, srcset, sizes, loading = 'lazy', decorative = false, caption, descriptionId }: ImageProps) { const [state, setState] = useState(''); const sourceKey = `${src}\n${srcset ?? ''}`; const [stateKey, setStateKey] = useState(sourceKey); if (stateKey !== sourceKey) { setStateKey(sourceKey); setState(''); } if (decorative && alt !== '')
    throw new TypeError('Decorative images require empty alt.'); return <figure {...part('image', 'figure', state)}><img {...part('image', 'root', state)} src={src} alt={alt} width={width} height={height} srcSet={srcset} sizes={sizes} loading={loading} aria-describedby={descriptionId} onLoad={() => setState('loaded')} onError={() => setState('error')}/>{caption && <figcaption {...part('image', 'caption')}>{caption}</figcaption>}{state === 'error' && <span {...part('image', 'description')}>이미지를 불러올 수 없습니다.</span>}</figure>; }
