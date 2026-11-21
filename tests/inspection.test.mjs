import test from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";
import { readFileSync } from "node:fs";
const code = ts.transpileModule(
  readFileSync(new URL("../src/inspection.ts", import.meta.url), "utf8"),
  {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
    },
  },
).outputText;
const { getInspectionItems, inspectionReducer, isSupportedConfig, variants } =
  await import(
    "data:text/javascript;base64," + Buffer.from(code).toString("base64")
  );
const configurations = Object.entries(variants).flatMap(([kind, vs]) =>
  vs.flatMap((v) =>
    ["metal", "wood", "composite"].map((material) => ({
      kind,
      variant: v.id,
      material,
    })),
  ),
);
const configure = (config) =>
  inspectionReducer(
    { config: null, answers: [] },
    { type: "configure", config },
  );
test("Prüfliste berücksichtigt Ausführung: Plattform, Klappteile und Sicherungen fehlen nicht", () => {
  for (const c of configurations) {
    const items = getInspectionItems(c),
      ids = items.map((x) => x.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const id of [
      "rails",
      "treads",
      "feet",
      "connections",
      "material",
      "clean",
      "identification",
      "equipment",
      "task",
      "location",
    ])
      assert.ok(ids.includes(id), `${c.kind}: ${id}`);
    assert.equal(ids.includes("platform"), c.variant === "platform");
    assert.equal(
      ids.includes("spread"),
      c.kind === "standing" || c.variant === "folding",
    );
    assert.equal(
      ids.includes("hinges"),
      c.kind === "standing" || c.variant === "folding",
    );
    assert.equal(ids.includes("leaning"), c.kind === "leaning");
  }
});
test("Mangel und Unsicherheit stoppen jede unterstützte Ausführung an jedem Prüfpunkt", () => {
  for (const c of configurations)
    for (let index = 0; index < getInspectionItems(c).length; index++)
      for (const value of [1, 2]) {
        let s = configure(c);
        for (let j = 0; j < index; j++)
          s = inspectionReducer(s, { type: "answer", value: 0 });
        s = inspectionReducer(s, { type: "answer", value });
        assert.equal(s.answers.length, index + 1);
        assert.equal(s.answers.at(-1), value);
        assert.deepEqual(inspectionReducer(s, { type: "answer", value: 0 }), s);
      }
});
test("Neue Konfiguration und Neustart übernehmen keine früheren Antworten", () => {
  let s = configure(configurations[0]);
  s = inspectionReducer(s, { type: "answer", value: 0 });
  for (const config of [configurations[0], configurations.at(-1)])
    assert.deepEqual(inspectionReducer(s, { type: "configure", config }), {
      config,
      answers: [],
    });
  assert.deepEqual(inspectionReducer(s, { type: "reset" }), {
    config: null,
    answers: [],
  });
});
test("Ungültige und nicht unterstützte Typen werden nicht als Standardliste behandelt", () => {
  for (const config of [
    { kind: "telescopic", variant: "single", material: "metal" },
    { kind: "standing", variant: "single", material: "metal" },
    { kind: "leaning", variant: "single", material: "unknown" },
  ]) {
    assert.equal(isSupportedConfig(config), false);
    assert.throws(() => getInspectionItems(config));
    assert.deepEqual(configure(config), { config: null, answers: [] });
  }
  assert.deepEqual(
    inspectionReducer(
      { config: null, answers: [] },
      { type: "answer", value: 0 },
    ),
    { config: null, answers: [] },
  );
});
test("Kontrolle endet erst nach allen Punkten; Zurück verwirft die letzte Antwort", () => {
  for (const c of configurations) {
    let s = configure(c);
    const total = getInspectionItems(c).length;
    for (let i = 0; i < total; i++)
      s = inspectionReducer(s, { type: "answer", value: 0 });
    assert.equal(s.answers.length, total);
    assert.deepEqual(inspectionReducer(s, { type: "answer", value: 0 }), s);
    const previous = inspectionReducer(s, { type: "back" });
    assert.equal(previous.answers.length, total - 1);
    assert.deepEqual(
      inspectionReducer(previous, { type: "answer", value: 0 }),
      s,
    );
  }
});
