// parse-changelog and clq can’t handle headings that are links.
// conventional-changelog insists on linking the versions to the
// comparison URLs if available:
// <https://github.com/conventional-changelog/conventional-changelog-config-spec/issues/56/>.
// Since the format is predictable, this file is a narrowly-scoped
// hack to extract the changes for the latest version.

// TODO switch to parse-changelog or clq if the situation ever changes

import fs from "fs";
import readline from "readline";

const [filename] = process.argv.slice(2);

const MARKER = "## ";

async function extractChangelog(filename) {
  const stream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let started = false;
  const lines = [];

  for await (const l of rl) {
    if (l.startsWith(MARKER)) {
      started = true;
      continue;
    }

    if (l.startsWith(MARKER)) {
      break;
    }

    if (started) {
      lines.push(l);
    }
  }

  process.stdout.write(lines.join("\n"));
}

await extractChangelog(filename);
