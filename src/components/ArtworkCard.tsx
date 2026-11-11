import type { Artwork } from "../types";
import { Icon } from "./Icons";
type Props = { artwork: Artwork; saved: boolean; onFavorite: (id: string) => void; onOpen: (artwork: Artwork) => void };
export function ArtworkCard({ artwork, saved, onFavorite, onOpen }: Props) {
  return <article className="art-card group">
    <div className="art-card__image-wrap" style={{ aspectRatio: artwork.ratio }}>
      <img className="art-card__image" src={artwork.image} alt={artwork.imageAlt} loading="lazy" />
      {artwork.featured && <span className="art-card__badge">Curator's pick</span>}
      <button type="button" className={"favorite-button" + (saved ? " is-saved" : "")} onClick={() => onFavorite(artwork.id)} aria-label={saved ? "Remove " + artwork.title + " from saved art" : "Save " + artwork.title} aria-pressed={saved}><Icon name="heart" size={19} /></button>
      <div className="art-card__hover-actions">
        <button type="button" onClick={() => onOpen(artwork)} className="hover-action"><Icon name="eye" size={16} /> Quick view</button>
        <button type="button" onClick={() => onOpen(artwork)} className="hover-action hover-action--dark">Discover artwork <Icon name="arrow-up-right" size={15} /></button>
      </div>
    </div>
    <div className="art-card__meta">
      <div className="min-w-0"><h3 className="art-card__title">{artwork.title}</h3><p className="art-card__artist">by {artwork.artist}</p></div>
      <div className="text-right shrink-0"><p className="art-card__price">₹{artwork.price.toLocaleString("en-IN")}</p><p className="art-card__rating"><span>★</span> {artwork.rating.toFixed(1)} <span className="rating-count">({artwork.reviews})</span></p></div>
    </div>
  </article>;
}