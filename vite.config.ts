import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Build-time edits to the Kage temple renderer in @designcodeio/threeui.
 *
 * Everything the renderer builds lives inside one closure with no exported
 * handles, so there is no runtime way to reach its camera or its materials.
 * These rewrite the relevant source expressions instead.
 *
 * Every edit is asserted: if a future release moves one of these, the build
 * fails naming it rather than silently reverting to the packaged look.
 *
 * The plugin name carries a digest of the edits. That looks odd, but it is
 * load-bearing in dev. Vite imports this module as
 * templeNightRenderer.js?v=<depHash> and serves that URL with
 * Cache-Control: max-age=31536000, immutable. The dep hash comes from the
 * lockfile plus getConfigHash(), which folds in plugins.map((p) => p.name) —
 * the plugin's *name*, not what it does. So editing a find/replace below
 * changes what the file contains while leaving its URL byte-identical, and the
 * browser is entitled to go on serving last year's copy from disk. Restarting
 * the dev server does not help either, because the hash has not moved. Feeding
 * the digest into the name moves it exactly when the output changes.
 */
type Edit = { find: string; replace: string; why: string };

/**
 * One patched source file: every edit in the table must match exactly once,
 * and the digest of that table rides in the plugin name so vite re-hashes the
 * dep URL whenever the output changes (see the note above).
 */
function patchThreeuiSource(label: string, idFragment: string, edits: Edit[]): Plugin {
  const digest = createHash("sha256")
    .update(JSON.stringify(edits))
    .digest("hex")
    .slice(0, 8);

  return {
    name: `patch-${label}-${digest}`,
    transform(code, id) {
      if (!id.includes(idFragment)) return null;

      let out = code;
      for (const { find, replace, why } of edits) {
        const hits = out.split(find).length - 1;
        if (hits !== 1) {
          this.error(
            `patch-${label}: expected exactly one match for the ` +
              `"${why}" edit in ${idFragment}, found ${hits}. ` +
              `@designcodeio/threeui has likely changed.`
          );
        }
        out = out.replace(find, replace);
      }
      return { code: out, map: null };
    },
  };
}

/** Build-time edits to the Kage temple renderer. */
const templeEdits: Edit[] = [
    {
      why: "scroll-driven camera",
      // The renderer ships the landing page's full fly-through: a Catmull-Rom
      // spline through six waypoints (hero, sanmon, gardens, craft, afterlight,
      // footer), each with its own look-at target and fov, driven by `L.smooth`
      // over 0..waypoints-1. The packaged component pins that to zero every
      // frame, so the camera never leaves the hero waypoint. Ease it toward the
      // page's scroll position instead — `xe` is the renderer's own damping
      // helper, so the motion between waypoints stays smooth.
      find: "L.prog = 0, L.smooth = 0, L.intro = 1,",
      replace:
        "L.prog = (globalThis.__templeScrollProgress ?? 0) * (me.length - 1), " +
        "L.smooth = xe(L.smooth, L.prog, 2.4, t), L.intro = 1,",
    },
    {
      why: "moon disc: brighter and far more saturated red",
      // Linear, not tone-mapped. The composite tone-maps at the end, so red
      // alone tops out around 190/255 — the vividness has to come from pulling
      // green and blue right down rather than from pushing red up.
      find: "color: Me(3.6, 0.64, 0.61)",
      replace: "color: Me(7.2, 0.26, 0.2)",
    },
    {
      why: "moon halo: shared gradient builder",
      // Declared once at the top of kt(), where both the corona and the wide
      // halo below can close over it. It used to be assigned inline as a side
      // effect of the corona's `map:` property and read back by the other edit,
      // which meant the wide halo blew up with "not a function" the moment the
      // two edits were out of step. A plain declaration ahead of both uses can't
      // get into that state.
      //
      // Locals are named to avoid the surrounding scope entirely: `k` out there
      // is the scene and `a` is the very mesh whose constructor argument calls
      // this, so it is still in its temporal dead zone while this runs.
      //
      // Evaluated per pixel in float rather than handed to createRadialGradient,
      // which lets the ramp be dithered into the quantisation: value + U(-.5,.5),
      // which Uint8ClampedArray then rounds, preserving the true mean while
      // breaking 8-bit contours into noise. Measured, this is a refinement and
      // not the fix — it takes the longest flat run across the outer falloff
      // from 10 texels to 8, because the ramp already moves about an LSB every
      // two or three texels and the composite grain covers most of what is left.
      // Dithering has to happen before the 8-bit write: noising getImageData
      // afterwards only adds grain, since the sub-LSB detail is gone by then.
      find: "function kt() {",
      replace:
        "function kt() {" +
        "const glowTex = (S) => O((() => {" +
        'const cv = E(512, 512), cx = cv.getContext("2d"), ' +
        "im = cx.createImageData(512, 512), px = im.data;" +
        "for (let sy = 0; sy < 512; sy++) for (let sx = 0; sx < 512; sx++) {" +
        "const ox = sx - 255.5, oy = sy - 255.5;" +
        "let t = Math.sqrt(ox * ox + oy * oy) / 256; if (t > 1) t = 1;" +
        "let kk = 1; while (kk < S.length - 1 && S[kk][0] < t) kk++;" +
        "const p0 = S[kk - 1], p1 = S[kk], f = (t - p0[0]) / (p1[0] - p0[0])," +
        "idx = (sy * 512 + sx) * 4, n = Math.random() - 0.5;" +
        "px[idx] = p0[1] + (p1[1] - p0[1]) * f + n;" +
        "px[idx + 1] = p0[2] + (p1[2] - p0[2]) * f + n;" +
        "px[idx + 2] = p0[3] + (p1[3] - p0[3]) * f + n;" +
        "px[idx + 3] = 255; }" +
        "cx.putImageData(im, 0, 0); return cv;" +
        "})());",
    },
    {
      why: "moon halo: smooth atmospheric falloff instead of a flat red disc",
      // `ue()`'s stops are fixed at 0 / 0.28 / 0.62 / 1, and the moon's rim lands
      // at 0.31 of this plane's radius — so the packaged gradient put its mid
      // stop almost exactly on the rim and then fell off a cliff to 0.07 right
      // after it. Worse, its outer two stops are hard-coded white, so luminance
      // climbs again past the rim even as alpha falls: measured along a radius
      // the packaged halo goes .104 -> .105 -> .114 -> .117 before it drops.
      // That rising shoulder is a pale ring pinned to the moon's edge, and it is
      // what reads as tacky. Replace the texture with a monotone decay that
      // never shoulders and never leaves the red family: warm ember nearest the
      // disc, deepening outward, brightness falling away to nothing.
      //
      // The falloff is carried in RGB against black rather than in alpha. Under
      // additive blending black contributes nothing, so the two are equivalent
      // on screen — but staying opaque keeps getImageData off the premultiply
      // round-trip, which shreds precision exactly where this is faintest.
      //
      // Kept off the top end deliberately: the disc draws over this with normal
      // blending, so a hot core would only surface as a blown ring bleeding
      // through the rim's antialiased edge — the artefact being fixed.
      find: 'O(ue("rgba(255,124,112,.90)", "rgba(206,52,48,.26)"))',
      replace:
        "glowTex([[0, 217, 117, 82], [.1, 184, 75, 48], [.2, 139, 41, 24], " +
        "[.31, 93, 20, 12], [.42, 55, 10, 6], [.55, 29, 4, 3], [.68, 14, 2, 1], " +
        "[.8, 6, 1, 1], [.9, 2, 0, 0], [1, 0, 0, 0]])",
    },
    {
      why: "moon: wide atmospheric halo behind the corona",
      // One plane can only carry one falloff. This is the far, very faint wash
      // that gives the moon some air around it — the reading runs disc ->
      // corona -> atmosphere -> night rather than stopping at the corona's edge.
      //
      // Parented to the corona rather than added to the scene, so the narrow
      // aspect reposition in Bt() — which only knows about W.moon and
      // W.moonHalo — carries it along instead of leaving it behind.
      find: "a.position.set(Y.x, Y.y, Y.z - 0.3), a.renderOrder = 0, k.add(a), W.moonHalo = a;",
      replace:
        "a.position.set(Y.x, Y.y, Y.z - 0.3), a.renderOrder = 0, k.add(a), W.moonHalo = a;" +
        "(() => {" +
        "const wh = new o.Mesh(new o.PlaneGeometry(Y.r * 14, Y.r * 14), new o.MeshBasicMaterial({" +
        "map: glowTex([[0, 46, 10, 6], [.14, 34, 7, 4], [.3, 22, 5, 3], " +
        "[.5, 12, 3, 2], [.72, 5, 1, 1], [1, 0, 0, 0]])," +
        "transparent: true, blending: o.AdditiveBlending, depthWrite: false," +
        // no opacity key at all — it defaults to 1 and the level is baked into
        // the stops, which also keeps this clear of the "opacity: 0.3" anchor
        // the hall-bloom edit further down matches on
        "fog: false }));" +
        "wh.position.z = -0.3; wh.renderOrder = -1; a.add(wh);" +
        "})();",
    },
    {
      why: "moon halo: initial opacity",
      // Only seeds the material — the per-frame line below is what actually
      // governs it, so the two are kept in step.
      find: "opacity: 0.44",
      replace: "opacity: 0.62",
    },
    {
      why: "moon halo: opacity the render loop actually holds it at",
      // The packaged loop rewrites material.opacity from a hard-coded 0.44 base
      // every frame, so the constructor edit above was being overwritten before
      // it ever reached the screen — the halo has been sitting at the packaged
      // level this whole time regardless of what that edit said.
      find: "W.moonHalo.material.opacity = 0.44 + t * 0.1",
      replace: "W.moonHalo.material.opacity = 0.62 + t * 0.1",
    },
    {
      why: "lanterns: emissive paper panes rather than flat unlit quads",
      // The four 0.34 panes shared one MeshBasicMaterial holding a single
      // constant colour, which is what makes each lamp read as a flat bright
      // rectangle. That colour also sits at luminance 0.71 — under the bright
      // pass's 0.86 threshold — so the cores never reached the bloom chain at
      // all. Make the panes genuinely emissive and drive the emissive through a
      // radial gradient instead: a hot centre decaying to deep amber at the
      // pane edge. Centre luminance lands near 1.7 and clears the threshold
      // outright, the edge stays near 0.53 and never blooms, so each lamp blows
      // out only at its core. `toneMapped` is deliberately dropped — with the
      // post chain off (?post=0) the renderer's own ACES pass has to roll this
      // off or an HDR emissive clips straight back to a flat white slab.
      find: "new o.MeshBasicMaterial({ color: Me(2.3, 0.3, 0.085), fog: !1, toneMapped: !1 })",
      replace:
        "new o.MeshStandardMaterial({ color: 0, roughness: 1, metalness: 0, " +
        "emissive: 0xFFD18A, emissiveIntensity: 2.6, fog: !1, " +
        // `ie` memoises the canvas across all six lanterns; `E` and `O` are the
        // renderer's own canvas and CanvasTexture helpers
        'emissiveMap: ie("lanternPaneGlow", () => O((() => {' +
        'const cv = E(128, 128), cx = cv.getContext("2d"), ' +
        "gd = cx.createRadialGradient(64, 64, 0, 64, 64, 74);" +
        'gd.addColorStop(0, "rgb(255,240,214)");' +
        'gd.addColorStop(.24, "rgb(255,206,140)");' +
        'gd.addColorStop(.55, "rgb(236,150,72)");' +
        'gd.addColorStop(.82, "rgb(176,92,34)");' +
        'gd.addColorStop(1, "rgb(120,56,18)");' +
        "cx.fillStyle = gd; cx.fillRect(0, 0, 128, 128); return cv;" +
        "})())) })",
    },
    {
      why: "lanterns: warm amber point light with a wider spill",
      // Was 0xFF5A24 at intensity 2.6 over 9 units. Decay was already 2, so the
      // falloff itself was fine — it just had no reach. Warmer colour and a
      // longer radius so the light actually lands on the stone, the stairs and
      // the wood around each lamp. Kept in scale with the renderer's other
      // point lights (the hall light is 2.3 over 15, the far one 3 over 46).
      find: "new o.PointLight(16734756, 2.6, 9, 2)",
      replace: "new o.PointLight(0xFFB35C, 4.2, 14, 2)",
    },
    {
      why: "lanterns: shadows for the two nearest lamps",
      // Only the first two Ge() calls — the pair flanking the hero view — get a
      // shadow, so this costs two cube maps rather than six. They never move, so
      // the map is rendered once and then frozen, the same trick the renderer
      // already uses for its key light.
      find: "W.lanternLights = W.lanternLights || [], W.lanternLights.push(x),",
      replace:
        "W.lanternLights = W.lanternLights || [], " +
        "(Pe && !K && W.lanternLights.length < 2 && (x.castShadow = !0, " +
        "x.shadow.mapSize.set(512, 512), x.shadow.camera.near = 0.3, " +
        "x.shadow.camera.far = 15, x.shadow.bias = -0.0035, " +
        "x.shadow.normalBias = 0.045, x.shadow.autoUpdate = !1, " +
        "x.shadow.needsUpdate = !0)), W.lanternLights.push(x),",
    },
    {
      why: "lanterns: flicker around the new base intensity",
      // The per-frame flicker rewrites intensity from a hard-coded 2.6 every
      // frame, so without this the constructor change above is dead on arrival.
      find: "e.intensity = 2.6 * (1 + t * 0.55)",
      replace: "e.intensity = 4.2 * (1 + t * 0.55)",
    },
    {
      why: "lanterns: amber core on the near glow plane",
      // Inner stop of the 3.4 billboard sitting over the lamp head.
      find: "rgba(255,120,60,.9)",
      replace: "rgba(255,176,92,.9)",
    },
    {
      why: "lanterns: amber mid-stop on the near glow plane",
      // `ue`'s stops are fixed at 0 / 0.28 / 0.62 / 1, so this is the ring just
      // outside the lamp head — the hand-off from the core to the wide halo.
      find: "rgba(255,60,24,.28)",
      replace: "rgba(255,138,56,.42)",
    },
    {
      why: "lanterns: wide warm halo behind the near glow",
      // A second, much larger and much fainter plane behind the one above, so
      // the falloff runs core -> near glow -> halo -> darkness rather than
      // stopping dead at the edge of a single billboard. This is also what
      // reads as light hanging in the fog, since FogExp2 itself is unlit.
      find: "g.position.y = 1.66, g.renderOrder = 2, n.add(g), g.userData.billboard = !0;",
      replace:
        "g.position.y = 1.66, g.renderOrder = 2, n.add(g), g.userData.billboard = !0;" +
        "(() => {" +
        "const wg = new o.Mesh(new o.PlaneGeometry(8.4, 8.4), new o.MeshBasicMaterial({" +
        'map: O(ue("rgba(255,168,86,.4)", "rgba(255,120,44,.18)")),' +
        "transparent: true, blending: o.AdditiveBlending, depthWrite: false," +
        // written without a leading zero so it cannot collide with the
        // "opacity: 0.3" anchor the hall-bloom edit below matches on
        "fog: false, opacity: .32 }));" +
        "wg.position.y = 1.66; wg.renderOrder = 1; n.add(wg);" +
        // the packaged billboard pass only walks W.lanternGlows, so the halo has
        // to join that list too — otherwise it stays pinned facing +Z and turns
        // edge-on as the scroll camera swings past
        "(W.lanternGlows = W.lanternGlows || []).push(wg);" +
        "})();",
    },
    {
      why: "gate light: overhead source, held above the top of frame",
      // Nothing lights the torii from above, and there is no hook to add to the
      // scene at runtime — so append to the torii's own construction, where the
      // scene (`k`), three (`o`) and the gradient/texture helpers are in scope.
      //
      // The source sits at y 26, clear of the top of the frame at every waypoint:
      // the hero view tops out near y 13 at the gate's depth, and near y 20 once
      // the narrow-aspect rig in Qt() pulls the camera back and widens the fov.
      // So what reads on screen is the light landing on the gate, never the lamp.
      //
      // Lifting it from y 5.8 to y 26 takes the throw from ~1.6 units to ~19, and
      // decay 2 is inverse-square, so intensity has to climb by roughly the square
      // of that ratio just to stand still. 400 lands a little under the old peak
      // on purpose — overhead light should read softer and flatter than the
      // hotspot it replaces — and the 34 cutoff keeps the pool around the gate
      // instead of washing the whole valley.
      find: "k.add(t), W.torii = t;",
      replace:
        "k.add(t), W.torii = t, (() => {" +
        "const gg = new o.Mesh(new o.PlaneGeometry(18, 18), new o.MeshBasicMaterial({" +
        'map: O(ue("rgba(255,255,255,.95)", "rgba(228,240,255,.42)")),' +
        "transparent: true, blending: o.AdditiveBlending, depthWrite: false," +
        // written without a leading zero so it cannot collide with the
        // "opacity: 0.3" anchor the hall-bloom edit below matches on
        "fog: false, opacity: .5 }));" +
        "gg.position.set(0, 26, -8.4); gg.renderOrder = 3; k.add(gg); W.gateGlow = gg;" +
        "const gl = new o.PointLight(16777215, 400, 34, 2);" +
        "gl.position.set(0, 26, -8.4); k.add(gl); W.gateLight = gl;" +
        "})();",
    },
    {
      why: "temple windows: brighter lit paper panels",
      find: "color: Me(1.06, 0.48, 0.18)",
      replace: "color: Me(2, 0.95, 0.36)",
    },
    {
      why: "temple windows: stronger bloom out of the hall",
      find: "opacity: 0.3",
      replace: "opacity: 0.55",
    },
    {
      why: "bloom: stronger contribution in the composite",
      // The renderer already owns a full bright-pass -> 4-level blur -> ACES
      // composite chain, so there is no UnrealBloomPass to add — this is its
      // strength dial. Held deliberately low: the lantern cores now sit at
      // roughly the same luminance as the moon, and anything higher starts
      // lifting the hall windows and the moon with them, which would brighten
      // the whole scene rather than just the lamps.
      //
      // The bright pass's threshold is left alone at 0.86. It is already inside
      // the 0.7-0.9 band, and it is the reason only the lamp cores bloom while
      // their own falloff does not — lowering it would pull mid-tones in.
      find: "uBloom: { value: 0.34 }",
      replace: "uBloom: { value: 0.5 }",
    },
    {
      why: "bloom: wider, softer halo",
      // Weight on each coarser mip as the levels are accumulated back up, which
      // is this chain's equivalent of a bloom radius. Higher favours the larger
      // blurs, so the glow spreads further and stays soft instead of ringing
      // tightly around the lamp.
      find: "T.up.uniforms.uAmt.value = 0.52;",
      replace: "T.up.uniforms.uAmt.value = 0.62;",
    },
];

/**
 * The showcase's live-demo CTA is threeui's SpinningBorderButton. Its label is
 * baked into the sandboxed srcdoc the component renders — there is no prop for
 * it — and the packaged wording, "Request Demo", reads as a sales enquiry
 * rather than a link to something already running. Rewrite it at the source.
 */
const liveDemoButtonEdits: Edit[] = [
  {
    why: "live demo button: label",
    // The surrounding button carries Tailwind's `uppercase`, so the rendered
    // label reads LIVE DEMO.
    find: ">Request Demo</span>",
    replace: ">Live Demo</span>",
  },
  {
    why: "live demo button: transparency and hover bridge",
    // Two things the packaged embed cannot do on its own.
    //
    // Background: the effect host injects `body { background: #111318
    // !important }` into every isolated srcdoc, which lands on the showcase as
    // a hard-edged charcoal rectangle. That rule is injected *after* this block,
    // so a matching `body { ... !important }` here loses on source order —
    // `html body` outranks it on specificity and wins regardless of order.
    // The host rule is `html, body { ... }`, and it also sets `color-scheme:
    // dark`, which by itself gives the iframe an opaque UA canvas — so both
    // declarations have to be beaten, on the root as well as on body. A plain
    // `html` selector ties the host on specificity and then loses on order;
    // `:root` (0,1,0) outranks it, and `html body` (0,0,2) outranks the body
    // half. Both halves are needed: the root background alone still paints
    // opaque, and so does resetting color-scheme alone. Measured against the
    // live srcdoc rather than reasoned about.
    // Patching the source's own `background: #000000` instead does nothing;
    // the host's rule overrides that too. The pill keeps its own zinc gradient.
    //
    // Hover: the spinning border is opacity-0 until :hover, and the anchor
    // wrapping this has to take the pointer for the link to work at all — so
    // the iframe never sees :hover and the beam would never run. Nothing in the
    // srcdoc listens for messages, so add the bridge here: LiveDemoButton posts
    // { threeuiRuntime: { hover } } on enter/leave and focus/blur, and these
    // rules stand in for the hover classes. The spans are, in order, the conic
    // spin beam, the static border it replaces, and the button surface.
    //
    // !important throughout because Tailwind ships from its CDN at runtime and
    // injects its utilities after this block.
    find: ["  </style>", "</head>"].join("\n"),
    replace: [
      "  </style>",
      "  <style>",
      "    :root, html body { background: transparent !important; color-scheme: normal !important; }",
      "    body.threeui-hover button.group {",
      "      transform: translateY(-2px);",
      "      box-shadow: 0 0 25px rgba(255, 255, 255, 0.1);",
      "    }",
      "    body.threeui-hover button.group > span:nth-child(1) { opacity: 1 !important; }",
      "    body.threeui-hover button.group > span:nth-child(2) { opacity: 0 !important; }",
      "    body.threeui-hover button.group > span:nth-child(3) { color: #fff !important; }",
      "  </style>",
      "  <script>",
      '    addEventListener("message", function (event) {',
      "      var runtime = event.data && event.data.threeuiRuntime;",
      '      if (!runtime || typeof runtime.hover === "undefined") return;',
      '      document.body.classList.toggle("threeui-hover", !!runtime.hover);',
      "    });",
      "  <\\/script>",
      "</head>",
    ].join("\n"),
  },
];

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    patchThreeuiSource(
      "temple-renderer",
      "temple-night/templeNightRenderer",
      templeEdits
    ),
    patchThreeuiSource(
      "live-demo-button",
      "neuform-isolated/sources/spinning-border-button",
      liveDemoButtonEdits
    ),
  ],
  // the transform above has to see the package's real source, which it can't if
  // esbuild pre-bundles it into node_modules/.vite/deps
  optimizeDeps: {
    exclude: ["@designcodeio/threeui"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
