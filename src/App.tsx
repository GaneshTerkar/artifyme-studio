import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { artworks, categories } from "./data/artworks";
import { ArtworkCard } from "./components/ArtworkCard";
import { ArtworkModal } from "./components/ArtworkModal";
import { Icon } from "./components/Icons";
import type { Artwork, Category, SortOption } from "./types";

const styles = ["Abstract", "Realism", "Impressionist", "Minimalist", "Contemporary"];
const mediums = ["Oil on canvas", "Acrylic on canvas", "Watercolour", "Mixed media", "Archival print", "Charcoal and pastel"];
function readSaved(): string[] {
  try { const value = window.localStorage.getItem("artify-saved-artworks"); return value ? JSON.parse(value) as string[] : []; }
  catch { return []; }
}
export default function App() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("popular");
  const [savedIds, setSavedIds] = useState<string[]>(readSaved);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleFavorite = useCallback((id: string) => {
    setSavedIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      try { window.localStorage.setItem("artify-saved-artworks", JSON.stringify(next)); } catch { /* Session-only fallback. */ }
      return next;
    });
  }, []);
  const toggleValue = (values: string[], value: string, setter: (next: string[]) => void) => setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  const filteredArtworks = useMemo(() => {
    const text = query.trim().toLowerCase();
    const result = artworks.filter((art) => {
      const categoryMatch = activeCategory === "All" || art.category === activeCategory;
      const textMatch = !text || [art.title, art.artist, art.category, art.medium].some((part) => part.toLowerCase().includes(text));
      const styleMatch = !selectedStyles.length || selectedStyles.some((style) =>
        (style === "Abstract" && art.category === "Abstract") ||
        (style === "Realism" && art.category === "Portrait") ||
        (style === "Impressionist" && art.category === "Landscape") ||
        (style === "Minimalist" && (art.title.toLowerCase().includes("forms") || art.title.toLowerCase().includes("quiet"))) ||
        (style === "Contemporary" && art.year >= 2025));
      const mediumMatch = !selectedMediums.length || selectedMediums.includes(art.medium);
      return categoryMatch && textMatch && styleMatch && mediumMatch && art.price <= maxPrice && (!showSavedOnly || savedIds.includes(art.id));
    });
    return result.sort((a, b) => sort === "newest" ? b.year - a.year : sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : b.rating * b.reviews - a.rating * a.reviews);
  }, [activeCategory, query, selectedStyles, selectedMediums, maxPrice, showSavedOnly, savedIds, sort]);
  const clearFilters = () => { setActiveCategory("All"); setQuery(""); setSelectedStyles([]); setSelectedMediums([]); setMaxPrice(50000); setShowSavedOnly(false); };
  const activeFilterCount = selectedStyles.length + selectedMediums.length + (maxPrice < 50000 ? 1 : 0);

  return <div className="min-h-screen bg-paper text-ink">
    <header className="site-header"><div className="header-inner">
      <Link to="/" className="brand" aria-label="Artify home"><span className="brand-mark"><span /><span /><span /></span><span className="brand-word">artify<span>.</span><small>ART THAT FEELS LIKE YOU</small></span></Link>
      <nav className={"desktop-nav" + (mobileMenuOpen ? " is-open" : "")} aria-label="Main navigation">
        <a className="nav-link is-active" href="#gallery">Discover</a><a className="nav-link" href="#artists">Artists</a><a className="nav-link" href="#story">Our story</a>
      </nav>
      <div className="header-actions">
        <button className={"header-icon" + (showSavedOnly ? " is-active" : "")} type="button" onClick={() => setShowSavedOnly((value) => !value)} aria-label="Show saved artworks" aria-pressed={showSavedOnly}><Icon name="heart" size={19} /><span className="saved-count">{savedIds.length}</span></button>
        <button className="header-cta" type="button" onClick={() => window.alert("The artist application experience is coming soon.")}>Become an artist <Icon name="arrow-up-right" size={15} /></button>
        <button className="mobile-menu-button" type="button" onClick={() => setMobileMenuOpen((value) => !value)} aria-label="Toggle navigation"><Icon name={mobileMenuOpen ? "x" : "menu"} size={21} /></button>
      </div>
    </div></header>
    <main>
      <section className="hero-shell">
        <div className="hero-copy"><div className="eyebrow hero-eyebrow"><Icon name="sparkles" size={14} /> THE ART OF FINDING YOURS</div>
          <h1>Find art that<br /><em>feels like you.</em></h1>
          <p>Original works. Independent voices. Pieces that make a space feel more like yours.</p>
          <a href="#gallery" className="hero-link">Explore the collection <Icon name="arrow-right" size={17} /></a>
        </div>
        <div className="hero-art"><img src="https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1400&q=90" alt="Large abstract artwork in violet, ochre and muted blue" /><div className="hero-art-note"><span>CURATED WITH INTENTION</span><strong>Art for the<br />way you live.</strong></div></div>
        <div className="hero-caption"><span>01 / 04</span><span>THE NEW COLLECTOR EDIT</span><span>SCROLL TO DISCOVER ↓</span></div>
      </section>
      <section id="gallery" className="gallery-section">
        <div className="gallery-heading"><div><p className="eyebrow">A WORLD OF ORIGINALS</p><h2>Discover your <em>next favourite.</em></h2><p className="section-intro">Thoughtful art, made by people who care deeply about what they create.</p></div><div className="collection-note"><span className="collection-note__number">01</span><span>THE ARTIFY<br />COLLECTION</span></div></div>
        <div className="discovery-toolbar">
          <label className="search-field"><Icon name="search" size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search artworks, artists, styles..." aria-label="Search artworks, artists and styles" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><Icon name="x" size={16} /></button>}<kbd>⌘ K</kbd></label>
          <button className={"filter-trigger" + (filtersOpen ? " is-active" : "")} type="button" onClick={() => setFiltersOpen((value) => !value)} aria-expanded={filtersOpen}><Icon name="sliders" size={17} /> Filters {activeFilterCount > 0 && <span>{activeFilterCount}</span>}</button>
          <label className="sort-control"><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} aria-label="Sort artwork"><option value="popular">Most loved</option><option value="newest">Recently added</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select><Icon name="chevron-down" size={15} /></label>
        </div>
        <div className="category-strip" role="group" aria-label="Filter by artwork category">{categories.map((category) => <button key={category.value} type="button" className={"category-chip" + (activeCategory === category.value ? " is-active" : "")} onClick={() => setActiveCategory(category.value)} aria-pressed={activeCategory === category.value}>{category.label}<span>{category.count}</span></button>)}</div>
        <div className="gallery-layout">
          {filtersOpen && <button className="filter-scrim" aria-label="Close filters" onClick={() => setFiltersOpen(false)} />}
          <aside className={"filter-sidebar" + (filtersOpen ? " is-open" : "")} aria-label="Artwork filters">
            <div className="filter-sidebar__top"><div><p className="eyebrow">REFINE YOUR SEARCH</p><h3>Filters</h3></div><button type="button" className="filter-close" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><Icon name="x" size={19} /></button></div>
            <div className="filter-group"><h4>Art style</h4>{styles.map((style, index) => <label className="check-row" key={style}><input type="checkbox" checked={selectedStyles.includes(style)} onChange={() => toggleValue(selectedStyles, style, setSelectedStyles)} /><span>{style}</span><small>{[342, 276, 185, 118, 204][index]}</small></label>)}</div>
            <div className="filter-group"><h4>Medium</h4>{mediums.map((medium) => <label className="check-row" key={medium}><input type="checkbox" checked={selectedMediums.includes(medium)} onChange={() => toggleValue(selectedMediums, medium, setSelectedMediums)} /><span>{medium}</span></label>)}</div>
            <div className="filter-group"><div className="flex items-center justify-between"><h4>Price range</h4><span className="filter-price">₹{maxPrice.toLocaleString("en-IN")}</span></div><input className="price-range" type="range" min="5000" max="50000" step="1000" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label="Maximum artwork price" /><div className="range-labels"><span>₹5,000</span><span>₹50,000+</span></div></div>
            <div className="filter-sidebar__bottom"><button type="button" className="clear-filters" onClick={clearFilters}>Clear all filters</button><button type="button" className="apply-filters" onClick={() => setFiltersOpen(false)}>Show {filteredArtworks.length} artworks</button></div>
          </aside>
          <div className="results-area">
            <div className="results-summary"><p><strong>{filteredArtworks.length}</strong> pieces to fall for <span>·</span> <span>{showSavedOnly ? "Your saved collection" : activeCategory === "All" ? "All categories" : activeCategory}</span></p><button type="button" onClick={() => setShowSavedOnly((value) => !value)} className={"saved-filter-link" + (showSavedOnly ? " is-active" : "")}><Icon name="heart" size={15} /> {showSavedOnly ? "View all art" : "Saved by you"}</button></div>
            {filteredArtworks.length > 0 ? <div className="artwork-grid">{filteredArtworks.map((artwork) => <ArtworkCard key={artwork.id} artwork={artwork} saved={savedIds.includes(artwork.id)} onFavorite={toggleFavorite} onOpen={setSelectedArtwork} />)}</div> : <div className="empty-state"><span className="empty-state__icon"><Icon name="search" size={26} /></span><h3>No artworks found just yet</h3><p>Try a different search or clear a few filters to explore more of the collection.</p><button type="button" className="button-primary" onClick={clearFilters}>Clear filters</button></div>}
            <div className="load-more"><span>YOU'VE REACHED THE END OF THIS EDIT</span><span className="load-more__line" /><button type="button" onClick={() => { clearFilters(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Back to top <Icon name="arrow-up-right" size={15} /></button></div>
          </div>
        </div>
      </section>
      <section id="artists" className="artist-banner"><div><p className="eyebrow">IN GOOD COMPANY</p><h2>Independent artists.<br /><em>Original perspectives.</em></h2></div><p>Every piece has a person and a story behind it. Meet the artists shaping the Artify collection, one thoughtful creation at a time.</p><a href="#gallery">Meet our artists <Icon name="arrow-up-right" size={16} /></a></section>
    </main>
    <footer id="story" className="site-footer"><Link to="/" className="brand brand--footer"><span className="brand-mark"><span /><span /><span /></span><span className="brand-word">artify<span>.</span><small>ART THAT FEELS LIKE YOU</small></span></Link><p>Collect slowly. Live with art.</p><span>© 2026 Artify Studio</span></footer>
    <ArtworkModal artwork={selectedArtwork} saved={selectedArtwork ? savedIds.includes(selectedArtwork.id) : false} onClose={() => setSelectedArtwork(null)} onFavorite={toggleFavorite} />
  </div>;
}