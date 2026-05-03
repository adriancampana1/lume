import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Report } from '@lume/ai';
import { ReportLayout } from './components/ReportLayout.js';

export function renderReportToHtml(report: Report): string {
  const body = renderToStaticMarkup(createElement(ReportLayout, { report }));
  return `<!DOCTYPE html>${body}`;
}
