// Restores table semantics that the small-screen card layout (prose.css) removes.
export function initializeProseTables() {
  document.querySelectorAll<HTMLTableElement>('.prose table').forEach((table) => {
    table.setAttribute('role', 'table');
    table.querySelectorAll('thead, tbody, tfoot').forEach((group) => group.setAttribute('role', 'rowgroup'));
    table.querySelectorAll('tr').forEach((row) => row.setAttribute('role', 'row'));
    table.querySelectorAll('th').forEach((cell) => cell.setAttribute('role', cell.closest('thead') ? 'columnheader' : 'rowheader'));
    table.querySelectorAll('td').forEach((cell) => cell.setAttribute('role', 'cell'));
  });
}
