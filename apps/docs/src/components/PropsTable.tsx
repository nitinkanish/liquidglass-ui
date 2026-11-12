import { ComponentProp } from '../data/components';

interface PropsTableProps {
  props: ComponentProp[];
}

export function PropsTable({ props }: PropsTableProps) {
  if (props.length === 0) {
    return (
      <p className="text-[var(--docs-text-muted)] text-sm">
        This component doesn&apos;t have any custom props.
      </p>
    );
  }

  return (
    <>
      {/* Mobile: stacked cards — no horizontal scroll */}
      <div className="md:hidden space-y-3">
        {props.map((prop) => (
          <div
            key={prop.name}
            className="rounded-xl border border-[var(--docs-border)] bg-[var(--docs-bg-secondary)] p-4 space-y-2"
          >
            <div className="flex flex-wrap items-center gap-2">
              <code className="text-[var(--docs-accent)] font-mono text-sm bg-[var(--docs-bg-elevated)] px-1.5 py-0.5 rounded">
                {prop.name}
                {prop.required && <span className="text-red-500">*</span>}
              </code>
              {prop.default && (
                <span className="text-xs text-[var(--docs-text-muted)]">
                  default:{' '}
                  <code className="font-mono">{prop.default}</code>
                </span>
              )}
            </div>
            <code className="block font-mono text-xs text-[var(--docs-text-muted)] break-words whitespace-pre-wrap">
              {prop.type}
            </code>
            <p className="text-sm text-[var(--docs-text-muted)] m-0">{prop.description}</p>
          </div>
        ))}
      </div>

      {/* Desktop: scrollable table */}
      <div className="hidden md:block overflow-x-auto max-w-full">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-[var(--docs-border)]">
              <th className="text-left py-3 px-4 font-semibold text-[var(--docs-text)]">Prop</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--docs-text)]">Type</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--docs-text)]">Default</th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--docs-text)]">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr key={prop.name} className="border-b border-[var(--docs-border)]">
                <td className="py-3 px-4 align-top">
                  <code className="text-[var(--docs-accent)] font-mono text-xs bg-[var(--docs-bg-elevated)] px-1.5 py-0.5 rounded">
                    {prop.name}
                    {prop.required && <span className="text-red-500">*</span>}
                  </code>
                </td>
                <td className="py-3 px-4 align-top">
                  <code className="font-mono text-xs text-[var(--docs-text-muted)] break-all">
                    {prop.type}
                  </code>
                </td>
                <td className="py-3 px-4 align-top text-[var(--docs-text-muted)]">
                  {prop.default ? (
                    <code className="font-mono text-xs">{prop.default}</code>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="py-3 px-4 align-top text-[var(--docs-text-muted)]">
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
