"use client";

import { AutoResizeTextarea } from './AutoResizeTextarea';

interface EntryEditorBodyProps {
  moment: string;
  narrative: string;
  onMomentChange: (value: string) => void;
  onNarrativeChange: (value: string) => void;
}

export function EntryEditorBody({
  moment,
  narrative,
  onMomentChange,
  onNarrativeChange,
}: EntryEditorBodyProps) {
  return (
    <article className="lg:col-span-8 space-y-16">
      <section>
        <h2 className="mb-8 flex items-center gap-3 font-epic-serif text-3xl text-foreground md:text-4xl">
          Moment in Time
        </h2>
        <div className="w-full">
          <AutoResizeTextarea
            value={moment}
            onChange={onMomentChange}
            placeholder="Describe the historical context or the specific moment captured by this artifact..."
            className="font-elegant-sans text-xl text-foreground/80 font-light leading-relaxed placeholder:text-muted-foreground/20 italic"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-8 flex items-center gap-3 font-epic-serif text-3xl text-foreground md:text-4xl">
          The Narrative
        </h2>
        <div className="w-full">
          <AutoResizeTextarea
            value={narrative}
            onChange={onNarrativeChange}
            placeholder="Tell the story of this artifact. Why does it matter? What is the deeper narrative here?..."
            className="font-elegant-sans text-lg text-foreground/80 font-light leading-relaxed placeholder:text-muted-foreground/20 min-h-[200px]"
          />
        </div>
      </section>
    </article>
  );
}
