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

  get playerConfig() {
    return toPlayerConfigPartial(this.config);
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
    this.playerCmp?.getPlayer()?.updateConfig(toPlayerConfigPartial(this.config));
  }

  onSkipChange(raw: number | string): void {
    this.patch("skipSeconds", Number(raw) as 5 | 10 | 15 | 30);
  }

  onPresetChange(raw: string): void {
    this.patch("playIconPreset", raw as PlayIconPreset);
  }
}
