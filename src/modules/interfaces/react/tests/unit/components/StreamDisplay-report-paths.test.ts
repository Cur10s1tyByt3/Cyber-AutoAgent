import { describe, it, expect } from '@jest/globals';
import path from 'path';
import { getReportPathCandidates } from '../../../src/components/StreamDisplay.js';

describe('StreamDisplay report path resolution', () => {
  const projectRoot = '/opt/project-root';

  it('prioritizes explicit reportPath relative to project root', () => {
    const ctx = { operationId: 'OP_TEST', target: 'https://imf.bz/' };
    const relativeReportPath = './outputs/imf.bz/OP_TEST/security_assessment_report.md';

    const candidates = getReportPathCandidates(ctx, relativeReportPath, projectRoot);

    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates[0]).toBe(path.resolve(projectRoot, relativeReportPath));
    expect(candidates).toContain(path.resolve(process.cwd(), relativeReportPath));
  });

  it('includes sanitized target path when explicit reportPath missing', () => {
    const ctx = { operationId: 'OP_OTHER', target: 'https://example.com/app' };
    const candidates = getReportPathCandidates(ctx, null, projectRoot);
    const expectedPath = path.resolve(
      projectRoot,
      'outputs',
      'example.com_app',
      'OP_OTHER',
      'security_assessment_report.md'
    );

    expect(candidates).toContain(expectedPath);
  });
});
