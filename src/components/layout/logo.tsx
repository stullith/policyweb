import { Gauge } from 'lucide-react';
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center text-primary group-data-[sidebar-collapsible=icon]:justify-center">
      <Gauge className="h-7 w-7 shrink-0 group-data-[sidebar-collapsible=icon]:h-8 group-data-[sidebar-collapsible=icon]:w-8" />
      <span className="ml-2 text-xl font-semibold group-data-[sidebar-collapsible=icon]:hidden">
        Policy Insights
      </span>
    </div>
  );
}
