# NSG Player — Angular sample

Public playground for the **headless** Angular adapter. Mounts `<nsg-video-player>` and drives playback via `getPlayer()` host controls + a runtime settings panel.

| | |
|--|--|
| Port | **4200** |
| Repo | [nsgplayer-sample-angular](https://github.com/codenannu/nsgplayer-sample-angular) |
| SDK (pinned) | `@codenkay/video-nsgplayer-angular` / `core` **^5.0.0** |
| Modes | Direct `sourceUrl` (default) · BFF video ID via Next sample **:3001** |

> This sample is **standalone**. It does **not** require cloning the private SDK monorepo ([`nsgplayer-video`](https://github.com/codenannu/nsgplayer-video)). It installs packages from **npm** only. Full seek/quality chrome ships for React (`@codenkay/video-nsgplayer-ui`) — not in this package.

## SDK packages

| Package | Role | Used here |
|---------|------|-----------|
| [`@codenkay/video-nsgplayer-core`](https://www.npmjs.com/package/@codenkay/video-nsgplayer-core) | Framework-agnostic HLS engine | Yes |
| [`@codenkay/video-nsgplayer-angular`](https://www.npmjs.com/package/@codenkay/video-nsgplayer-angular) | Angular standalone headless component | **Primary** |
| [`@codenkay/video-nsgplayer-react`](https://www.npmjs.com/package/@codenkay/video-nsgplayer-react) | React shell | No |
| [`@codenkay/video-nsgplayer-ui`](https://www.npmjs.com/package/@codenkay/video-nsgplayer-ui) | React control chrome | No — see [React](https://github.com/codenannu/nsgplayer-sample-react) / [Next](https://github.com/codenannu/nsgplayer-sample-nextjs) samples |

## Related samples

| Sample | Repository | Port | Purpose |
|--------|------------|------|---------|
| React | [nsgplayer-sample-react](https://github.com/codenannu/nsgplayer-sample-react) | **5173** | Full React chrome · **same BFF client** |
| Next.js + BFF | [nsgplayer-sample-nextjs](https://github.com/codenannu/nsgplayer-sample-nextjs) | **3001** | BFF for signed / auth playback |
| **This repo** | [nsgplayer-sample-angular](https://github.com/codenannu/nsgplayer-sample-angular) | **4200** | Angular headless playground |

## Quick start

```bash
git clone https://github.com/codenannu/nsgplayer-sample-angular.git
cd nsgplayer-sample-angular
npm install
npm start
```

Open http://localhost:4200

## BFF mode (optional)

Uses the shared thin client `src/shared/bffClient.ts` (identical to the React sample):

1. Run [nsgplayer-sample-nextjs](https://github.com/codenannu/nsgplayer-sample-nextjs) on port **3001**.
2. Switch Mode to **BFF video ID** and click Play.

`environment.bffOrigin` defaults to `http://localhost:3001` (see `src/environments/`). For production, set your deployed BFF origin and allow this SPA in the BFF `CORS_ORIGINS`.

Encrypted AES streams in BFF mode set `streaming.keyProxyUrlBuilder` to the Next `/api/hls/key` route (forwards `token` / `expires` / `username` / `mobile`). Public `sourceUrl` mode omits the key proxy.

No secrets in this Angular app — tokens stay on the Next BFF.

## Install peers (into your own app)

```bash
npm install @codenkay/video-nsgplayer-angular @codenkay/video-nsgplayer-core hls.js
# Angular 17+ and rxjs ^7 as peers
```

```html
<nsg-video-player
  [videoId]="videoId"
  [auth]="auth"
  [playback]="playback"
  [config]="config"
  (ready)="onReady()"
  (error)="onError($event)">
</nsg-video-player>
```

Use `getPlayer()` for play/pause/seek and core runtime APIs. Build your own Angular chrome if needed.

### Lift BFF wiring into an existing app

1. Copy `src/shared/bffClient.ts` (or point the three callbacks at **your** BFF).
2. Copy the four route patterns from the Next sample onto **your** backend.
3. Do **not** `file:`-link the private monorepo — use published npm.

## Shared contract

`src/shared/` is vendored identically in the React and Next samples (including `bffClient.ts`). Keep them in sync when editing playground fields.

## Version matrix

| Package | Tested |
|---------|--------|
| `@codenkay/video-nsgplayer-angular` | ^5.0.0 |
| `@codenkay/video-nsgplayer-core` | ^5.0.0 |

## Troubleshooting

- **BFF CORS** — Next sample must allow `http://localhost:4200`.
- **AES / enc.key in BFF mode** — requires the Next sample on **3001** (key proxy). Mock Next has no `enc.key`.
- **No control bar** — expected; UI chrome is React-only. Use host buttons / `getPlayer()`.
- **Do not `file:`-link** the private monorepo — use published npm.

## License

MIT
