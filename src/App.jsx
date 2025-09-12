import { useEffect, useState } from "react";

// dummy data 
const COURSES = [
  {
    id: 1,
    title: "Sushin perusteet – live workshop",
    teacher: "Aku Ankka",
    category: "cooking",
    mode: "inperson",
    location: "Tampere",
    date: "2025-09-22",
    price: 49,
    seats: 8,
    durationMin: 120,
    difficulty: "Aloittelija",
    facets: { craft: [], code: [], instrument: [], cooking: ["Sushi"] },
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Lightroom pikakurssi – etä",
    teacher: "Iines Ankka",
    category: "photo",
    mode: "online",
    location: "Etä",
    date: "2025-09-18",
    price: 29,
    seats: 50,
    durationMin: 60,
    difficulty: "Aloittelija",
    facets: { craft: [], code: [], instrument: [], photo: ["Lightroom"] },
    img: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Kitaran alkeet – pienryhmä",
    teacher: "Roope Ankka",
    category: "music",
    mode: "inperson",
    location: "Helsinki",
    date: "2025-10-05",
    price: 35,
    seats: 6,
    durationMin: 90,
    difficulty: "Aloittelija",
    facets: { craft: [], code: [], instrument: ["Kitara"] },
    img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "HIIT etätunti – 30 min",
    teacher: "Hannu Hanhi",
    category: "fitness",
    mode: "online",
    location: "Etä",
    date: "2025-09-12",
    price: 9,
    seats: 200,
    durationMin: 30,
    difficulty: "Kaikki tasot",
    facets: { craft: [], code: [], instrument: [], fitness: ["HIIT"] },
    img: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Neulonnan perusteet – työpaja",
    teacher: "Mummo Ankka",
    category: "crafts",
    mode: "inperson",
    location: "Turku",
    date: "2025-09-28",
    price: 25,
    seats: 10,
    durationMin: 180,
    difficulty: "Aloittelija",
    facets: { craft: ["Neulonta"], code: [], instrument: [] },
    img: "https://images.unsplash.com/photo-1600692938584-3ec9de9a8b8a?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "React 101 – live-koodi-ilta",
    teacher: "Pelle Peloton",
    category: "coding",
    mode: "online",
    location: "Etä",
    date: "2025-10-01",
    price: 0,
    seats: 100,
    durationMin: 120,
    difficulty: "Aloittelija",
    facets: { craft: [], code: ["JavaScript", "React"], instrument: [] },
    img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop",
  },
];

// facet config
const DURATION_BUCKETS = [
  { key: "le60", label: "≤ 60 min", match: (m) => m <= 60 },
  { key: "1to3h", label: "1–3 h", match: (m) => m > 60 && m <= 180 },
  { key: "3to8h", label: "3–8 h", match: (m) => m > 180 && m <= 480 },
  { key: "multiday", label: "> 8 h / useampi päivä", match: (m) => m > 480 },
];

const FACETS = {
  crafts: { label: "Käsityöt", values: ["Neulonta", "Keramiikka", "Puutyö", "Virkkauksen alkeet", "Makramee", "Metallityö"] },
  code: { label: "Koodaus", values: ["JavaScript", "React", "Python", "Java", "C#", "Rust", "Kotlin", "Go"] },
  instruments: { label: "Soittimet", values: ["Kitara", "Piano", "Rummut", "Viulu", "Basso", "Ukulele"] },
  groupSize: { label: "Ryhmäkoko", values: ["Yksityistunti", "Pieni ryhmä", "Suuri ryhmä"] },
};

const BROAD = [
  { key: "all", label: "Kaikki" },
  { key: "cooking", label: "Ruoanlaitto" },
  { key: "photo", label: "Valokuvaus" },
  { key: "music", label: "Musiikki" },
  { key: "fitness", label: "Liikunta" },
  { key: "crafts", label: "Käsityöt" },
  { key: "coding", label: "Koodaus" },
];

// UI helpers 
function Tag({ children }) {
  return <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium">{children}</span>;
}

function PillButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-sm border transition ${active ? "bg-black text-white border-black" : "hover:bg-black/5"}`}
    >
      {children}
    </button>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" className="h-4 w-4" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

function CourseCard({ c, onOpen }) {
  return (
    <div className="group rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition">
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={c.img}
          alt=""
          className="h-full w-full object-cover group-hover:scale-105 transition"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/1600x900?text=Kuva";
          }}
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-lg leading-tight">{c.title}</h3>
          <Tag>{c.mode === "online" ? "Etä" : "Lähikurssi"}</Tag>
        </div>
        <div className="text-sm text-neutral-600 flex flex-wrap gap-2">
          <span>👤 {c.teacher}</span>
          <span>•</span>
          <span>🗓 {new Date(c.date).toLocaleDateString()}</span>
          <span>•</span>
          <span>⏱ {c.durationMin} min</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="font-semibold">{c.price ? `${c.price} €` : "Ilmainen"}</div>
          <button onClick={() => onOpen(c)} className="rounded-xl px-4 py-2 border bg-black text-white hover:opacity-90">
            Näytä tiedot
          </button>
        </div>
      </div>
    </div>
  );
}

function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 bg-black/50 grid place-items-center p-4" onClick={onClose}>
      <div className="max-w-3xl w-full rounded-2xl bg-white shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b p-4">
          <div className="font-bold">{title}</div>
          <button className="rounded-xl px-3 py-1 border" onClick={onClose}>
            Sulje
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-xl">
      <button className="w-full flex items-center justify-between p-3" onClick={() => setOpen((v) => !v)}>
        <span className="font-semibold text-sm">{title}</span>
        <svg viewBox="0 0 20 20" className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}>
          <path d="M5 7l5 6 5-6" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
      {open && <div className="p-3 pt-0 space-y-3">{children}</div>}
    </div>
  );
}

// main app
export default function BonzaiApp() {
  const [open, setOpen] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // facet state
  const [fCrafts, setFCrafts] = useState([]);
  const [fCode, setFCode] = useState([]);
  const [fInstr, setFInstr] = useState([]);
  const [fDuration, setFDuration] = useState([]);
  const [fGroupSize, setFGroupSize] = useState([]);
  const [broad, setBroad] = useState("all");

  const toggle = (list, setList, value) => {
    setList((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const matchesFacet = (selected, values = []) => {
    if (!selected.length) return true;
    return selected.some((s) => values.includes(s));
  };

  const filtered = COURSES.filter((c) => {
    const matchMode = true;
    const durMatch = !fDuration.length || fDuration.some((k) => DURATION_BUCKETS.find((b) => b.key === k)?.match(c.durationMin));
    const groupMatch =
      !fGroupSize.length ||
      fGroupSize.some(
        (g) => (c.seats <= 1 && g === "Yksityistunti") || (c.seats > 1 && c.seats <= 10 && g === "Pieni ryhmä") || (c.seats > 10 && g === "Suuri ryhmä")
      );
    const craftMatch = matchesFacet(fCrafts, c.facets.craft);
    const codeMatch = matchesFacet(fCode, c.facets.code);
    const instrMatch = matchesFacet(fInstr, c.facets.instrument);
    const broadMatch = broad === "all" || c.category === broad;
    return matchMode && durMatch && groupMatch && craftMatch && codeMatch && instrMatch && broadMatch;
  });

  const totalSelected = fDuration.length + fGroupSize.length + fCrafts.length + fCode.length + fInstr.length;

  // dev tests
  useEffect(() => {
    console.assert(COURSES.length === 6, "COURSES should have 6 items");
    const coding = COURSES.filter((c) => c.category === "coding");
    console.assert(coding.length === 1 && coding[0].title.includes("React"), "Coding category should include React 101");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-500" />
            <span className="font-bold tracking-tight text-xl">Novi</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a className="hover:underline" href="#">Kurssit</a>
            <a className="hover:underline" href="#">Opettajille</a>
            <a className="hover:underline" href="#">Hinnoittelu</a>
            <button className="rounded-xl px-3 py-1.5 border">Kirjaudu</button>
          </nav>
        </div>
      </header>

      {/* Hero + quick filters */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:py-14">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">Löydä kurssit, pajat ja oppitunnit Novista.</h1>
            <p className="mt-3 text-neutral-600 max-w-prose">Varaa siistejä tunteja yksin tai pienryhmänä. Novi yhdistää osaajat ja oppijat.</p>

            <div className="mt-6 grid gap-3">
              {/* Broad category pills */}
              <div className="flex flex-wrap gap-2">
                {BROAD.map((b) => (
                  <PillButton key={b.key} active={broad === b.key} onClick={() => setBroad(b.key)}>
                    {b.label}
                  </PillButton>
                ))}
              </div>

              {/* Quick filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select className="rounded-xl border px-3 py-2 text-sm" value={fDuration[0] || ""} onChange={(e) => setFDuration(e.target.value ? [e.target.value] : [])}>
                  <option value="">— Kesto —</option>
                  {DURATION_BUCKETS.map((b) => (
                    <option key={b.key} value={b.key}>
                      {b.label}
                    </option>
                  ))}
                </select>

                <select className="rounded-xl border px-3 py-2 text-sm" value={fGroupSize[0] || ""} onChange={(e) => setFGroupSize(e.target.value ? [e.target.value] : [])}>
                  <option value="">— Ryhmäkoko —</option>
                  {FACETS.groupSize.values.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>

                <button className="rounded-xl px-3 py-1.5 border" onClick={() => setFiltersOpen(true)}>
                  Filtterit {totalSelected ? <span className="ml-1 inline-flex items-center justify-center text-xs rounded-full border px-1.5">{totalSelected}</span> : null}
                </button>
                <button className="text-sm underline opacity-80" onClick={() => { setFDuration([]); setFGroupSize([]); setBroad("all"); }}>
                  Tyhjennä pikafiltterit
                </button>
              </div>
            </div>
          </div>

          {/* Right side teaser grid */}
          <div className="relative">
            <div className="rounded-3xl border bg-white p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                {COURSES.slice(0, 4).map((c) => (
                  <div key={c.id} className="rounded-2xl overflow-hidden border">
                    <img src={c.img} alt="" className="h-28 w-full object-cover" onError={(e) => { e.currentTarget.src = "https://placehold.co/800x450?text=Kuva"; }} />
                    <div className="p-2">
                      <div className="text-xs text-neutral-600">{new Date(c.date).toLocaleDateString()}</div>
                      <div className="text-sm font-semibold line-clamp-2">{c.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Tulokset ({filtered.length})</h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <CourseCard key={c.id} c={c} onOpen={setOpen} />
          ))}
        </div>
      </section>

      {/* Filters modal */}
      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Tarkenna hakua">
        <div className="grid md:grid-cols-2 gap-4">
          <FilterSection title="Kesto">
            {DURATION_BUCKETS.map((b) => (
              <Checkbox key={b.key} label={b.label} checked={fDuration.includes(b.key)} onChange={() => toggle(fDuration, setFDuration, b.key)} />
            ))}
          </FilterSection>
          <FilterSection title="Ryhmäkoko">
            {FACETS.groupSize.values.map((g) => (
              <Checkbox key={g} label={g} checked={fGroupSize.includes(g)} onChange={() => toggle(fGroupSize, setFGroupSize, g)} />
            ))}
          </FilterSection>
          <FilterSection title="Käsityöt">
            {FACETS.crafts.values.map((v) => (
              <Checkbox key={v} label={v} checked={fCrafts.includes(v)} onChange={() => toggle(fCrafts, setFCrafts, v)} />
            ))}
          </FilterSection>
          <FilterSection title="Koodaus">
            {FACETS.code.values.map((v) => (
              <Checkbox key={v} label={v} checked={fCode.includes(v)} onChange={() => toggle(fCode, setFCode, v)} />
            ))}
          </FilterSection>
          <FilterSection title="Soittimet">
            {FACETS.instruments.values.map((v) => (
              <Checkbox key={v} label={v} checked={fInstr.includes(v)} onChange={() => toggle(fInstr, setFInstr, v)} />
            ))}
          </FilterSection>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <button className="rounded-xl px-3 py-1.5 border" onClick={() => { setFCrafts([]); setFCode([]); setFInstr([]); setFDuration([]); setFGroupSize([]); }}>
            Tyhjennä
          </button>
          <button className="rounded-xl px-3 py-1.5 border bg-black text-white" onClick={() => setFiltersOpen(false)}>
            Näytä tulokset
          </button>
        </div>
      </Modal>

      {/* Detail modal */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 grid place-items-center p-4" onClick={() => setOpen(null)}>
          <div className="max-w-lg w-full rounded-2xl bg-white shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img src={open.img} alt="" className="h-48 w-full object-cover" onError={(e) => { e.currentTarget.src = "https://placehold.co/1200x675?text=Kuva"; }} />
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-xl leading-tight">{open.title}</h3>
                <Tag>{open.mode === "online" ? "Etä" : "Lähikurssi"}</Tag>
              </div>
              <div className="text-sm text-neutral-600 flex flex-wrap gap-2">
                <span>👤 {open.teacher}</span>
                <span>•</span>
                <span>📍 {open.location}</span>
                <span>•</span>
                <span>🗓 {new Date(open.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>⏱ {open.durationMin} min</span>
                <span>•</span>
                <span>🪑 {open.seats} paikkaa</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="text-lg font-semibold">{open.price ? `${open.price} €` : "Ilmainen"}</div>
                <button className="rounded-xl px-4 py-2 border bg-emerald-600 text-white hover:opacity-90">Varaa paikka</button>
              </div>
              <button onClick={() => setOpen(null)} className="w-full rounded-xl px-4 py-2 border mt-2">
                Sulje
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-neutral-500">© {new Date().getFullYear()} Novi</footer>
    </div>
  );
}
