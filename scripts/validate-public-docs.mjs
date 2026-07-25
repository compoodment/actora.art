#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { lstatSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { TextDecoder } from 'node:util';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const fixedPublicFiles = new Set([
  '.gitignore',
  '.github/workflows/public-docs.yml',
  'CHANGELOG.md',
  'README.md',
  'scripts/validate-public-docs.mjs',
]);
const failures = new Set();
const utf8Decoder = new TextDecoder('utf-8', { fatal: true });

function fail(file, line, message) {
  failures.add(`${file}${line ? `:${line}` : ''}: ${message}`);
}

function listRepositoryFiles() {
  let output;

  try {
    output = execFileSync(
      'git',
      [
        '-C',
        repositoryRoot,
        'ls-files',
        '-z',
        '--cached',
        '--others',
        '--exclude-standard',
      ],
      { encoding: 'buffer' },
    );
  } catch (error) {
    console.error(`Unable to list repository files: ${error.message}`);
    process.exit(1);
  }

  return output
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
    .map((file) => file.replaceAll('\\', '/'))
    .sort();
}

function isAllowedPublicFile(file) {
  if (fixedPublicFiles.has(file)) {
    return true;
  }

  if (!file.startsWith('docs/') || !file.endsWith('.md')) {
    return false;
  }

  return file
    .slice('docs/'.length)
    .split('/')
    .every((segment) => segment && !segment.startsWith('.'));
}

function readTextFile(file) {
  const absolutePath = path.join(repositoryRoot, ...file.split('/'));
  const stats = lstatSync(absolutePath);

  if (stats.isSymbolicLink()) {
    fail(file, 0, 'symbolic links are not allowed in the public docs surface');
    return null;
  }

  if (!stats.isFile()) {
    fail(file, 0, 'only regular text files are allowed');
    return null;
  }

  try {
    return utf8Decoder.decode(readFileSync(absolutePath));
  } catch {
    fail(file, 0, 'file is not valid UTF-8 text');
    return null;
  }
}

const homeDirectoryPattern = new RegExp(
  `(?:^|[\\s"'\\x60(=])/(?:${['Users', 'home'].join('|')})/`,
);
const fileUrlPrefix = ['file:', '//'].join('');
const localPathPatterns = [
  /(?:^|[\s"'`(=])[A-Za-z]:[\\/]/,
  /(?:^|[\s"'`(=])\\\\[A-Za-z0-9._-]+[\\/]/,
  homeDirectoryPattern,
  /(?:^|[\s"'`(=])\/mnt\/[a-z]\//i,
  /(?:^|[\s"'`(=])~[\\/]/,
];
const credentialAssignment =
  /\b(?:api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|password|passwd|private[_-]?key|secret|github[_-]?token|aws[_-]?access[_-]?key[_-]?id)\b\s*[:=]\s*(?:"([^"]*)"|'([^']*)'|([^\s#;,]+))/i;
const obviousTokenPatterns = [
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
];
const privateKeyHeader = ['-----BEGIN ', 'PRIVATE KEY-----'].join('');
const safeCredentialValues = new Set([
  '',
  'changeme',
  'example',
  'example-value',
  'none',
  'null',
  'placeholder',
  'redacted',
  'undefined',
  'your-value-here',
]);

function isSafeCredentialPlaceholder(value) {
  const normalized = value.trim().toLowerCase();

  return (
    safeCredentialValues.has(normalized) ||
    normalized.startsWith('$') ||
    normalized.startsWith('<') ||
    normalized.startsWith('example-') ||
    normalized.startsWith('process.env.') ||
    normalized.startsWith('your-')
  );
}

function scanForSensitiveText(file, contents) {
  for (const [index, line] of contents.split(/\r?\n/).entries()) {
    if (
      localPathPatterns.some((pattern) => pattern.test(line)) ||
      line.toLowerCase().includes(fileUrlPrefix)
    ) {
      fail(file, index + 1, 'local absolute path is not allowed');
    }

    const assignment = credentialAssignment.exec(line);
    const assignedValue =
      assignment?.[1] ?? assignment?.[2] ?? assignment?.[3] ?? '';
    if (assignment && !isSafeCredentialPlaceholder(assignedValue)) {
      fail(file, index + 1, 'possible credential assignment is not allowed');
    }

    if (
      line.includes(privateKeyHeader) ||
      obviousTokenPatterns.some((pattern) => pattern.test(line))
    ) {
      fail(file, index + 1, 'possible embedded credential is not allowed');
    }
  }
}

function markdownLines(contents) {
  const visibleLines = [];
  let fenceCharacter = null;
  let fenceLength = 0;

  for (const [index, line] of contents.split(/\r?\n/).entries()) {
    const fence = line.match(/^\s{0,3}(`{3,}|~{3,})/);

    if (fence) {
      const marker = fence[1];
      if (!fenceCharacter) {
        fenceCharacter = marker[0];
        fenceLength = marker.length;
      } else if (
        marker[0] === fenceCharacter &&
        marker.length >= fenceLength
      ) {
        fenceCharacter = null;
        fenceLength = 0;
      }
      continue;
    }

    if (!fenceCharacter) {
      visibleLines.push({
        line: index + 1,
        text: line.replace(/`[^`]*`/g, ''),
      });
    }
  }

  return visibleLines;
}

function extractMarkdownTargets(contents) {
  const targets = [];
  const inlineLink =
    /!?\[[^\]]*]\(\s*(<[^>]+>|[^)\s]+)(?:\s+[^)]*)?\)/g;
  const referenceDefinition =
    /^\s{0,3}\[[^\]]+]:\s*(<[^>]+>|[^\s]+)(?:\s+.*)?$/;

  for (const entry of markdownLines(contents)) {
    for (const match of entry.text.matchAll(inlineLink)) {
      targets.push({ line: entry.line, target: match[1] });
    }

    const definition = referenceDefinition.exec(entry.text);
    if (definition) {
      targets.push({ line: entry.line, target: definition[1] });
    }
  }

  return targets;
}

function validateRelativeTarget(sourceFile, line, rawTarget, repositoryFiles) {
  let target = rawTarget;
  if (target.startsWith('<') && target.endsWith('>')) {
    target = target.slice(1, -1);
  }

  if (
    !target ||
    target.startsWith('#') ||
    target.startsWith('/') ||
    /^[a-z][a-z0-9+.-]*:/i.test(target)
  ) {
    return;
  }

  if (target.includes('\\')) {
    fail(sourceFile, line, `relative link must use forward slashes: ${target}`);
    return;
  }

  const pathEnd = [target.indexOf('?'), target.indexOf('#')]
    .filter((index) => index >= 0)
    .reduce((lowest, index) => Math.min(lowest, index), target.length);
  const encodedPath = target.slice(0, pathEnd);
  if (!encodedPath) {
    return;
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(encodedPath);
  } catch {
    fail(sourceFile, line, `relative link has invalid URL encoding: ${target}`);
    return;
  }

  const resolved = path.posix.normalize(
    path.posix.join(path.posix.dirname(sourceFile), decodedPath),
  );
  if (resolved === '..' || resolved.startsWith('../')) {
    fail(sourceFile, line, `relative link escapes the repository: ${target}`);
    return;
  }

  if (!repositoryFiles.has(resolved)) {
    fail(sourceFile, line, `relative link target does not exist: ${target}`);
  }
}

const files = listRepositoryFiles();
const fileSet = new Set(files);
const contentsByFile = new Map();

for (const file of files) {
  if (!isAllowedPublicFile(file)) {
    fail(file, 0, 'file is outside the allowed public docs surface');
    continue;
  }

  const contents = readTextFile(file);
  if (contents !== null) {
    contentsByFile.set(file, contents);
    scanForSensitiveText(file, contents);
  }
}

for (const [file, contents] of contentsByFile) {
  if (!file.endsWith('.md')) {
    continue;
  }

  for (const { line, target } of extractMarkdownTargets(contents)) {
    validateRelativeTarget(file, line, target, fileSet);
  }
}

if (failures.size > 0) {
  console.error('Public docs validation failed:\n');
  for (const failure of [...failures].sort()) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

const markdownCount = files.filter((file) => file.endsWith('.md')).length;
console.log(
  `Public docs validation passed: ${files.length} allowed files, ${markdownCount} Markdown files.`,
);
