"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { AutoResizeTextarea } from "./AutoResizeTextarea";

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
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

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

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-primary/10 pb-4">
          <h2 className="font-epic-serif text-3xl text-foreground md:text-4xl">
            The Narrative
          </h2>
          {/* Mobile Tabs Toggle */}
          <div className="flex lg:hidden bg-primary/5 p-1 border border-primary/15 rounded-md">
            <button
              type="button"
              onClick={() => setMobileTab("edit")}
              className={`px-4 py-1.5 text-xs tracking-wider uppercase transition-all duration-300 font-sans rounded-sm cursor-pointer ${
                mobileTab === "edit"
                  ? "bg-primary/20 text-primary border border-primary/20"
                  : "text-ink-soft hover:text-foreground border border-transparent opacity-60"
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              className={`px-4 py-1.5 text-xs tracking-wider uppercase transition-all duration-300 font-sans rounded-sm cursor-pointer ${
                mobileTab === "preview"
                  ? "bg-primary/20 text-primary border border-primary/20"
                  : "text-ink-soft hover:text-foreground border border-transparent opacity-60"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column: Editor (Visible on desktop and active edit tab on mobile) */}
          <div className={`w-full ${mobileTab === "edit" ? "block" : "hidden lg:block"}`}>
            <AutoResizeTextarea
              value={narrative}
              onChange={onNarrativeChange}
              placeholder="Tell the story of this artifact. Why does it matter? What is the deeper narrative here?..."
              className="font-elegant-sans text-lg text-foreground/80 font-light leading-relaxed placeholder:text-muted-foreground/20 min-h-[250px]"
            />
          </div>

          {/* Right Column: Markdown Preview (Visible on desktop and active preview tab on mobile) */}
          <div className={`w-full ${mobileTab === "preview" ? "block" : "hidden lg:block"} border-t lg:border-t-0 lg:border-l border-primary/10 pt-6 lg:pt-0 lg:pl-10`}>
            {narrative ? (
              <div className="prose prose-invert max-w-none text-reading-soft font-elegant-sans font-light text-base md:text-lg leading-relaxed select-text">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="text-reading-soft text-base md:text-lg leading-relaxed opacity-80 mb-6 last:mb-0">
                        {children}
                      </p>
                    ),
                    h1: ({ children }) => (
                      <h1 className="font-epic-serif text-3xl md:text-4xl text-glow-gold mb-6 mt-8 first:mt-0 leading-tight">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="font-epic-serif text-2xl md:text-3xl text-glow-gold mb-4 mt-8 first:mt-0 leading-tight border-b border-primary/10 pb-2">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="font-epic-serif text-xl md:text-2xl text-primary mb-4 mt-6 first:mt-0 leading-tight">
                        {children}
                      </h3>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-primary/30 pl-4 italic text-foreground/75 my-6 leading-relaxed bg-primary/5 py-2 pr-4 rounded-r">
                        {children}
                      </blockquote>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 space-y-2 my-6 text-foreground/80 font-light">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-5 space-y-2 my-6 text-foreground/80 font-light">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-primary">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-foreground/90">{children}</em>
                    ),
                    code: ({ children }) => (
                      <code className="font-mono bg-primary/5 border border-primary/10 rounded px-1.5 py-0.5 text-sm text-primary">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-primary/5 border border-primary/10 rounded p-4 my-6 font-mono text-sm overflow-x-auto text-primary">
                        {children}
                      </pre>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-colors">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {narrative}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-ink-faint italic font-elegant-sans text-base opacity-40">
                Awaiting narrative draft...
              </p>
            )}
          </div>
        </div>
      </section>
    </article>
  );
}
