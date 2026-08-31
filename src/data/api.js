import { supabase } from '../lib/supabaseClient.js';

/**
 * Data layer for Shewings.
 *
 * Every function talks to Supabase (Postgres + Row Level Security — see
 * supabase/schema.sql). Components never import supabase directly; they
 * only import from here, so the boundary between "app code" and "backend
 * calls" stays in one place.
 *
 * Field names are translated between the DB's snake_case columns and the
 * camelCase shape components use (e.g. event_date -> date, image_url ->
 * image), so this file is also where that mapping lives.
 */

function must(error, fallbackMessage) {
  if (error) {
    console.error(error);
    throw new Error(error.message || fallbackMessage);
  }
}

/* ------------------------------- events ------------------------------- */

function fromEventRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    date: row.event_date,
    time: row.event_time,
    location: row.location,
    image: row.image_url,
    cloudinaryPublicId: row.cloudinary_public_id,
    registrationLink: row.registration_url || '',
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toEventRow(data) {
  const row = {};
  if (data.title !== undefined) row.title = data.title;
  if (data.description !== undefined) row.description = data.description || null;
  if (data.date !== undefined) row.event_date = data.date;
  if (data.time !== undefined) row.event_time = data.time;
  if (data.location !== undefined) row.location = data.location;
  if (data.image !== undefined) row.image_url = data.image;
  if (data.cloudinaryPublicId !== undefined) row.cloudinary_public_id = data.cloudinaryPublicId;
  if (data.registrationLink !== undefined) row.registration_url = data.registrationLink || null;
  if (data.status !== undefined) row.status = data.status;
  return row;
}

/** All events, for the admin table (both draft and published). */
export async function listEvents() {
  const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
  must(error, 'Could not load events.');
  return (data || []).map(fromEventRow);
}

/** Published events only — what the public site is allowed to see. */
export async function listPublicEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('event_date', { ascending: true });
  must(error, 'Could not load events.');
  return (data || []).map(fromEventRow);
}

export async function createEvent(data) {
  const { data: row, error } = await supabase.from('events').insert(toEventRow(data)).select().single();
  must(error, 'Could not create the event.');
  return fromEventRow(row);
}

export async function updateEvent(id, data) {
  const { data: row, error } = await supabase
    .from('events')
    .update(toEventRow(data))
    .eq('id', id)
    .select()
    .single();
  must(error, 'Could not update the event.');
  return fromEventRow(row);
}

export async function deleteEvent(id) {
  const { error } = await supabase.from('events').delete().eq('id', id);
  must(error, 'Could not delete the event.');
  return true;
}

/* ------------------------------ gallery ------------------------------ */

function fromGalleryRow(row) {
  return {
    id: row.id,
    image: row.image_url,
    cloudinaryPublicId: row.cloudinary_public_id,
    title: row.title || '',
    caption: row.caption || '',
    category: row.category || '',
    createdAt: row.created_at,
  };
}

function toGalleryRow(data) {
  const row = {};
  if (data.image !== undefined) row.image_url = data.image;
  if (data.cloudinaryPublicId !== undefined) row.cloudinary_public_id = data.cloudinaryPublicId;
  if (data.title !== undefined) row.title = data.title || null;
  if (data.caption !== undefined) row.caption = data.caption || null;
  if (data.category !== undefined) row.category = data.category || null;
  return row;
}

export async function listGallery() {
  const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
  must(error, 'Could not load the gallery.');
  return (data || []).map(fromGalleryRow);
}

export async function createGalleryItem(data) {
  const { data: row, error } = await supabase.from('gallery').insert(toGalleryRow(data)).select().single();
  must(error, 'Could not add the image.');
  return fromGalleryRow(row);
}

export async function updateGalleryItem(id, data) {
  const { data: row, error } = await supabase
    .from('gallery')
    .update(toGalleryRow(data))
    .eq('id', id)
    .select()
    .single();
  must(error, 'Could not update the image.');
  return fromGalleryRow(row);
}

export async function deleteGalleryItem(id) {
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  must(error, 'Could not delete the image.');
  return true;
}

/* ------------------------------- videos ------------------------------- */

function fromVideoRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    youtubeUrl: row.youtube_url,
    createdAt: row.created_at,
  };
}

function toVideoRow(data) {
  const row = {};
  if (data.title !== undefined) row.title = data.title;
  if (data.description !== undefined) row.description = data.description || null;
  if (data.youtubeUrl !== undefined) row.youtube_url = data.youtubeUrl;
  return row;
}

export async function listVideos() {
  const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
  must(error, 'Could not load videos.');
  return (data || []).map(fromVideoRow);
}

export async function createVideo(data) {
  const { data: row, error } = await supabase.from('videos').insert(toVideoRow(data)).select().single();
  must(error, 'Could not add the video.');
  return fromVideoRow(row);
}

export async function updateVideo(id, data) {
  const { data: row, error } = await supabase
    .from('videos')
    .update(toVideoRow(data))
    .eq('id', id)
    .select()
    .single();
  must(error, 'Could not update the video.');
  return fromVideoRow(row);
}

export async function deleteVideo(id) {
  const { error } = await supabase.from('videos').delete().eq('id', id);
  must(error, 'Could not delete the video.');
  return true;
}

/* ----------------------------- enquiries ----------------------------- */

function fromEnquiryRow(row) {
  return {
    id: row.id,
    name: row.full_name,
    email: row.email,
    phone: row.phone,
    location: row.location || '',
    profession: row.profession || '',
    reason: row.reason || '',
    message: row.message || '',
    status: row.status,
    submittedAt: row.created_at,
  };
}

export async function listEnquiries() {
  const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
  must(error, 'Could not load enquiries.');
  return (data || []).map(fromEnquiryRow);
}

export async function createEnquiry(data) {
  const row = {
    full_name: data.name,
    email: data.email,
    phone: data.phone,
    location: data.location || null,
    profession: data.profession || null,
    reason: data.reason || null,
    message: data.message || null,
  };
  const { data: inserted, error } = await supabase.from('enquiries').insert(row).select().single();
  must(error, 'Could not submit your enquiry. Please try again.');
  return fromEnquiryRow(inserted);
}

export async function updateEnquiryStatus(id, status) {
  const { data: row, error } = await supabase
    .from('enquiries')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  must(error, 'Could not update the enquiry status.');
  return fromEnquiryRow(row);
}

/* ------------------------------ settings ------------------------------ */

export async function getSettings() {
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
  must(error, 'Could not load site settings.');
  return {
    email: data.email || '',
    phone: data.phone || '',
    location: data.location || '',
    instagram: data.instagram || '',
    linkedin: data.linkedin || '',
    facebook: data.facebook || '',
  };
}

export async function updateSettings(data) {
  const { data: row, error } = await supabase.from('site_settings').update(data).eq('id', 1).select().single();
  must(error, 'Could not save settings.');
  return row;
}

/* -------------------------------- utils -------------------------------- */

export function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function isValidYouTubeUrl(url) {
  return Boolean(extractYouTubeId(url));
}
