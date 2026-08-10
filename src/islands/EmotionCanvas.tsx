import { useEffect, useState } from 'preact/hooks';
import { CANVAS, MOOD_HUES, CONTACT_EMAIL } from '../content/canvas';
import { getNotes, addNote, removeNote, clearNotes, type Note } from '../lib/prefs';
import type { Lang } from '../content/ui';

const MOOD_KEYS: Note['mood'][] = ['claridad', 'curiosidad', 'duda', 'inspiracion', 'sugerencia'];

type CanvasStrings = (typeof CANVAS)[keyof typeof CANVAS];

function ago(ts: number, t: CanvasStrings): string {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return t.justNow;
  if (m < 60) return t.minsAgo.replace('{n}', String(m));
  if (m < 1440) return t.hoursAgo.replace('{n}', String(Math.floor(m / 60)));
  return t.daysAgo.replace('{n}', String(Math.floor(m / 1440)));
}

/**
 * Las notas nunca salen del navegador de quien escribe. El único camino hacia
 * Emilio es el `mailto:` — y eso se dice explícitamente en el aviso.
 *
 * Clases con prefijo `ec-`: los `<style>` de Preact no están encapsulados.
 */
export default function EmotionCanvas({ lang }: { lang: Lang }) {
  const t = CANVAS[lang];
  const [mood, setMood] = useState(0);
  const [draft, setDraft] = useState('');
  const [who, setWho] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => setNotes(getNotes()), []);

  const ready = draft.trim().length > 0;
  const body = draft.trim() + (who.trim() ? `\n\n— ${who.trim()}` : '');
  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `${t.mailSubject} · ${t.moods[mood]}`
  )}&body=${encodeURIComponent(body)}`;

  const submit = () => {
    if (!ready) return;
    setNotes(
      addNote({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        mood: MOOD_KEYS[mood]!,
        text: draft.trim(),
        name: who.trim() || undefined,
        at: Date.now(),
      })
    );
    setDraft('');
  };

  return (
    <section class="ec-shell" aria-label={t.title}>
      <header class="ec-head">
        <span class="ec-badge">{t.badge}</span>
        <span class="ec-kind">{t.kind}</span>
      </header>

      <h3 class="ec-title">{t.title}</h3>
      <p class="ec-sub">{t.sub}</p>

      <fieldset class="ec-moods">
        <legend class="ec-mood-label">{t.moodLabel}</legend>
        {t.moods.map((label, i) => (
          <button
            type="button"
            class={i === mood ? 'ec-mood ec-mood--on' : 'ec-mood'}
            style={{ '--hue': MOOD_HUES[i] } as Record<string, string>}
            aria-pressed={i === mood}
            onClick={() => setMood(i)}
          >
            {label}
          </button>
        ))}
      </fieldset>

      <textarea
        class="ec-draft"
        rows={3}
        value={draft}
        placeholder={t.placeholder}
        aria-label={t.placeholder}
        onInput={(e) => setDraft((e.target as HTMLTextAreaElement).value)}
      />

      <div class="ec-controls">
        <input
          class="ec-who"
          type="text"
          value={who}
          placeholder={t.whoPlaceholder}
          aria-label={t.whoPlaceholder}
          onInput={(e) => setWho((e.target as HTMLInputElement).value)}
        />
        <button
          type="button"
          class={ready ? 'ec-pin ec-pin--ready' : 'ec-pin'}
          disabled={!ready}
          onClick={submit}
        >
          {t.submit}
        </button>
        {ready && (
          <a class="ec-mail" href={mailHref}>
            {t.mail}
          </a>
        )}
      </div>

      <p class="ec-privacy">{t.privacy}</p>

      {notes.length > 0 && (
        <>
          <header class="ec-wall-head">
            <span class="ec-wall-label">{t.wallLabel}</span>
            <button type="button" class="ec-clear" onClick={() => setNotes(clearNotes())}>
              {t.clearAll}
            </button>
          </header>

          <ul class="ec-wall">
            {notes.map((n) => {
              const idx = MOOD_KEYS.indexOf(n.mood);
              return (
                <li
                  class="ec-note"
                  style={{ '--hue': MOOD_HUES[idx] ?? MOOD_HUES[0] } as Record<string, string>}
                >
                  <div class="ec-note-top">
                    <span class="ec-note-mood">{t.moods[idx] ?? t.moods[0]}</span>
                    <button
                      type="button"
                      class="ec-note-x"
                      aria-label={t.remove}
                      onClick={() => setNotes(removeNote(n.id))}
                    >
                      ×
                    </button>
                  </div>
                  <p class="ec-note-text">{n.text}</p>
                  <p class="ec-note-meta">
                    {n.name || t.anon} · {ago(n.at, t)}
                  </p>
                </li>
              );
            })}
          </ul>
        </>
      )}

      <style>{`
        .ec-shell {
          border: var(--border);
          border-radius: var(--r-card-lg);
          padding: 32px 34px;
          background: var(--bg-2);
        }
        .ec-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
        .ec-badge {
          padding: 5px 12px;
          border-radius: var(--r-pill);
          border: 1px solid var(--clarity);
          background: var(--clarity-16);
          color: var(--on-clarity);
          font-size: var(--fs-label);
          font-weight: var(--fw-medium);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .ec-kind { font-size: 12px; color: var(--dimmer); }

        .ec-title {
          font-size: var(--fs-h4);
          line-height: var(--lh-h4);
          letter-spacing: var(--ls-h4);
          margin-bottom: 10px;
        }
        .ec-sub {
          font-size: var(--fs-body);
          line-height: var(--lh-body-sm);
          color: var(--dim);
          margin-bottom: 22px;
          max-width: 620px;
        }

        .ec-moods {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          border: 0;
          padding: 0;
          margin: 0 0 16px;
        }
        .ec-mood-label {
          width: 100%;
          padding: 0;
          font-size: var(--fs-label);
          font-weight: var(--fw-medium);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--dimmer);
          margin-bottom: 10px;
        }
        .ec-mood {
          padding: 9px 15px;
          border-radius: var(--r-pill);
          border: var(--border);
          background: var(--surface);
          color: var(--dim);
          font-size: 13.5px;
          transition: all var(--dur-hover) var(--ease-hover);
        }
        .ec-mood--on {
          border-color: var(--hue);
          background: color-mix(in srgb, var(--hue) 16%, transparent);
          color: var(--text);
        }

        .ec-draft {
          width: 100%;
          resize: vertical;
          padding: 14px 16px;
          border-radius: var(--r-control);
          border: var(--border);
          background: var(--bg);
          color: var(--text);
          font-family: inherit;
          font-size: var(--fs-body);
          font-weight: var(--fw-light);
          line-height: var(--lh-body-sm);
        }
        .ec-draft:focus-visible { outline-color: var(--clarity); border-color: var(--clarity); }

        .ec-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin: 12px 0 18px;
        }
        .ec-who {
          flex: 1;
          min-width: 240px;
          padding: 12px 16px;
          border-radius: var(--r-control);
          border: var(--border);
          background: var(--bg);
          color: var(--text);
          font-family: inherit;
          font-size: var(--fs-body);
          font-weight: var(--fw-light);
        }
        .ec-pin {
          padding: 12px 22px;
          border-radius: 11px;
          border: var(--border);
          background: var(--surface);
          color: var(--disabled);
          font-size: var(--fs-btn);
          font-weight: var(--fw-medium);
          cursor: default;
          transition: all var(--dur-hover) var(--ease-hover);
        }
        .ec-pin--ready {
          border: 0;
          background: var(--clarity);
          color: var(--on-clarity-solid);
          cursor: pointer;
        }
        .ec-mail { font-size: 14px; font-weight: var(--fw-medium); }

        .ec-privacy {
          font-size: var(--fs-meta);
          line-height: var(--lh-meta);
          color: var(--dimmer);
          max-width: 620px;
        }

        .ec-wall-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 30px 0 14px;
        }
        .ec-wall-label {
          font-size: var(--fs-label);
          font-weight: var(--fw-medium);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--dimmer);
        }
        .ec-clear {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: var(--dimmer);
          font-size: 12.5px;
        }
        .ec-clear:hover { color: var(--feel); }

        .ec-wall {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 14px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .ec-note {
          border: var(--border);
          border-top: 2px solid var(--hue);
          border-radius: var(--r-card);
          padding: 14px 16px;
          background: var(--surface);
        }
        .ec-note-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .ec-note-mood {
          font-size: var(--fs-label);
          font-weight: var(--fw-medium);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--hue);
        }
        .ec-note-x {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: var(--dimmer);
          font-size: 16px;
          line-height: 1;
          padding: 0;
        }
        .ec-note-x:hover { color: var(--feel); }
        .ec-note-text {
          font-size: var(--fs-body-sm);
          line-height: var(--lh-body-sm);
          color: var(--text);
          margin-bottom: 10px;
          overflow-wrap: anywhere;
        }
        .ec-note-meta { font-size: var(--fs-meta); color: var(--dimmer); }

        @media (max-width: 900px) {
          .ec-shell { padding: 22px 18px; }
          .ec-pin, .ec-mood { min-height: 44px; }
        }
      `}</style>
    </section>
  );
}
