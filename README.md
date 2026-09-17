# NSG Player — Angular sample

Headless playground for `@codenkay/video-nsgplayer-angular`.

| | |
|--|--|
| Port | **4200** |
| SDK | `@codenkay/video-nsgplayer-angular` / `core` **^3.0.4** |
| Modes | Direct `sourceUrl` (default) · BFF video ID via **nsgplayer-nextjs** `:3001` |

## Quick start

```bash
git clone <this-repo> nsgplayer-angular
cd nsgplayer-angular
npm install
npm start
```

Open http://localhost:4200

## BFF mode

1. Run `nsgplayer-nextjs` on port 3001 (`npm run dev`).
2. Switch Mode to **BFF video ID** and click Play.

`environment.bffOrigin` defaults to `http://localhost:3001`.

## Notes

- Full seek/quality chrome is React-only (`@codenkay/video-nsgplayer-ui`). This sample shows `getPlayer()` host controls.
- Shared config lives in `src/shared/` (keep in sync with the React/Next samples).

## Version matrix

Tested with `@codenkay/video-nsgplayer-angular@^3.0.4` and `core@^3.0.4`.
