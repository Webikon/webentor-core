import { throttle } from '@webentorCore/_utils';

// Determine if the table is scrollable
const isTableScrollable = (table: HTMLElement) => {
  const tableWidth = table.offsetWidth;
  const tableScrollWidth = table.scrollWidth;
  return tableScrollWidth > tableWidth;
};

// Add scroll shadow to the table
const addScrollShadow = (table: HTMLElement) => {
  table.closest('.table-scroll-shadow')?.classList.add('has-scroll');
};

const removeScrollShadow = (table: HTMLElement) => {
  table.closest('.table-scroll-shadow')?.classList.remove('has-scroll');
};

document.addEventListener('DOMContentLoaded', () => {
  const tables = document.querySelectorAll(
    '.wp-block-table',
  ) as NodeListOf<HTMLElement>;

  tables.forEach((table) => {
    if (isTableScrollable(table)) {
      addScrollShadow(table);
    } else {
      removeScrollShadow(table);
    }
  });
});

window.addEventListener(
  'resize',
  throttle(() => {
    const tables = document.querySelectorAll(
      '.wp-block-table',
    ) as NodeListOf<HTMLElement>;

    tables.forEach((table) => {
      if (isTableScrollable(table)) {
        addScrollShadow(table);
      } else {
        removeScrollShadow(table);
      }
    });
  }, 100),
);
