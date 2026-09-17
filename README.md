# NSG Player — Angular sample

Public playground for the **headless** Angular adapter. Mounts `<nsg-video-player>` and drives playback via `getPlayer()` host controls + a runtime settings panel.

| | |
|--|--|
| Port | **4200** |
| Repo | [nsgplayer-sample-angular](https://github.com/codenannu/nsgplayer-sample-angular) |
| SDK (pinned) | `@codenkay/video-nsgplayer-angular` / `core` **^3.0.4** |
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
| React (no BFF) | [nsgplayer-sample-react](https://github.com/codenannu/nsgplayer-sample-react) | **5173** | Full React chrome, public HLS |
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

1. Run [nsgplayer-sample-nextjs](https://github.com/codenannu/nsgplayer-sample-nextjs) on port **3001**.
2. Switch Mode to **BFF video ID** and click Play.

`environment.bffOrigin` defaults to `http://localhost:3001`.

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

## Shared contract

`src/shared/` is vendored identically in the React and Next samples. Keep them in sync when editing playground fields.

## Version matrix

| Package | Tested |
|---------|--------|
| `@codenkay/video-nsgplayer-angular` | ^3.0.4 |
| `@codenkay/video-nsgplayer-core` | ^3.0.4 |

## Troubleshooting

- **BFF CORS** — Next sample must allow `http://localhost:4200`.
- **No control bar** — expected; UI chrome is React-only. Use host buttons / `getPlayer()`.
- **Do not `file:`-link** the private monorepo — use published npm.

## License

MIT
