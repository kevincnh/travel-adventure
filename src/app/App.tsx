import { useState, useRef, useCallback } from "react";
import { Edit3, MapPin, Camera } from "lucide-react";

// ── Editable text block ──────────────────────────────────────────────────────

interface EditableTextProps {
  placeholder: string;
  className?: string;
  label?: string;
  size?: "sm" | "base" | "lg";
}

function EditableText({ placeholder, className = "", label, size = "base" }: EditableTextProps) {
  const [hasContent, setHasContent] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  const handleInput = useCallback(() => {
    setHasContent((divRef.current?.textContent?.trim() ?? "").length > 0);
  }, []);

  const sizeClass = size === "sm" ? "text-base leading-relaxed" : size === "lg" ? "text-2xl leading-relaxed" : "text-lg leading-relaxed";
  const placeholderClass = size === "sm" ? "text-base leading-relaxed" : size === "lg" ? "text-2xl leading-relaxed" : "text-lg leading-relaxed";

  return (
    <div className={`relative group/edit ${className}`}>
      {label && (
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs tracking-[0.2em] text-accent uppercase font-bold">{label}</span>
          <div className="flex-1 h-px bg-border" />
        </div>
      )}
      <div className="relative">
        {!hasContent && !isFocused && (
          <div
            className={`absolute inset-0 text-foreground/35 italic pointer-events-none select-none ${placeholderClass}`}
            aria-hidden="true"
          >
            {placeholder}
          </div>
        )}
        <div
          ref={divRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`outline-none min-h-[1.5em] ${sizeClass} text-foreground/90 focus:text-foreground`}
          style={{ caretColor: "#e5501a" }}
        />
      </div>
      <div
        className={`mt-2 h-px transition-colors duration-300 ${isFocused ? "bg-accent/70" : "bg-border"}`}
      />
      <Edit3
        size={13}
        className="absolute top-0 right-0 text-accent/0 group-hover/edit:text-accent/60 transition-colors duration-200 pointer-events-none"
      />
    </div>
  );
}

// ── Photo with caption ───────────────────────────────────────────────────────

interface PhotoProps {
  id: string;
  w: number;
  h: number;
  alt: string;
  className?: string;
  captionPlaceholder?: string;
}

function Photo({ id, w, h, alt, className = "", captionPlaceholder }: PhotoProps) {
  const url = `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="overflow-hidden bg-secondary group/img">
        <img
          src={url}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-[1.04]"
          loading="lazy"
        />
      </div>
      {captionPlaceholder && (
        <EditableText placeholder={captionPlaceholder} size="base" />
      )}
    </div>
  );
}

// ── Chapter divider ──────────────────────────────────────────────────────────

function ChapterDivider({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-5 py-10">
      <span className="font-mono text-[10px] tracking-[0.3em] text-accent/70">{number}</span>
      <div className="flex-1 h-px bg-border" />
      <span
        className="font-display text-xs tracking-[0.25em] text-foreground/40 uppercase"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
      >
        {title}
      </span>
      <div className="w-8 h-px bg-border" />
    </div>
  );
}

// ── Main app ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3">
          <Camera size={14} className="text-accent" />
          <span
            className="text-sm tracking-[0.3em] uppercase text-foreground/60"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
          >
            Field Journal
          </span>
        </div>
        <div className="flex items-center gap-1 text-foreground/30">
          <MapPin size={11} />
          <EditableText placeholder="Location, Country" className="w-40" size="sm" />
        </div>
      </header>

      <main className="pt-14">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative h-[85vh] min-h-[500px] overflow-hidden bg-secondary">
          <img
            src="https://images.unsplash.com/photo-1564521456797-9f176245daa9?w=1600&h=900&fit=crop&auto=format"
            alt="Mountain range under dramatic clouds"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-10">
            <div className="flex items-end justify-between gap-8">
              <div>
                <p
                  className="text-accent/80 font-mono text-xs tracking-[0.3em] mb-3"
                >
                  01 — EXPEDITION GALLERY
                </p>
                <h1
                  className="text-[clamp(3rem,10vw,8rem)] leading-none tracking-tight text-foreground uppercase"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
                >
                  Into The
                  <br />
                  Unknown
                </h1>
              </div>
              <div className="hidden md:block max-w-xs pb-2">
                <EditableText
                  placeholder="Add an opening note about this expedition — where you went, when, and what drew you there..."
                  label="Overview"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mobile overview text */}
        <div className="md:hidden px-6 py-6">
          <EditableText
            placeholder="Add an opening note about this expedition..."
            label="Overview"
            size="sm"
          />
        </div>

        {/* ── Chapter 1: The Ascent ─────────────────────────────────────────── */}
        <div className="px-6 md:px-12 lg:px-16">
          <ChapterDivider number="01" title="The Ascent" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Left: tall photo */}
            <Photo
              id="1757017634529-3cf08583b4b0"
              w={700}
              h={900}
              alt="Woman hiking with snow-capped mountains behind her"
              captionPlaceholder="Describe this moment — the conditions, the feeling, what you were thinking..."
              className="md:row-span-2"
            />

            {/* Right: description + two photos */}
            <div className="flex flex-col gap-4 md:gap-6">
              <EditableText
                placeholder="Describe the approach — the trail conditions, elevation gain, what the group was feeling as the summit came into view. Write about the challenge and what drove you forward."
                label="Chapter Notes"
                size="base"
                className="pt-2"
              />
              <div className="grid grid-cols-2 gap-3">
                <Photo
                  id="1621306558057-1d040ee57bb9"
                  w={400}
                  h={360}
                  alt="Hiker with backpack ascending a hill"
                  captionPlaceholder="Caption this photo..."
                />
                <Photo
                  id="1609865898563-93d63b3daa64"
                  w={400}
                  h={360}
                  alt="Hiker in black jacket crossing green alpine meadow"
                  captionPlaceholder="Caption this photo..."
                />
              </div>
            </div>
          </div>

          {/* ── Chapter 2: Into The Wild ────────────────────────────────────── */}
          <ChapterDivider number="02" title="Into The Wild" />

          <EditableText
            placeholder="Write about the remote backcountry — the silence, the scale, what you carried and what you left behind. This is where the wilderness became real."
            label="Chapter Notes"
            className="max-w-2xl mb-8"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <Photo
              id="1627224858652-7caf1c53a35e"
              w={500}
              h={600}
              alt="Brown rocky mountain face under blue sky"
              captionPlaceholder="Caption this photo..."
            />
            <Photo
              id="1618443909601-79403c2c4400"
              w={500}
              h={600}
              alt="Green mountain peak under dramatic cloud cover"
              captionPlaceholder="Caption this photo..."
            />
            <Photo
              id="1775626094043-70b4261f3378"
              w={500}
              h={600}
              alt="Tent pitched in rocky mountain landscape at sunrise"
              captionPlaceholder="Caption this photo..."
            />
          </div>

          {/* ── Chapter 3: Summit Camp ───────────────────────────────────────── */}
          <ChapterDivider number="03" title="Summit Camp" />
        </div>

        {/* Full-bleed wide photo */}
        <div className="relative overflow-hidden bg-secondary" style={{ height: "55vh", minHeight: 320 }}>
          <img
            src="https://images.unsplash.com/photo-1594210177551-c13ee838bdb7?w=1600&h=700&fit=crop&auto=format"
            alt="Green mountains under wide open sky"
            className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
          <div className="absolute left-8 md:left-16 bottom-8 md:bottom-10 max-w-sm">
            <EditableText
              placeholder="Add a note about the camp — altitude, temperature, who was there, what the night sky looked like..."
              label="Group Note"
              size="sm"
              className="text-foreground"
            />
          </div>
        </div>

        {/* ── Chapter 4: On The Water ─────────────────────────────────────────── */}
        <div className="px-6 md:px-12 lg:px-16">
          <ChapterDivider number="04" title="On The Water" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 items-start">
            {/* Left: text */}
            <div className="md:col-span-2 flex flex-col gap-6 pt-1">
              <EditableText
                placeholder="Describe the river — the current, the sound of it, the spray on your face. Write about the rapid that took you by surprise or the calm stretch that felt like floating through another world."
                label="Chapter Notes"
              />
              <EditableText
                placeholder="Add any group context — who paddled, how long, what gear you used..."
                label="Crew & Kit"
                size="sm"
              />
            </div>

            {/* Right: photo grid */}
            <div className="md:col-span-3 grid grid-cols-2 gap-3">
              <Photo
                id="1635786881522-d920daac2227"
                w={500}
                h={640}
                alt="Person in orange kayak navigating river"
                captionPlaceholder="Caption..."
                className="col-span-2"
              />
              <Photo
                id="1778379591293-36b4cb24324f"
                w={400}
                h={360}
                alt="Kayakers paddling near large sea rock formation"
                captionPlaceholder="Caption..."
              />
              <Photo
                id="1769736080630-cc2182800123"
                w={400}
                h={360}
                alt="Kayaker running a rapid river"
                captionPlaceholder="Caption..."
              />
            </div>
          </div>

          {/* ── Closing note ─────────────────────────────────────────────────── */}
          <div className="mt-16 mb-8 border-t border-border pt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <EditableText
              placeholder="Final thoughts on this expedition — what surprised you, what you'd do differently, what you want to remember most."
              label="Expedition Debrief"
              className="md:col-span-2"
            />
            <div className="flex flex-col gap-4">
              <EditableText placeholder="Total distance covered" label="Stats" size="sm" />
              <EditableText placeholder="Days in the field" size="sm" />
              <EditableText placeholder="Highest elevation" size="sm" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 md:px-16 py-8 flex items-center justify-between">
        <span
          className="text-xs tracking-[0.3em] uppercase text-foreground/20"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
        >
          Field Journal
        </span>
        <span className="font-mono text-[10px] text-foreground/20 tracking-widest">
          Click any text to edit
        </span>
        <span className="font-mono text-[10px] text-foreground/20">
          All photos via Unsplash
        </span>
      </footer>
    </div>
  );
}
