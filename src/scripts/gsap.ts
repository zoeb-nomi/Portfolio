/* GSAP + ScrollTrigger for the pages whose own scripts need them (home scene and Shipped panels, About,
   Builds, Design, the Writing index, the decisions essay). Bundled from npm, pinned in package.json; a page
   that never imports this module never downloads GSAP. The kit's shared motion lives in ./ds without it. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
// Trigger positions are measured before webfonts settle; re-measure once they have.
if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

export { gsap, ScrollTrigger };
