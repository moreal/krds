/** Native Svelte production fixture entry. */
import { mount } from "svelte";
import App from "./App.svelte";
mount(App, { target: document.getElementById("app")! });
