import { Component, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  NsgVideoPlayerComponent,
} from "@codenkay/video-nsgplayer-angular";
import type {
  AuthConfig,
  PlaybackCredentialConfig,
} from "@codenkay/video-nsgplayer-core";
import { environment } from "../environments/environment";
import {
  DEFAULT_PLAYGROUND_CONFIG,
  toPlayerConfigPartial,
  type PlaygroundConfig,
  type PlayIconPreset,
} from "../shared/playgroundConfig";
import { SAMPLE_HLS_URL, SDK_VERSION_MATRIX } from "../shared/sampleMedia";

type Mode = "sourceUrl" | "bff";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [FormsModule, NsgVideoPlayerComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  @ViewChild(NsgVideoPlayerComponent)
  playerCmp?: NsgVideoPlayerComponent;

  readonly sdkVersion = SDK_VERSION_MATRIX.angular;
  mode: Mode = "sourceUrl";
  sourceUrlDraft = SAMPLE_HLS_URL;
  videoIdDraft = "demo-video";
  sessionActive = false;
  sourceUrl?: string;
  videoId?: string;
  error: string | null = null;
  config: PlaygroundConfig = { ...DEFAULT_PLAYGROUND_CONFIG };

  auth?: AuthConfig;
  playback?: PlaybackCredentialConfig;
  /** Set only in BFF mode so AES enc.key goes through the Next key proxy. */
  bffStreaming?: {
    keyProxyMaxFailures: number;
    keyProxyUrlBuilder: (ctx: {
      videoId: string;
      keyUrl: string;
      token?: string;
      expires?: string;
      username?: string;
      mobile?: string;
    }) => string;
  };

  get playerConfig() {
    const base = toPlayerConfigPartial(this.config);
    if (!this.bffStreaming) return base;
    return {
      ...base,
      streaming: this.bffStreaming,
    };
  }

  onPlay(): void {
    this.error = null;
    if (this.mode === "sourceUrl") {
      const url = this.sourceUrlDraft.trim();
      if (!url) {
        this.error = "Enter a public HLS source URL.";
        return;
      }
      this.auth = undefined;
      this.playback = undefined;
      this.bffStreaming = undefined;
      this.sourceUrl = url;
      this.videoId = this.videoIdDraft.trim() || "sample";
      this.sessionActive = true;
      return;
    }

    const id = this.videoIdDraft.trim();
    if (!id) {
      this.error = "Enter a video ID.";
      return;
    }
    const origin = environment.bffOrigin.replace(/\/$/, "");
    this.sourceUrl = undefined;
    this.videoId = id;
    this.bffStreaming = {
      keyProxyMaxFailures: 2,
      keyProxyUrlBuilder: ({
        videoId,
        keyUrl,
        token,
        expires,
        username,
        mobile,
      }) => {
        const params = new URLSearchParams({ url: keyUrl, videoId });
        if (token) params.set("token", token);
        if (expires) params.set("expires", expires);
        if (username) params.set("username", username);
        if (mobile) params.set("mobile", mobile);
        return `${origin}/api/hls/key?${params.toString()}`;
      },
    };
    this.auth = {
      getToken: async (ctx) =>
        fetch(`${origin}/api/auth-token`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(ctx),
        }).then(async (r) => {
          if (!r.ok) throw new Error(await r.text());
          return r.json();
        }),
    };
    this.playback = {
      getSource: async ({ videoId }) =>
        fetch(`${origin}/api/videos/${encodeURIComponent(videoId)}/signed-url`).then(
          async (r) => {
            if (!r.ok) throw new Error(await r.text());
            return r.json();
          },
        ),
      refreshSource: async ({ videoId }) =>
        fetch(
          `${origin}/api/videos/${encodeURIComponent(videoId)}/proxy-refresh`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: "{}",
          },
        ).then(async (r) => {
          if (!r.ok) throw new Error(await r.text());
          return r.json();
        }),
    };
    this.sessionActive = true;
  }

  onStop(): void {
    this.playerCmp?.getPlayer()?.destroy();
    this.sessionActive = false;
    this.bffStreaming = undefined;
    this.error = null;
  }

  hostPlay(): void {
    void this.playerCmp?.getPlayer()?.play();
  }

  hostPause(): void {
    this.playerCmp?.getPlayer()?.pause();
  }

  hostSeek(delta: number): void {
    const p = this.playerCmp?.getPlayer();
    if (!p) return;
    p.seek(Math.max(0, p.getCurrentTime() + delta));
  }

  onPlayerError(err: { message: string }): void {
    this.error = err.message;
  }

  patch<K extends keyof PlaygroundConfig>(key: K, value: PlaygroundConfig[K]): void {
    this.config = { ...this.config, [key]: value };
    this.playerCmp?.getPlayer()?.updateConfig(this.playerConfig);
  }

  onSkipChange(raw: number | string): void {
    this.patch("skipSeconds", Number(raw) as 5 | 10 | 15 | 30);
  }

  onPresetChange(raw: string): void {
    this.patch("playIconPreset", raw as PlayIconPreset);
  }
}
