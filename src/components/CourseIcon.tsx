import {
  Activity,
  Brain,
  Gauge,
  Globe,
  LineChart,
  Scale,
  Shield,
  Sprout,
  Target,
  type LucideIcon,
} from "lucide-react";
import type { CourseIcon as CourseIconKey } from "@/content/types";

const ICONS: Record<CourseIconKey, LucideIcon> = {
  sprout: Sprout,
  scale: Scale,
  chart: LineChart,
  brain: Brain,
  target: Target,
  shield: Shield,
  activity: Activity,
  gauge: Gauge,
  globe: Globe,
};

export default function CourseIcon({
  icon,
  className = "h-6 w-6",
}: {
  icon: CourseIconKey;
  className?: string;
}) {
  const Icon = ICONS[icon];
  return <Icon className={className} />;
}
