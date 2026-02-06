import { COLORS } from "../styles/theme";

const SECTIONS = [
  { id: "home", label: "Home", icon: "⚛" },
  { id: "kinematics", label: "Kinematics", icon: "🚀", color: COLORS.velocity },
  { id: "vectors", label: "Vectors", icon: "↗", color: COLORS.position },
  { id: "forces", label: "Forces", icon: "⚡", color: COLORS.force },
  {
    id: "work-energy",
    label: "Work & Energy",
    icon: "⚡",
    color: COLORS.energy,
    wip: true,
  },
  {
    id: "momentum",
    label: "Momentum",
    icon: "💥",
    color: COLORS.momentum,
    wip: true,
  },
  {
    id: "rotation",
    label: "Rotation",
    icon: "🔄",
    color: COLORS.rotation,
    wip: true,
  },
  {
    id: "formulas",
    label: "Formulas",
    icon: "📋",
    color: COLORS.textSecondary,
    wip: true,
  },
];

export default SECTIONS;
