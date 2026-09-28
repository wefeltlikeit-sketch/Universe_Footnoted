import { useEffect } from 'react';
import { app, useApp } from './state';
import { MODES } from './modes';
import Home from './views/Home';
import Explore from './views/Explore';
import PathFinder from './views/PathFinder';
import SixDegrees from './views/SixDegrees';
import Atlas from './views/Atlas';
import Journeys from './views/Journeys';
import Replay from './views/Replay';
import { EdgeCard, HowDidIGetHere, SettingsSheet } from './views/Overlays';
import { IconMoon, IconSettings, IconSun } from './components/Icons';

export default function App() {
  const ready = useApp((s) => s.ready);
  const view = useApp((s) => s.view);
  const overlay = useApp((s) => s.overlay);
  const toast = useApp((s) => s.toast);
  const hasJourney = useApp((s) => !!s.journey);
  const settings = useApp((s) => s.settings);

  useEffect(() => {
    void app.init();
  }, []);

  if (!ready) return <div className="app" />;

  return (
    <div className="app">
      {view === 'home' && <Home />}
      {view === 'explore' && <Explore />}
      {view === 'paths' && <PathFinder />}
      {view === 'game' && <SixDegrees />}
      {view === 'atlas' && <Atlas />}
      {view === 'journeys' && <Journeys />}

      <header className="topbar">
        <button className="wordmark" onClick={() => app.go('home')} title="Begin again">
          The Universe Has Footnotes<sup>1</sup>
        </button>
        <nav className="nav" aria-label="Modes">
          {MODES.filter((m) => !m.needsJourney || hasJourney).map((m) => (
            <button key={m.id} aria-current={view === m.id ? 'page' : undefined} onClick={() => app.go(m.id)}>{m.label}</button>
          ))}
        </nav>
        <span className="spacer" />
        <label className="dial" title="How far should connections reach?">
          <span className="label">Familiar</span>
          <input
            type="range" min={0} max={1} step={0.01} value={settings.strangeness}
            aria-label="Familiar to strange"
            onChange={(e) => void app.saveSettings({ strangeness: Number(e.target.value) })}
          />
          <span className="label">Strange</span>
        </label>
        <button className="iconbtn" aria-label="Toggle day and night" onClick={() => void app.saveSettings({ theme: settings.theme === 'night' ? 'paper' : 'night' })}>
          {settings.theme === 'night' ? <IconSun /> : <IconMoon />}
        </button>
        <button className="iconbtn" aria-label="Settings" onClick={() => app.set({ overlay: { kind: 'settings' } })}><IconSettings /></button>
      </header>

      {overlay?.kind === 'howdid' && <HowDidIGetHere />}
      {overlay?.kind === 'edge' && <EdgeCard edgeId={overlay.edgeId} from={overlay.from} />}
      {overlay?.kind === 'settings' && <SettingsSheet />}
      {overlay?.kind === 'replay' && <Replay journeyId={overlay.journeyId} />}

      {toast && (
        <div className={`toast ${toast.kind === 'error' ? 'error' : ''}`} role="status">
          {toast.kind === 'margin' && <span className="mark">✦ marginalia</span>}
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  );
}
