import { useState } from 'react'
import { gate, person } from '../content.js'

export default function Gate({ onOpen }) {
  const [leaving, setLeaving] = useState(false)

  const open = () => {
    setLeaving(true)
    onOpen()
  }

  return (
    <div className={`gate ${leaving ? 'gate--leaving' : ''}`} role="dialog" aria-label="Birthday gift">
      <div className="gate__panel gate__panel--left" aria-hidden="true" />
      <div className="gate__panel gate__panel--right" aria-hidden="true" />
      <div className="gate__inner">
        <p className="gate__date">{person.birthday}</p>
        <p className="gate__line">{gate.line}</p>
        <button className="btn btn--gold" onClick={open} autoFocus>
          {gate.button}
        </button>
        <p className="gate__hint">Turn your sound on</p>
      </div>
    </div>
  )
}
