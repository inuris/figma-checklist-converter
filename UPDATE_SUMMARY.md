Checklist Widget Update Summary:
1. Updated `widget-src/components/TaskRow.tsx`:
   - Enchanced `onTextEditEnd` for the Task Input.
   - Added detection for double newlines (`\n\n`) within the input text.
   - Implemented logic to split the text at double newlines into multiple tasks.
   - Cleaned up empty segments created by splitting.
   - Assigned unique IDs to new tasks (`Date.now() + index + partIndex`).
   - Preserved `isChild` (indentation) property for split tasks.

2. Updated `widget-src/ui/import.html`:
   - Fixed paste handler logic.
   - Now inserts pasted text at cursor position instead of overwriting the entire input.
   - Preserves existing text before and after the selection/cursor.

3. Updated `widget-src/code.tsx` (Icon Updates):
   - Changed the "Merge Up" icon to a custom "2 arrows facing inward" style.
   - Removed the center shafts of arrows for a cleaner look.
