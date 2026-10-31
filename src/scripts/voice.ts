/*
 * The meeting panel's voice line: one function of time, in one place.
 *
 * It used to exist twice, once as the build-time frame in FeaturesDrawn.astro
 * and once as the per-frame redraw in features.astro's inline script, kept in
 * step by a comment asking the next person to keep them in step. Two copies of a
 * drawing whose whole job is to move is a jump at the first frame the moment
 * they drift, and no test could see it. So the maths lives here and both callers
 * import it: the component renders `voicePoints(0)` at build, the script renders
 * `voicePoints(t)` thirty times a second, and the two cannot disagree.
 *
 * A recorded meeting is a static picture, but this panel is not showing a
 * recording that finished: it is showing a voice going into a note as it
 * happens, so the stroke is redrawn while the panel is on screen. A still line
 * reads as a chart of something that already ended.
 *
 * Everything here is deterministic. Nothing is random at runtime: the amplitude
 * field is seeded from the point's own index, so the same second of the loop
 * draws the same line on every build and two builds can be diffed.
 */

/** Width of the drawing in viewBox units. The panel is 60 tall. */
export const VOICE_WINDOW = 1200;

/** Amplitude in percent of a full swing: 0 is silence. One utterance, shaped
 *  like two sentences and a pause. */
export const SPEECH = [
  0, 0, 0, 62, 88, 44, 74, 30, 0, 0, 54, 80, 96, 58, 34, 0, 46, 70, 90, 52, 24,
  0, 0, 0,
];

const MID = 30;
const AMP = 26;

/** A deterministic value in [0,1) from an integer index. The amplitude field is
 *  built from this instead of from a sine, and that is the point: a sine
 *  repeats, and identical groups of peaks across the panel is exactly what an
 *  earlier version drew. */
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** ONE voice, in ONE place: full amplitude across the middle of the panel, a
 *  taper at each end, nothing at the edges. A Gaussian was the wrong shape,
 *  because a smooth curve from nothing to nothing is a lens, and a lens reads as
 *  a swell rather than as somebody talking. A plateau lets the field below
 *  decide where the loud parts are, which is uneven the way speech is uneven. */
const bell = (x: number) => {
  const d = Math.abs(x - VOICE_WINDOW / 2) / (VOICE_WINDOW / 2);
  const t = Math.min(1, Math.max(0, (d - 0.46) / 0.44));
  return 1 - t * t * (3 - 2 * t);
};

/** Smooth random lobes across x, each with its own speed and phase, so no two
 *  stretches of the line move alike. Neighbouring points share a lobe, which is
 *  what makes a group of peaks swell and fall together the way a mixer's bars
 *  do instead of shimmering independently. */
const field = (x: number, t: number) => {
  const u = x * 0.006;
  const i = Math.floor(u);
  const f = u - i;
  const s = f * f * (3 - 2 * f);
  const a = 0.5 + 0.5 * Math.sin(hash(i) * 6.283 + t * (0.8 + 1.4 * hash(i + 31)));
  const b =
    0.5 + 0.5 * Math.sin(hash(i + 1) * 6.283 + t * (0.8 + 1.4 * hash(i + 32)));
  return a + (b - a) * s;
};

/** The texture under it: a chirp, so the peaks are not evenly spaced and never
 *  line up into the same group twice, advanced slowly with time so the stroke
 *  ripples where it is rather than travelling. Sharpened, not a plain sine: a
 *  sine only touches its envelope at the crests, so the line would spend most of
 *  its length near the middle and the voice would read as a squiggle. */
const carrier = (x: number, t: number) => {
  const s = Math.sin(x * 0.17 + x * x * 0.00012 + t * 1.9);
  return Math.sign(s) * Math.pow(Math.abs(s), 0.6);
};

/** One level for the whole group, so it swells and drops together as a person
 *  speaks, with real pauses. Offset by four entries so the frame at `time = 0`
 *  is somebody mid-word rather than the silence the pattern starts with: that
 *  frame is what a reader with no JavaScript sees. Floored well above zero,
 *  because a pause is a quiet line, not a gap in the drawing. */
const level = (t: number) => {
  const p = t * 0.9 + 4;
  const i = Math.floor(p) % SPEECH.length;
  const j = (i + 1) % SPEECH.length;
  const f = p - Math.floor(p);
  const e = f * f * (3 - 2 * f);
  return 0.06 + 0.94 * ((SPEECH[i]! + (SPEECH[j]! - SPEECH[i]!) * e) / 100);
};

/**
 * The `points` attribute of the voice polyline, `time` seconds into the loop.
 *
 * `step` is the sampling interval in viewBox units. The build-time frame uses 2
 * because it costs nothing once; the per-frame redraw uses 6 because it runs
 * every frame and a third of the points is a third of the work at the sizes this
 * panel is drawn at.
 */
export const voicePoints = (time: number, step = 2): string => {
  const lvl = level(time);
  const out: string[] = [];
  for (let x = 0; x <= VOICE_WINDOW; x += step) {
    /* The field MODULATES the carrier rather than multiplying it: a factor that
       is allowed to reach zero silences whole stretches of the line, and a gain
       whose mean is a half halves the voice everywhere. */
    const gain = 0.55 + 0.45 * field(x, time);
    const y = bell(x) * lvl * gain * carrier(x, time);
    out.push(`${x},${(MID - AMP * y).toFixed(1)}`);
  }
  return out.join(" ");
};
