import { useState } from 'react'
import Gate from './components/Gate.jsx'
import MusicButton from './components/MusicButton.jsx'
import Gallery from './components/Gallery.jsx'
import { useBirthdayMusic } from './useBirthdayMusic.js'
import {
  person, musicSrc, hero, letter, roles, journey, ministry, lessons, finale,
} from './content.js'

function Lattice() {
  return <div className="lattice" aria-hidden="true" />
}

export default function App() {
  const [opened, setOpened] = useState(false)
  const [gateGone, setGateGone] = useState(false)
  const music = useBirthdayMusic(musicSrc)

  const openGift = () => {
    music.play()
    setOpened(true)
    setTimeout(() => setGateGone(true), 1600)
  }

  return (
    <>
      {!gateGone && <Gate onOpen={openGift} />}
      {opened && <MusicButton playing={music.playing} onToggle={music.toggle} />}

      <main className={opened ? 'is-open' : ''} aria-hidden={!opened}>
        {/* ── Hero ───────────────────────────── */}
        <header className="hero">
          <div className="hero__text">
            <p className="hero__date">{person.birthday}, {person.year}</p>
            <h1 className="hero__title">
              <span>Happy</span>
              <span>birthday,</span>
              <span className="hero__dad">Dad.</span>
            </h1>
            <div className="hero__name">
              <p className="hero__rank">{person.title}</p>
              <p className="hero__full">{person.name}</p>
              <p className="hero__ministry">General Overseer, {person.ministry}</p>
            </div>
            <p className="hero__tagline">{hero.tagline}</p>
          </div>
          <figure className="hero__photo arch">
            <img src={hero.photo} alt={`${person.title} ${person.name} smiling in a blue agbada`} />
          </figure>
          <a href="#letter" className="hero__scroll">Read my letter</a>
        </header>

        <Lattice />

        {/* ── Letter ─────────────────────────── */}
        <section id="letter" className="section letter">
          <figure className="letter__photo arch">
            <img src={letter.photo} alt="Dad standing in a rose agbada" loading="lazy" />
          </figure>
          <div className="letter__body">
            <h2 className="h2">To my father</h2>
            {letter.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            <p className="letter__sign">
              {letter.signoff}
              <span>{person.son.split(' ')[0]}</span>
            </p>
          </div>
        </section>

        {/* ── Roles ──────────────────────────── */}
        <section className="section roles">
          <h2 className="h2 h2--center">The man behind the mission</h2>
          <div className="roles__row">
            {roles.map((r) => (
              <article key={r.name} className="role">
                <div className="role__img arch">
                  <img src={r.photo} alt={`Dad as ${r.name.toLowerCase()}`} loading="lazy" />
                </div>
                <h3>{r.name}</h3>
                <p>{r.line}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Journey ────────────────────────── */}
        <section className="section journey">
          <h2 className="h2 h2--center">His journey</h2>
          <ol className="timeline">
            {journey.map((j, i) => (
              <li key={j.title} className="stop">
                <div className="stop__marker" aria-hidden="true">{String(i + 1).padStart(2, '0')}</div>
                <img className="stop__img" src={j.photo} alt="" loading="lazy" />
                <div className="stop__text">
                  {j.year && <p className="stop__year">{j.year}</p>}
                  <h3>{j.title}</h3>
                  <p>{j.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Ministry ───────────────────────── */}
        <section className="ministry">
          <div className="ministry__banner" style={{ backgroundImage: `url(${ministry.heroPhoto})` }}>
            <div className="ministry__overlay">
              <div className="ministry__inner">
                <p className="ministry__name">{person.ministry}</p>
                <h2 className="ministry__statement">{ministry.statement}</h2>
              </div>
            </div>
          </div>
          <div className="section ministry__more">
            <p className="ministry__text">{ministry.text}</p>
            <div className="ministry__photos">
              {ministry.photos.map((src) => (
                <img key={src} src={src} alt="Dad ministering" loading="lazy" />
              ))}
            </div>
          </div>
        </section>

        <Lattice />

        {/* ── Gallery ────────────────────────── */}
        <section className="section gallery">
          <h2 className="h2 h2--center">Moments</h2>
          <Gallery />
        </section>

        {/* ── Lessons ────────────────────────── */}
        <section className="section lessons">
          <h2 className="h2">What my father has taught me</h2>
          <div className="lessons__grid">
            {lessons.map((l) => (
              <div key={l.title} className="lesson">
                <h3>{l.title}</h3>
                <p>{l.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Finale ─────────────────────────── */}
        <section className="finale">
          <figure className="finale__photo arch">
            <img src={finale.photo} alt="Dad celebrating, arm raised, in a blue agbada" loading="lazy" />
          </figure>
          <div className="finale__text">
            <h2 className="finale__title">Happy birthday, Dad.</h2>
            <p className="finale__name">{person.title} {person.name}</p>
            <ul className="finale__thanks">
              {finale.thanks.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <p className="finale__closing">{finale.closing}</p>
            <p className="finale__love">{finale.love}</p>
            <p className="finale__sig">{person.son}</p>
          </div>
        </section>

        <footer className="footer">
          <Lattice />
          <p>Made with love by your son, {person.son}, {person.year}.</p>
        </footer>
      </main>
    </>
  )
}
