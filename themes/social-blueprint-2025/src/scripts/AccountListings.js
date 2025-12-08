import React, { useMemo, useState } from "react";
import { Card } from "./Card";
import { Breadcrumbs } from "./Breadcrumbs";

const TABS = [
  { key: "all", label: "All" },
  { key: "event", label: "Events" },
  { key: "article", label: "Articles" },
  { key: "message", label: "Message board" },
  { key: "directory", label: "Directory" },
];

function typeLabel(item) {
  if (item.post_type === "gd_discount") return "Message board";
  if (item.post_type === "article") return "Article";
  if (item.post_type === "tribe_events") return "Event";
  if (item.post_type?.startsWith("gd_")) return "Directory";
  return "Listing";
}
function tabKey(item) {
  const t = typeLabel(item);
  if (t === "Event") return "event";
  if (t === "Article") return "article";
  if (t === "Message board") return "message";
  if (t === "Directory") return "directory";
  return "all";
}
function statusChip(status) {
  const map = {
    publish: { label: "Published", cls: "bg-[#DFF5E7] text-[#145A32]" },
    pending: { label: "Pending Review", cls: "bg-[#FFF4CC] text-[#7A5B00]" },
    draft: { label: "Draft", cls: "bg-slate-200 text-slate-700" },
    future: { label: "Scheduled", cls: "bg-[#E0ECFF] text-[#0B4DB6]" },
    private: { label: "Private", cls: "bg-slate-200 text-slate-700" },
    expired: { label: "Expired", cls: "bg-[#FFE0E0] text-[#8B1A1A]" },
  };
  return map[status] || { label: status, cls: "bg-slate-200 text-slate-700" };
}

/** Shared grid so header + every card line up perfectly from md+ */
const COLS = "md:grid-cols-[140px_1fr_160px_140px]";

function HeaderRow() {
  return (
    <div className={`hidden md:grid ${COLS} gap-3 px-4 py-2 Blueprint-label-medium`}>
      <div>Type</div>
      <div>Title</div>
      <div>Status</div>
      <div className="text-right">Actions</div>
    </div>
  );
}
function RowCard({ item }) {
  const t = typeLabel(item);
  const chip = statusChip(item.status);

  const node = document.getElementById("account-listings-root");
  // You already solved Events edit links; keep that logic.
  // Here we add GD front-end edit support:
  const gdBase = (node?.dataset?.gdAddBase || "/add-listing/").replace(/\/?$/, "/");

  // Build a GD edit URL if this is a GeoDirectory CPT
  const gdEditUrl = item.post_type?.startsWith("gd_")
    ? `${gdBase}?listing_type=${encodeURIComponent(item.post_type)}&action=edit&pid=${item.id}`
    : null;

  const eventEditUrl = item.post_type === "tribe_events" ? `/events-calendar/community/edit/${item.id}/` : null;

  const frontEditUrl = gdEditUrl ?? eventEditUrl;

  const secondary =
    item.start
      ? new Date(item.start).toLocaleString("en-AU", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      })
      : `Last updated ${new Intl.RelativeTimeFormat("en-AU", { numeric: "auto" }).format(
        Math.round(
          (new Date(item.modified) - new Date()) / (1000 * 60 * 60 * 24)
        ),
        "day"
      )}`;

  return (
    <Card styles="p-0">
      <div className="grid md:grid-cols-[140px_1fr_160px_140px] gap-3 items-center px-4 py-3">
        <div className="hidden md:block">
          <span className="Blueprint-label-medium px-2 py-1 rounded-md bg-schemesSurfaceContainer text-schemesOnSurfaceVariant">
            {t}
          </span>
        </div>

        <div className="min-w-0">
          <div className="md:hidden mb-1">
            <span className="Blueprint-label-medium px-2 py-1 rounded-md bg-schemesSurfaceContainer text-schemesOnSurfaceVariant">
              {t}
            </span>
          </div>
          <a href={item.permalink} className="Blueprint-title-small-emphasized hover:underline line-clamp-2">
            {item.title || "(no title)"}
          </a>
          <div className="Blueprint-label-medium text-schemesOnSurfaceVariant">{secondary}</div>
        </div>

        <div>
          <span className={`Blueprint-label-medium px-2 py-1 rounded ${chip.cls}`}>{chip.label}</span>
        </div>

        <div className="text-left md:text-right flex gap-2 justify-start md:justify-end">
          <a
            href={item.permalink}
            className="Blueprint-label-medium rounded-lg bg-schemesPrimary text-schemesOnPrimary px-3 py-1 inline-block"
          >
            View
          </a>

          {frontEditUrl && (
            <a
              href={frontEditUrl}
              className="Blueprint-label-medium rounded-lg bg-schemesSecondary text-schemesOnSecondary px-3 py-1 inline-block"
            >
              Edit
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

export function AccountListings() {
  const node = document.getElementById("account-listings-root");
  const items = useMemo(() => {
    if (!node) return [];
    try { return JSON.parse(node.dataset.items || "[]"); } catch { return []; }
  }, [node]);
  const breadcrumbs = useMemo(() => {
    if (!node) return [];
    try { return JSON.parse(node.dataset.breadcrumbs || "[]"); } catch { return []; }
  }, [node]);

  const [tab, setTab] = useState("all");
  const filtered = useMemo(
    () => (tab === "all" ? items : items.filter((i) => tabKey(i) === tab)),
    [items, tab]
  );

  return (
    <main className="bg-schemesSurface text-schemesOnSurface">
      <div className="bg-schemesPrimaryFixed">
        <div className="hidden md:block md:px-8 md:pt-8 lg:px-16 lg:pt-8">
          <Breadcrumbs items={breadcrumbs} textColour="text-schemesPrimary" />
        </div>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
          <h1 className="Blueprint-headline-small md:Blueprint-headline-medium lg:Blueprint-headline-large">
            My Active Listings
          </h1>
          <p className="Blueprint-body-medium text-schemesOnSurfaceVariant mt-1">
            Update or request changes to your listed events, articles and directory items.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16 py-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-full Blueprint-label-medium ${tab === t.key
                ? "bg-schemesPrimary text-schemesOnPrimary"
                : "bg-schemesSurfaceContainer text-schemesOnSurfaceVariant"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Plain header text, aligned with cards from md+ */}
        {filtered.length > 0 && <HeaderRow />}

        <div className="mt-2 flex flex-col gap-3">
          {filtered.map((item) => (
            <RowCard key={`${item.post_type}-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
