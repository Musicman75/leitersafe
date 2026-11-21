import test from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";
import { readFileSync } from "node:fs";
async function loadTS(file) {
  const text = ts.transpileModule(
    readFileSync(new URL(file, import.meta.url), "utf8"),
    {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ES2022,
      },
    },
  ).outputText;
  return import(
    "data:text/javascript;base64," + Buffer.from(text).toString("base64")
  );
}
const { lessons, questions, practices, checkItems } =
  await loadTS("../src/content.ts");
const { readProgress } = await loadTS("../src/progress.ts");
test("Alle Lerninhalte haben eindeutige IDs und gültige Entscheidungen", () => {
  assert.equal(lessons.length, 5);
  assert.equal(questions.length, 10);
  assert.equal(practices.length, 5);
  assert.equal(checkItems.length, 5);
  assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length);
  for (const l of lessons)
    for (const key of ["text", "example", "practice", "source"])
      assert.ok(l[key].length > 20);
  for (const q of [...questions, ...lessons.map((l) => l.question)]) {
    assert.ok(q.correct >= 0 && q.correct < q.options.length);
    assert.equal(new Set(q.options).size, q.options.length);
    assert.ok(q.explanation.length > 20);
  }
});
test("Speicher lädt sicher bei ungültigen Daten oder blockiertem Browser", () => {
  for (const value of [
    "{",
    "null",
    "{}",
    '{"completed":42}',
    '{"completed":[],"practices":[],"best":99}',
  ]) {
    globalThis.localStorage = { getItem: () => value };
    assert.deepEqual(readProgress(), {
      completed: [],
      practices: [],
      best: null,
    });
  }
  globalThis.localStorage = {
    getItem: () => {
      throw new Error("blocked");
    },
  };
  assert.deepEqual(readProgress(), {
    completed: [],
    practices: [],
    best: null,
  });
  globalThis.localStorage = {
    getItem: () =>
      JSON.stringify({ completed: ["auswahl"], practices: [0], best: 8 }),
  };
  assert.deepEqual(readProgress(), {
    completed: ["auswahl"],
    practices: [0],
    best: 8,
  });
});
const { ladderTypes } = await loadTS("../src/inspection.ts");
test("Jede Leiterbauart hat eigene erreichbare Prüfstellen und vollständige Hinweise", () => {
  assert.deepEqual(ladderTypes.map(t => t.id), ["anlege", "steh", "schiebe", "gelenk"]);
  for (const type of ladderTypes) {
    assert.equal(new Set(type.points.map(p => p.id)).size, type.points.length);
    for (const p of type.points) {
      assert.ok(p.title && p.checks.length >= 2);
      assert.ok(p.x > 35 && p.x < 325 && p.y > 35 && p.y < 445);
      for (const other of type.points.filter(q => q !== p)) {
        // At the narrowest supported phone size, 44px touch targets must not overlap.
        assert.ok(Math.hypot(p.x - other.x, p.y - other.y) * 246 / 360 >= 44);
      }
    }
  }
});
test("Praxisfragen haben vollständige Rückmeldungen und ausgewogene Antwortpositionen", () => {
  const positions = [0, 0, 0];
  for (const q of questions) {
    assert.equal(q.options.length, 3);
    assert.equal(q.feedback.length, q.options.length);
    assert.ok(q.situation.length > 5);
    assert.ok(q.source.length > 10);
    q.feedback.forEach((f) => assert.ok(f.length > 20));
    positions[q.correct]++;
  }
  assert.ok(positions.every((n) => n >= 3 && n <= 4));
});
