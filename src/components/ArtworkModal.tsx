import { useEffect } from "react";
import type { Artwork } from "../types";
import { Icon } from "./Icons";
type Props = { artwork: Artwork | null; saved: boolean; onClose: () => void; onFavorite: (id: string) => void };
export function ArtworkModal({ artwork, saved, onClose, onFavorite }: Props) {
  useEffect(() => {
    if (!artwork) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = ""; };
  }, [artwork, onClose]);
  if (!artwork) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="artwork-modal" role="dialog" aria-modal="true" aria-labelledby="artwork-modal-title">
      <button className="modal-close" type="button" onClick={onClose} aria-label="Close artwork details"><Icon name="x" size={19} /></button>
      <div className="artwork-modal__image"><img src={artwork.image} alt={artwork.imageAlt} /></div>
      <div className="artwork-modal__content">
        <p className="eyebrow">{artwork.category} · {artwork.year}</p>
        <h2 id="artwork-modal-title" className="font-display text-3xl leading-tight">{artwork.title}</h2>
        <p className="text-sm text-stone-500 mt-2">An original work by <span className="font-semibold text-ink">{artwork.artist}</span></p>
        <div className="modal-rating"><span>★</span> {artwork.rating.toFixed(1)} <span className="text-stone-400">({artwork.reviews} collector reviews)</span></div>
        <p className="text-sm leading-7 text-stone-600 mt-6">{artwork.description}</p>
        <div className="detail-grid">
          <div><span>Medium</span><strong>{artwork.medium}</strong></div><div><span>Dimensions</span><strong>{artwork.dimensions}</strong></div>
          <div><span>Created</span><strong>{artwork.year}</strong></div><div><span>Availability</span><strong className="text-violet-700">Original · 1 of 1</strong></div>
        </div>
        <div className="modal-purchase"><div><span className="text-xs text-stone-500">Artwork price</span><p className="text-2xl font-semibold">₹{artwork.price.toLocaleString("en-IN")}</p></div><button type="button" className="button-primary" onClick={() => window.alert("Your artwork inquiry has been noted.")}>Enquire about art <Icon name="arrow-up-right" size={16} /></button></div>
        <button type="button" className={"save-detail" + (saved ? " is-saved" : "")} onClick={() => onFavorite(artwork.id)}><Icon name="heart" size={17} /> {saved ? "Saved to your collection" : "Save to favourites"}</button>
      </div>
    </section>
  </div>;
}