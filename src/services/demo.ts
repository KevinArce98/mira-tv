import { updateLastSync } from '@/db/repositories/accounts';
import { upsertContentBatch, type ContentUpsert } from '@/db/repositories/content';
import type { Cuenta } from '@/types/models';

export const DEMO_SERVER = 'http://demo.mira-tv.local';

export function isDemoAccount(cuenta: Cuenta): boolean {
  return cuenta.servidor === DEMO_SERVER;
}

const DEMO_LIVE: Omit<ContentUpsert, 'cuenta_id'>[] = [
  { tipo: 'live', stream_id: 1001, nombre: 'CNN International', categoria: 'News', categoria_id: 'cat_news', poster_url: null, container_extension: null, epg_channel_id: null },
  { tipo: 'live', stream_id: 1002, nombre: 'ESPN', categoria: 'Sports', categoria_id: 'cat_sports', poster_url: null, container_extension: null, epg_channel_id: null },
  { tipo: 'live', stream_id: 1003, nombre: 'National Geographic', categoria: 'Documentary', categoria_id: 'cat_doc', poster_url: null, container_extension: null, epg_channel_id: null },
  { tipo: 'live', stream_id: 1004, nombre: 'Disney Channel', categoria: 'Kids', categoria_id: 'cat_kids', poster_url: null, container_extension: null, epg_channel_id: null },
  { tipo: 'live', stream_id: 1005, nombre: 'HBO', categoria: 'Entertainment', categoria_id: 'cat_ent', poster_url: null, container_extension: null, epg_channel_id: null },
  { tipo: 'live', stream_id: 1006, nombre: 'BBC World News', categoria: 'News', categoria_id: 'cat_news', poster_url: null, container_extension: null, epg_channel_id: null },
];

const DEMO_MOVIES: Omit<ContentUpsert, 'cuenta_id'>[] = [
  { tipo: 'movie', stream_id: 2001, nombre: 'The General (1926)', categoria: 'Classic', categoria_id: 'cat_classic', poster_url: null, container_extension: 'mp4', epg_channel_id: null },
  { tipo: 'movie', stream_id: 2002, nombre: 'Nosferatu (1922)', categoria: 'Horror', categoria_id: 'cat_horror', poster_url: null, container_extension: 'mp4', epg_channel_id: null },
  { tipo: 'movie', stream_id: 2003, nombre: 'The Kid (1921)', categoria: 'Classic', categoria_id: 'cat_classic', poster_url: null, container_extension: 'mp4', epg_channel_id: null },
  { tipo: 'movie', stream_id: 2004, nombre: 'Metropolis (1927)', categoria: 'Sci-Fi', categoria_id: 'cat_scifi', poster_url: null, container_extension: 'mp4', epg_channel_id: null },
  { tipo: 'movie', stream_id: 2005, nombre: 'Safety Last! (1923)', categoria: 'Classic', categoria_id: 'cat_classic', poster_url: null, container_extension: 'mp4', epg_channel_id: null },
  { tipo: 'movie', stream_id: 2006, nombre: 'The Phantom of the Opera (1925)', categoria: 'Horror', categoria_id: 'cat_horror', poster_url: null, container_extension: 'mp4', epg_channel_id: null },
];

const DEMO_SERIES: Omit<ContentUpsert, 'cuenta_id'>[] = [
  { tipo: 'series', stream_id: 3001, nombre: 'Sample Drama Series', categoria: 'Drama', categoria_id: 'cat_drama', poster_url: null, container_extension: null, epg_channel_id: null },
  { tipo: 'series', stream_id: 3002, nombre: 'Sample Comedy Show', categoria: 'Comedy', categoria_id: 'cat_comedy', poster_url: null, container_extension: null, epg_channel_id: null },
  { tipo: 'series', stream_id: 3003, nombre: 'Sample Documentary', categoria: 'Documentary', categoria_id: 'cat_doc', poster_url: null, container_extension: null, epg_channel_id: null },
];

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
