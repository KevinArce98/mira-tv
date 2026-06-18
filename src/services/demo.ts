import { updateLastSync } from '@/db/repositories/accounts';
import { upsertContentBatch, type ContentUpsert } from '@/db/repositories/content';
import type { EpisodeUpsert } from '@/db/repositories/episodes';
import type { Cuenta } from '@/types/models';

export const DEMO_SERVER = 'http://demo.mira-tv.local';

export function isDemoAccount(cuenta: Cuenta): boolean {
  return cuenta.servidor === DEMO_SERVER;
}

const MUX = 'https://test-streams.mux.dev';
const APPLE = 'https://devstreaming-cdn.apple.com/videos/streaming/examples';
const AKAMAI = 'https://bitdash-a.akamaihd.net/content';

const DEMO_MEDIA: Record<number, string> = {
  1001: `${MUX}/x36xhzz/x36xhzz.m3u8`,
  1002: `${APPLE}/img_bipbop_adv_example_ts/master.m3u8`,
  1003: `${MUX}/tos_ismc/main.m3u8`,
  1004: `${MUX}/pts_shift/master.m3u8`,

  2001: `${MUX}/x36xhzz/x36xhzz.m3u8`,
  2002: `${AKAMAI}/MI201109210084_mpeg-4/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8`,
  2003: `${AKAMAI}/sintel/hls/playlist.m3u8`,
  2004: `${MUX}/tos_ismc/main.m3u8`,
  2005: `${APPLE}/bipbop_4x3/bipbop_4x3_variant.m3u8`,
  2006: `${APPLE}/img_bipbop_adv_example_fmp4/master.m3u8`,

  30011: `${APPLE}/bipbop_4x3/bipbop_4x3_variant.m3u8`,
  30012: `${MUX}/pts_shift/master.m3u8`,
  30013: `${AKAMAI}/sintel/hls/playlist.m3u8`,
  30021: `${MUX}/x36xhzz/x36xhzz.m3u8`,
  30022: `${MUX}/tos_ismc/main.m3u8`,
};

export function getDemoPlaybackUrl(streamId: number): string | null {
  return DEMO_MEDIA[streamId] ?? null;
}

const DEMO_LIVE: Omit<ContentUpsert, 'cuenta_id'>[] = [
  { tipo: 'live', stream_id: 1001, nombre: 'Demo Nature Channel', categoria: 'Demo', categoria_id: 'demo_live', poster_url: null, container_extension: null, epg_channel_id: null },
  { tipo: 'live', stream_id: 1002, nombre: 'Demo Test Stream', categoria: 'Demo', categoria_id: 'demo_live', poster_url: null, container_extension: null, epg_channel_id: null },
  { tipo: 'live', stream_id: 1003, nombre: 'Demo Cinema Live', categoria: 'Demo', categoria_id: 'demo_live', poster_url: null, container_extension: null, epg_channel_id: null },
  { tipo: 'live', stream_id: 1004, nombre: 'Demo Variety', categoria: 'Demo', categoria_id: 'demo_live', poster_url: null, container_extension: null, epg_channel_id: null },
];

const DEMO_MOVIES: Omit<ContentUpsert, 'cuenta_id'>[] = [
  { tipo: 'movie', stream_id: 2001, nombre: 'Big Buck Bunny', categoria: 'Open Movies', categoria_id: 'demo_movies', poster_url: null, container_extension: 'mp4', epg_channel_id: null },
  { tipo: 'movie', stream_id: 2002, nombre: 'Elephants Dream', categoria: 'Open Movies', categoria_id: 'demo_movies', poster_url: null, container_extension: 'mp4', epg_channel_id: null },
  { tipo: 'movie', stream_id: 2003, nombre: 'Sintel', categoria: 'Open Movies', categoria_id: 'demo_movies', poster_url: null, container_extension: 'mp4', epg_channel_id: null },
  { tipo: 'movie', stream_id: 2004, nombre: 'Tears of Steel', categoria: 'Open Movies', categoria_id: 'demo_movies', poster_url: null, container_extension: 'mp4', epg_channel_id: null },
  { tipo: 'movie', stream_id: 2005, nombre: 'For Bigger Blazes', categoria: 'Shorts', categoria_id: 'demo_shorts', poster_url: null, container_extension: 'mp4', epg_channel_id: null },
  { tipo: 'movie', stream_id: 2006, nombre: 'For Bigger Joyrides', categoria: 'Shorts', categoria_id: 'demo_shorts', poster_url: null, container_extension: 'mp4', epg_channel_id: null },
];

const DEMO_SERIES: Omit<ContentUpsert, 'cuenta_id'>[] = [
  { tipo: 'series', stream_id: 3001, nombre: 'Demo Series One', categoria: 'Demo', categoria_id: 'demo_series', poster_url: null, container_extension: null, epg_channel_id: null },
  { tipo: 'series', stream_id: 3002, nombre: 'Demo Series Two', categoria: 'Demo', categoria_id: 'demo_series', poster_url: null, container_extension: null, epg_channel_id: null },
];

const DEMO_EPISODES_BY_SERIES: Record<number, Omit<EpisodeUpsert, 'serie_id'>[]> = {
  3001: [
    { temporada: 1, episodio: 1, stream_id: 30011, titulo: 'For Bigger Escapes', container_extension: 'mp4', poster_url: null, duracion: 15 },
    { temporada: 1, episodio: 2, stream_id: 30012, titulo: 'For Bigger Fun', container_extension: 'mp4', poster_url: null, duracion: 60 },
    { temporada: 1, episodio: 3, stream_id: 30013, titulo: 'For Bigger Meltdowns', container_extension: 'mp4', poster_url: null, duracion: 15 },
  ],
  3002: [
    { temporada: 1, episodio: 1, stream_id: 30021, titulo: 'We Are Going On Bullrun', container_extension: 'mp4', poster_url: null, duracion: 47 },
    { temporada: 1, episodio: 2, stream_id: 30022, titulo: 'Subaru Outback', container_extension: 'mp4', poster_url: null, duracion: 59 },
  ],
};

export function getDemoEpisodes(serieId: string, serieStreamId: number): EpisodeUpsert[] {
  const episodes = DEMO_EPISODES_BY_SERIES[serieStreamId] ?? [];
  return episodes.map((ep) => ({ ...ep, serie_id: serieId }));
}

function withAccount(items: Omit<ContentUpsert, 'cuenta_id'>[], cuentaId: string): ContentUpsert[] {
  return items.map((item) => ({ ...item, cuenta_id: cuentaId }));
}

export async function syncDemoCatalog(cuenta: Cuenta): Promise<number> {
  const a = await upsertContentBatch(withAccount(DEMO_LIVE, cuenta.id));
  const b = await upsertContentBatch(withAccount(DEMO_MOVIES, cuenta.id));
  const c = await upsertContentBatch(withAccount(DEMO_SERIES, cuenta.id));
  await updateLastSync(cuenta.id);
  return a + b + c;
}
