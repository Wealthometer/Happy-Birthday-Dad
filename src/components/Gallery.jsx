import { useCallback, useEffect, useState } from 'react'
import { gallery, galleryCategories } from '../content.js'

export default function Gallery() {
  const [filter, setFilter] = useState('All')
  const [openIndex, setOpenIndex] = useState(null)
  const items = filter === 'All' ? gallery : gallery.filter((g) => g.cat === filter)

  const close = useCallback(() => setOpenIndex(null), [])
  const step = useCallback(
    (d) => setOpenIndex((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length]
  )

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [openIndex, close, step])

  const current = openIndex !== null ? items[openIndex] : null

  return (
    <>
      <div className="filters" role="tablist" aria-label="Filter photos">
        {galleryCategories.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={filter === c}
            className={`filter ${filter === c ? 'filter--active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="masonry">
        {items.map((g, i) => (
          <button key={g.src} className="masonry__item" onClick={() => setOpenIndex(i)} aria-label={`Open photo: ${g.alt}`}>
            <img src={g.src} alt={g.alt} loading="lazy" />
          </button>
        ))}
      </div>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={close}>
          <img src={current.src} alt={current.alt} onClick={(e) => e.stopPropagation()} />
          <button className="lightbox__btn lightbox__close" onClick={close} aria-label="Close">✕</button>
          <button className="lightbox__btn lightbox__prev" onClick={(e) => { e.stopPropagation(); step(-1) }} aria-label="Previous photo">‹</button>
          <button className="lightbox__btn lightbox__next" onClick={(e) => { e.stopPropagation(); step(1) }} aria-label="Next photo">›</button>
          <p className="lightbox__count">{openIndex + 1} of {items.length}</p>
        </div>
      )}
    </>
  )
}
