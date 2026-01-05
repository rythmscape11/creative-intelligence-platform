import Link from 'next/link';
import { Tool } from '@/types/tools';
import {
  Sparkles,
  Search,
  Share2,
  Mail,
  TrendingUp,
  FileText,
  BarChart,
  Hash,
  AtSign,
  DollarSign
} from 'lucide-react';



const iconMap: Record<string, any> = {
  sparkles: Sparkles,
  search: Search,
  share: Share2,
  mail: Mail,
  trending: TrendingUp,
  file: FileText,
  chart: BarChart,
  hash: Hash,
  at: AtSign,
  dollar: DollarSign
};

export function ToolCard({ tool }: { tool: Tool }) {
  const IconComponent = iconMap[tool.icon] || Sparkles;

  return (
    <Link
      href={tool.href}
      className="block p-6 bg-white dark:bg-[#0A0A0A] rounded-lg border-2 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors">
          <IconComponent className="w-6 h-6 text-zinc-900 dark:text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-black dark:group-hover:text-white">
            {tool.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {tool.description}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded capitalize font-semibold border border-zinc-200 dark:border-zinc-800">
              {tool.category}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ${tool.value}/mo value
            </span>
            {tool.isPro && (
              <span className="text-xs px-2 py-1 bg-zinc-900 dark:bg-white text-white dark:text-black rounded font-medium">
                Pro
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

