# 3D Automotive Dashboard Lab

**An original performance cockpit, made to be explored.**

[Open the live lab](https://saaeiddev.github.io/3D-Automotive-Dashboard-Lab/)

Created by **Amir Saeid Dehghan**.

AERON GT is a fictional premium performance vehicle. Its DriveOS interface connects an interactive Three.js interior with animated instruments, media, climate, cabin lighting, driver-assistance demonstrations and technical explanations. The visual language uses graphite, black, brushed metal and restrained orange accents, with angular controls and driver-focused layouts.

This is an educational interactive visualization. Vehicle data, navigation, phone connections, camera images, parking and ADAS behavior are simulated. It does not connect to or control a real vehicle, collect location data, access contacts, place calls or provide a physics-accurate driving model. It is not affiliated with BMW or any other manufacturer.

## Features

- An original, modeled 3D cockpit, PBR materials, HDR environment reflections, soft shadows and day/night lighting.
- Ten smoothly interpolated camera presets, mouse orbit/zoom, touch rotation and pinch zoom.
- Clickable cabin controls, contextual hotspots and educational system information.
- A continuous curved display with independently drawn cluster and infotainment regions.
- Live speed, RPM, gear, mode, fuel, navigation, speed-limit and lane-assistance indicators.
- A synchronized windshield HUD.
- Five drive profiles: Comfort, Sport, Sport+, Eco and Individual.
- Functional Home, Navigation, Media, Phone, Vehicle, Performance, Climate, ADAS, Cameras, Lighting and Settings sections.
- Original synthesized ambient audio, media transport, seeking, favorites and volume.
- Dual-zone temperature, seven fan settings, A/C, airflow direction and mutually exclusive seat heating/ventilation.
- Six ambient colors and brightness control, applied to actual 3D emissive light guides and a cabin light.
- Responsive desktop layout and a collapsible mobile DriveOS panel.
- Local preference persistence, a loading indicator, HDR fallback lighting, runtime and WebGL error handling.

## 3D cockpit

The cabin is an **original procedural model authored for this project**, not a purchased OEM model or a scanned production-car interior. No proprietary vehicle mesh or branded cockpit assets are included.

The instrument panel uses swept cross-section surfaces. The cabin combines custom extruded profiles, curved tubes, padded seat sections, beveled hardware and a curved display. Details include a flat-bottom steering wheel, switch packs, rear paddles, metallic vent louvers, electronic selector, knurled controller, charging tray, cup holders, sport seats, stitching, perforation textures, door pulls, speaker panels, mirror housings, pedals, windshield and structural pillars.

Materials use generated leather grain, perforation, carbon-weave and brushed-metal textures. These small deterministic textures are generated locally. The studio environment is bundled and has a procedural fallback. The project has no runtime dependency on external CDNs.

This is an interactive web visualization rather than an OEM CAD model or a photogrammetric digital twin. Camera limits reduce common clipping; the free view is not a collision-solving first-person controller.

## DriveOS and infotainment

| Section | Behavior |
| --- | --- |
| Home | Navigation card, media/climate/performance/ADAS widgets, overview values |
| Navigation | Original illustrative route, next turn and pause/resume guidance |
| Media | Three procedural music programs, play/pause, next/previous, progress, volume and favorite |
| Phone | Explicit demo connection and simulated contact actions; no real calls |
| Vehicle | Five profiles and individual subsystem configuration |
| Performance | 0–260 km/h, 0–8000 RPM, selectable gear, illustrative telemetry, G display and lap timing |
| Climate | Dual-zone setpoints, fan, A/C, airflow and seat comfort |
| ADAS | Eight individually controlled assistance states and a road diagram |
| Cameras | Four directional diagrams and a synthesized overhead parking diagram |
| Lighting | Six light-guide colors, intensity and night environment |
| Settings | HUD, day/night, rendering density, local preference reset |

The in-cabin displays and HUD use canvas textures refreshed at a capped rate. Gauge readings interpolate independently of the React interface. The Start drive control runs a deterministic illustrative speed/gear/RPM sequence. Editing speed or RPM stops that sequence so the user's value remains in control.

## Performance mode

The cluster accents react to the selected profile. Performance controls expose speed, engine RPM, gear, indicative output and temperature values, G visualization and a lap timer. Power, torque, G readings, range and temperatures are illustrative and must not be interpreted as engineering measurements. Lap timing is a user-controlled software stopwatch.

Individual configuration covers engine response, steering, suspension, transmission, traction and exhaust selection. These are UI configuration states; they do not alter a physical vehicle simulation or create real exhaust audio.

## ADAS and sensor visualization

The lab explains adaptive cruise, lane keeping, lane departure warnings, forward collision warnings, automatic emergency braking, blind-spot monitoring, traffic-sign recognition and parking assistance.

ADAS and Sensor View switch to an original exterior vehicle schematic. Color-coded sectors show illustrative front radar, forward camera, rear-corner radar and near-field coverage. Coverage is schematic, not a measured sensor specification. Real assistance systems have significant environmental and operating limitations.

## Surround camera and parking demonstration

Front, rear, left and right camera diagrams explain the separate viewpoints. Surround shows how corrected camera images can form a virtual overhead view. The app deliberately labels this as a demonstration; it does not claim to render real cameras or perform image stitching.

Obstacle distance can be set continuously from 20–150 cm or with 120/80/50/30 cm presets. Warning colors intensify with proximity. Sound is muted by default; enabling it produces shorter beep intervals at closer distances. Audio uses Web Audio API and requires a user gesture.

## Controls

| Input | Action |
| --- | --- |
| Drag / one finger | Orbit the current camera target |
| Mouse wheel / pinch | Zoom |
| Camera presets | Driver, Dashboard, Infotainment, Cluster, Steering Wheel, Center Console, Passenger, Interior Overview, ADAS, Sensor View |
| Explore systems | Show clickable model hotspots |
| Click cabin screen / control | Open its system or activate its shortcut |
| Steering switches | Media playback, track change, volume, cruise, assistance, cluster and voice-demo feedback |
| Rear paddles | Increase/decrease displayed forward gear |
| Start drive | Start or pause automatic simulated telemetry |
| Drive mode selector | Change profile and cluster accent |
| Escape | Close help, system details and mobile panel |

## Technology

- TypeScript, React 19, Vite 6
- Three.js, WebGL 2, OrbitControls, RGBELoader and PMREM
- Canvas-generated instrument/infotainment textures
- CSS, inline SVG interface diagrams, Lucide icons
- Web Audio API for original synthesized audio
- Playwright for browser QA

Node.js 22 or newer is recommended. The lockfile pins the resolved dependency graph.

## Installation and development

```bash
git clone https://github.com/saaeiddev/3D-Automotive-Dashboard-Lab.git
cd 3D-Automotive-Dashboard-Lab
npm ci
npm run dev
```

Open the URL printed by Vite. If the environment restricts network interface enumeration, use:

```bash
npx vite --host 127.0.0.1
```

## Production build

```bash
npm run build
npm run preview
```

TypeScript checks run before Vite. The build output is `dist/`. `base: './'` produces relative asset paths suitable for the repository's GitHub Pages subdirectory. HDR and font paths remain case-sensitive and local. The app uses state-based panels rather than browser-history routes, so no route rewrite is required.

## QA

```bash
npm run build
npm run test:install
npm test
```

The browser suite covers the production artifact, telemetry changes, camera presets, drag/zoom, hotspots, climate, media, navigation, phone demo, vehicle configuration, ADAS, parking cameras, lighting, HUD, touch gestures, mobile layout, preference persistence and console/network errors. Screenshots and JSON results are written to `test-results/`.

To test an already deployed site:

```bash
TEST_BASE_URL=https://saaeiddev.github.io/3D-Automotive-Dashboard-Lab/ npm test
```

An existing Chromium installation can be selected using `CHROMIUM_PATH=/absolute/path/to/chromium`. Mobile tests emulate Chromium touch behavior; they do not replace physical iPhone/Safari and Android device testing.

## Deployment / GitHub Pages

The repository includes `.github/workflows/deploy.yml`:

1. Check out the exact main-branch commit.
2. Install dependencies with `npm ci` on Node 22.
3. Build and type-check.
4. Install Chromium and run browser QA.
5. Save the QA results as an Actions artifact.
6. Upload the `dist/` Pages artifact.
7. Deploy with GitHub's official Pages action.

In repository **Settings → Pages**, the build source should be **GitHub Actions**. The workflow uses least-required `contents: read`, `pages: write` and `id-token: write` permissions. No external API keys or third-party hosting account is needed. A deployment occurs only after a successful build and QA job.

Expected project URL: **https://saaeiddev.github.io/3D-Automotive-Dashboard-Lab/**

After deployment, test the actual URL with the same browser suite. A successful local build alone does not verify Pages or asset paths.

## Project structure

```text
src/
  App.tsx                 Application shell and shared vehicle state
  main.tsx                Bootstrap and runtime error boundary
  cockpit/
    cabin.ts              Original cabin geometry and materials
    geometry.ts           Surface, texture and geometry utilities
    displays.ts           Dynamic cluster and infotainment drawing
    sensors.ts            Exterior sensing schematic
    Viewport.tsx          Renderer, camera, picking, lighting, lifecycle
  data/systems.ts         Educational system descriptions
  systems/
    model.ts              Types, initial state and drive profiles
    audio.ts              Gesture-initiated procedural audio
  ui/
    Controls.tsx          Shared accessible control elements
    Diagrams.tsx          Original map, lane and camera diagrams
    DrivePanel.tsx        Functional infotainment sections
  styles/app.css          Responsive angular interface
public/
  assets/
    studio_small_03_1k.hdr
    fonts/
tests/cockpit.spec.ts
.github/workflows/deploy.yml
```

## Asset sources and licenses

| Asset | Source | License / usage |
| --- | --- | --- |
| Cabin, schematic vehicle, generated surface textures, maps, diagrams, audio | Original project code | Included with this repository; no third-party vehicle model |
| Studio Small 03, 1K HDR | [Greg Zaal / Poly Haven](https://polyhaven.com/a/studio_small_03) | [CC0](https://polyhaven.com/license); bundled for local serving |
| Barlow and Barlow Condensed | [Jeremy Tribby / Google Fonts](https://github.com/google/fonts/tree/main/ofl/barlow) | SIL Open Font License 1.1; licenses included beside bundled fonts |
| Lucide icons | [Lucide](https://lucide.dev/license) | ISC; dependency license included in npm package |
| Three.js | [Three.js](https://github.com/mrdoob/three.js) | MIT |
| React / Vite | Respective npm packages | MIT |

No BMW logos, M logos, proprietary icons, copied OS screens or third-party branded cockpit mesh are used. AERON and DriveOS are fictional identities used for this visualization; no trademark registration or affiliation is claimed.

## Performance notes

- Three.js and the viewport load in separate chunks.
- Static geometry is merged by material to reduce draw calls; selectable controls and the animated wheel remain separate.
- Pixel density is capped, with Auto / High / Low options.
- Display textures refresh at approximately 15 Hz while the scene animates via `requestAnimationFrame`.
- The renderer and simulation pause updates in hidden tabs.
- Geometry, materials, textures, controls and audio resources are cleaned up on unmount.
- A 1K HDR is converted to a prefiltered reflection environment once.
- Textures and fonts are self-hosted; there are no runtime mapping, model or audio requests to third-party servers.
- Draco, Meshopt and KTX2 are not required: the cabin is generated in code and does not download a large GLB or material texture set. Adding a substantial imported asset should include appropriate compression and a license record.

## Browser support and limitations

Designed for current desktop Chrome, Edge, Firefox and Safari with WebGL 2. Responsive touch controls target modern iOS Safari and Android browsers. Desktop/laptop landscape provides the fullest experience. Browser-level GPU support and memory constraints affect rendering performance. WebGL loss shows a recoverable reload state; an HDR fetch failure uses built-in studio reflections and displays a notice.

No analytics, account system, backend, real telemetry, remote control or real driver-assistance implementation is included. Preference persistence uses only local storage.

## Credits

**Author: Amir Saeid Dehghan**

Original concept, interface and interactive implementation for **3D Automotive Dashboard Lab**. Studio environment by Greg Zaal / Poly Haven; Barlow typography by Jeremy Tribby; open-source rendering and interface dependencies credited above.
