import {
  ArrowRightLeft,
  BellRing,
  Boxes,
  FileSearch,
  Radio,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataFlowDiagram } from "./data-flow-diagram";
import { LayoutDiagram } from "./layout-diagram";
import { useTranslation } from "@/i18n/use-translation";
import { useWorkspaceStore } from "@/store/use-workspace-store";

const PROBLEM_ICONS: LucideIcon[] = [
  ArrowRightLeft,
  ShieldAlert,
  FileSearch,
  Radio,
  Boxes,
  BellRing,
];

interface BlueprintProblem {
  problem: string;
  answer: string;
}

export function BlueprintView() {
  const { t, tList } = useTranslation();
  const setView = useWorkspaceStore((state) => state.setView);

  const problems = tList<BlueprintProblem>("blueprint.problems");

  return (
    <div className="scrollbar-slim h-full overflow-y-auto bg-canvas">
      <div className="mx-auto max-w-[1180px] space-y-5 px-4 py-6 sm:px-5 sm:py-7 md:space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge tone="accent" size="sm">
              {t("blueprint.badge")}
            </Badge>
            <h1 className="mt-2 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {t("blueprint.title")}
            </h1>
            <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-ink-muted sm:text-[13.5px]">
              {t("blueprint.intro")}
            </p>
          </div>
          <Button variant="primary" onClick={() => setView("inbox")}>
            {t("blueprint.openPrototype")}
          </Button>
        </header>

        <DiagramCard
          title={t("blueprint.layoutTitle")}
          subtitle={t("blueprint.layoutSubtitle")}
          badge={t("blueprint.layoutBadge")}
        >
          <LayoutDiagram />
        </DiagramCard>

        <DiagramCard
          title={t("blueprint.flowTitle")}
          subtitle={t("blueprint.flowSubtitle")}
          badge={t("blueprint.flowBadge")}
        >
          <DataFlowDiagram />
        </DiagramCard>

        <section>
          <h2 className="mb-3 text-[14px] font-semibold text-ink">
            {t("blueprint.problemsTitle")}
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {problems.map((entry, index) => {
              const Icon = PROBLEM_ICONS[index] ?? Boxes;
              return (
                <article
                  key={entry.problem}
                  className="rounded-panel border border-border-subtle bg-surface p-4 shadow-panel"
                >
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-accent-soft text-accent">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-ink">{entry.problem}</p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">
                        {entry.answer}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}

function DiagramCard({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-panel border border-border-subtle bg-surface shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h2 className="text-[14px] font-semibold text-ink">{title}</h2>
          <p className="text-[12px] text-ink-muted">{subtitle}</p>
        </div>
        <Badge size="sm">{badge}</Badge>
      </div>
      <div className="overflow-x-auto p-4 sm:p-5">
        <div className="min-w-[680px]">{children}</div>
      </div>
    </section>
  );
}
