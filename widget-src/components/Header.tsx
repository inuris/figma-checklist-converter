const { widget } = figma;
const { AutoLayout, Text, SVG } = widget;

import { COLOR_SUCCESS } from '../constants/colors';
import { ICON_MOON, ICON_SUN, ICON_UNDO } from '../constants/icons';
import { getTheme } from '../utils/theme';

interface HeaderProps {
  taskCount: number;
  completedCount: number;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

export function Header({ taskCount, completedCount, isDark, setIsDark, onUndo, canUndo = false }: HeaderProps) {
  const t = getTheme(isDark);
  const allDone = taskCount > 0 && completedCount === taskCount;

  return (
    <AutoLayout
      name="CardHeader"
      width="fill-parent"
      verticalAlignItems="center"
      padding={{ vertical: 20, horizontal: 24 }}
      fill={t.bg}
      stroke={{ type: 'solid', color: t.border }}
      spacing={12}
    >
      {/* Title + subtitle */}
      <AutoLayout direction="vertical" spacing={4} width="fill-parent" name="Title">
        <Text
          fontSize={20}
          fontWeight="bold"
          fill={t.primary}
          letterSpacing={-0.5}
          fontFamily="Inter"
        >
          Checklist
        </Text>
        <Text
          fontSize={12}
          fill={allDone ? COLOR_SUCCESS : t.muted}
          fontFamily="Inter"
          fontWeight={allDone ? "bold" : "normal"}
        >
          {taskCount === 0
            ? "No tasks yet"
            : allDone
              ? `All ${taskCount} tasks completed ✓`
              : `${completedCount} / ${taskCount} tasks completed`}
        </Text>
      </AutoLayout>

      {/* Undo + Theme toggle — top right */}
      <AutoLayout name="HeaderRight" spacing={8} verticalAlignItems="center">
        {onUndo && (
          <AutoLayout
            name="UndoHeaderButton"
            padding={6}
            cornerRadius={999}
            fill={t.transparent}
            hoverStyle={{ fill: t.bgHover }}
            opacity={canUndo ? 1 : 0.4}
            horizontalAlignItems="center"
            verticalAlignItems="center"
            onClick={canUndo ? onUndo : undefined}
          >
            <SVG src={ICON_UNDO} />
          </AutoLayout>
        )}
        <AutoLayout padding={8} name="ThemeToggle">
          <SVG
            src={isDark ? ICON_SUN : ICON_MOON}
            onClick={() => setIsDark(!isDark)}
          />
        </AutoLayout>
      </AutoLayout>

    </AutoLayout>
  );
}
