import { useId, useMemo, useState } from 'react';
import { app, useApp } from '../state';

/**
 * A quiet combobox: suggests known concepts as you type, but always lets you begin with anything.
 * Unknown topics are written on demand (AI) or looked up (Wikipedia).
 */
export default function ConceptSearch(props: {
  placeholder?: string;
  onPick: (value: { id?: string; text: string }) => void;
  autoFocus?: boolean;
  className?: string;
  value?: string;
  onChange?: (v: string) => void;
  allowNew?: boolean;
  'aria-label'?: string;
}) {
  const [inner, setInner] = useState('');
  const text = props.value ?? inner;
  const setText = props.onChange ?? setInner;
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(0);
  const version = useApp((s) => s.graphVersion);
  const listId = useId();

  const results = useMemo(() => (text.trim() ? app.graph.search(text, 6) : []), [text, version]);
  const exact = results[0] && results[0].title.toLowerCase() === text.trim().toLowerCase();
  const showNew = props.allowNew !== false && text.trim().length > 1 && !exact;
  const count = results.length + (showNew ? 1 : 0);

  const pick = (i: number) => {
    const c = results[i];
    setOpen(false);
    if (c) {
      setText(c.title);
      props.onPick({ id: c.id, text: c.title });
    } else if (text.trim()) {
      props.onPick({ text: text.trim() });
    }
  };

  return (
    <div className="combo" style={{ position: 'relative' }}>
      <input
        className={props.className ?? 'field'}
        value={text}
        placeholder={props.placeholder}
        autoFocus={props.autoFocus}
        aria-label={props['aria-label'] ?? props.placeholder}
        role="combobox"
        aria-expanded={open && count > 0}
        aria-controls={listId}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
          setSel(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(count - 1, s + 1)); }
          if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
          if (e.key === 'Enter') { e.preventDefault(); pick(open && count ? sel : exact ? 0 : results.length); }
          if (e.key === 'Escape') setOpen(false);
        }}
      />
      {open && count > 0 && (
        <div className="suggest" role="listbox" id={listId}>
          {results.map((c, i) => (
            <button key={c.id} role="option" aria-selected={i === sel} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(i)}>
              <span>{c.title}</span>
              <span className="k">{c.stub ? 'not yet written' : c.kicker}</span>
            </button>
          ))}
          {showNew && (
            <button role="option" aria-selected={sel === results.length} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(results.length)}>
              <span>“{text.trim()}”</span>
              <span className="new">{app.ai?.available ? 'write it' : 'look it up'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
