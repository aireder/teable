/**
 * Accessibility utilities and ARIA helpers
 */

export function getGridAriaProps(rowCount: number, columnCount: number) {
  return {
    role: 'grid',
    'aria-rowcount': rowCount,
    'aria-colcount': columnCount,
  };
}

export function getRowAriaProps(rowIndex: number, isSelected: boolean = false) {
  return {
    role: 'row',
    'aria-rowindex': rowIndex + 1,
    'aria-selected': isSelected,
  };
}

export function getCellAriaProps(
  rowIndex: number,
  colIndex: number,
  isReadOnly: boolean = false
) {
  return {
    role: isReadOnly ? 'gridcell' : 'gridcell',
    'aria-colindex': colIndex + 1,
    'aria-readonly': isReadOnly,
  };
}

export function getColumnHeaderAriaProps(colIndex: number, sortDirection?: 'asc' | 'desc') {
  return {
    role: 'columnheader',
    'aria-colindex': colIndex + 1,
    'aria-sort': sortDirection || 'none',
  };
}

export function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}