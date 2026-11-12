import { ComponentProp } from '../data/components';

interface PropsTableProps {
  props: ComponentProp[];
}

export function PropsTable({ props }: PropsTableProps) {
  if (props.length === 0) {
    return (
      <p className="text-[var(--docs-text-muted)] text-sm">
        This component doesn't have any custom props.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--docs-border)]">
            <th className="text-left py-3 px-4 font-semibold text-[var(--docs-text)]">Prop</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--docs-text)]">Type</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--docs-text)]">Default</th>
            <th className="text-left py-3 px-4 font-semibold text-[var(--docs-text)]">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-b border-[var(--docs-border)]">
              <td className="py-3 px-4">
                <code className="text-[var(--docs-accent)] font-mono text-xs bg-[var(--docs-bg-elevated)] px-1.5 py-0.5 rounded">
                  {prop.name}
                  {prop.required && <span className="text-red-500">*</span>}
                </code>
              </td>
              <td className="py-3 px-4">
                <code className="font-mono text-xs text-[var(--docs-text-muted)]">
                  {prop.type}
                </code>
              </td>
              <td className="py-3 px-4 text-[var(--docs-text-muted)]">
                {prop.default ? (
                  <code className="font-mono text-xs">{prop.default}</code>
                ) : (
                  '—'
                )}
              </td>
              <td className="py-3 px-4 text-[var(--docs-text-muted)]">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
