export default function MusicButton({ playing, onToggle }) {
  return (
    <button
      className={`music ${playing ? 'music--on' : ''}`}
      onClick={onToggle}
      aria-label={playing ? 'Pause music' : 'Play music'}
      title={playing ? 'Pause music' : 'Play music'}
    >
      <span className="music__bars" aria-hidden="true">
        <i /><i /><i /><i />
      </span>
      <span className="music__label">{playing ? 'Pause music' : 'Play music'}</span>
    </button>
  )
}
