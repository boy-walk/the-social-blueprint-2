import React, { useMemo, useState } from "react";
import { Breadcrumbs } from "./Breadcrumbs";
import { NewsletterBanner } from "./NewsletterBanner";
import PillTag from "./PillTag";
import { ExploreByTheme } from "./ExploreByTheme";

function TermBranch({ node, depth = 0 }) {
  return (
    <li className="leading-7">
      <a href={node.link} className="hover:underline">{node.name}</a>
      {node.children?.length > 0 && (
        <ul className="pl-4 mt-1 space-y-1">
          {node.children.map((c) => (
            <TermBranch key={c.id} node={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function TopicDirectoryPage({ props }) {
  const { title = "Explore Topics", breadcrumbs = [], groups = [] } = props || {};
  const [q, setQ] = useState("");
  console.log(groups)

  const searchResults = useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.trim().toLowerCase();
    const rows = [];
    groups.forEach((g) => {
      g.index.forEach((t) => {
        if (t.name.toLowerCase().includes(needle)) rows.push({ ...t, group: g.label });
      });
    });
    return rows.slice(0, 12);
  }, [q, groups]);

  return (
    <main className="bg-schemesSurface text-schemesOnSurface">
      <div className="bg-schemesPrimaryFixed">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="hidden md:block pt-6">
            <Breadcrumbs items={breadcrumbs} textColour="text-schemesPrimary" />
          </div>
          <div className="py-8 md:py-10">
            <h1 className="Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large text-schemesOnSurface mb-3">
              {title}
            </h1>
            <div className="relative max-w-xl">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search all topics"
                className="w-full rounded-xl bg-schemesSurface px-4 py-3 outline-none Blueprint-body-medium text-schemesOnSurface placeholder:text-schemesOnSurfaceVariant"
              />
              {q && searchResults.length > 0 && (
                <div className="absolute z-10 mt-2 w-full rounded-xl border border-schemesOutlineVariant bg-schemesSurface shadow-lg">
                  <ul className="py-2">
                    {searchResults.map((r) => (
                      <li key={`${r.id}-${r.link}`}>
                        <a
                          href={r.link}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-schemesSurfaceVariant/50"
                        >
                          <span className="Blueprint-label-small rounded-md px-2 py-1 bg-schemesSurfaceContainer">
                            {r.group}
                          </span>
                          <span className="Blueprint-body-medium">{r.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 py-8 md:py-12 lg:py-16">
        {groups.map((g) => (
          <section key={g.tax} className="mb-12">
            <h2 className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized mb-6">
              {g.label}
            </h2>
            {g.roots?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {g.roots.map((root) => (
                  <div key={root.id}>
                    <h3 className="Blueprint-title-small mb-2">
                      <a href={root.link} className="hover:underline">{root.name}</a>
                    </h3>
                    <ul className="space-y-1">
                      {root.children?.length
                        ? root.children.map((c) => (
                          <TermBranch key={c.id} node={c} />
                        ))
                        : <TermBranch node={root} />}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-schemesOnSurfaceVariant">No terms found.</p>
            )}
          </section>
        ))}
      </div>

      <div className="bg-schemesPrimaryFixed">
        <div className="max-w-[1600px] mx-auto py-10 px-4 sm:px-8 lg:px-16">
          <div className="flex gap-2 md:gap-4 items-center">
            <div className="Blueprint-title-small-emphasized md:Blueprint-title-medium-emphasized lg:Blueprint-title-large-emphasized italic">
              Stay connected to the Melbourne Jewish community
            </div>
            <PillTag label="Theme" backgroundColor="schemesPrimaryContainer" />
          </div>
          <div className="mt-6">
            <NewsletterBanner />
          </div>
        </div>
      </div>

      <div className="bg-schemesPrimaryFixed">
        <div className="max-w-[1600px] mx-auto py-16 px-4 sm:px-8 lg:px-16">
          <div className="Blueprint-title-small md:Blueprint-title-medium lg:Blueprint-title-large mb-10">
            Explore more by Theme
          </div>
          <ExploreByTheme />
        </div>
      </div>
    </main>
  );
}
