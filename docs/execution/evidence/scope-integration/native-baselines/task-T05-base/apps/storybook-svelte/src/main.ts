/** T01 compiler probe only. */
import { mount } from "svelte";
import App from "./App.svelte";
mount(App, { target: document.getElementById("app")! });
