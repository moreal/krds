import { hydrate } from 'svelte';
import PatternStory from '../apps/storybook-svelte/src/stories/patterns/PatternStory.svelte';
import '@unofficial-krds/styles/all.css';
hydrate(PatternStory, { target: document.getElementById('app'), props: window.__PATTERN_PROPS__ });
window.__PATTERN_HYDRATED__ = true;
