import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFileSync} from 'node:fs';
async function loadTS(file){const text=ts.transpileModule(readFileSync(new URL(file,import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(text).toString('base64'));}
const {lessons,questions,practices,checkItems}=await loadTS('../src/content.ts');
const {readProgress}=await loadTS('../src/progress.ts');
test('Alle Lerninhalte haben eindeutige IDs und gültige Entscheidungen',()=>{
 assert.equal(lessons.length,5);assert.equal(questions.length,10);assert.equal(practices.length,5);assert.equal(checkItems.length,5);
 assert.equal(new Set(lessons.map(l=>l.id)).size,lessons.length);
 for(const l of lessons)for(const key of ['text','example','practice','source'])assert.ok(l[key].length>20);
 for(const q of [...questions,...lessons.map(l=>l.question)]){assert.ok(q.correct>=0&&q.correct<q.options.length);assert.equal(new Set(q.options).size,q.options.length);assert.ok(q.explanation.length>20)}
});
test('Speicher lädt sicher bei ungültigen Daten oder blockiertem Browser',()=>{
 for(const value of ['{','null','{}','{"completed":42}','{"completed":[],"practices":[],"best":99}']){globalThis.localStorage={getItem:()=>value};assert.deepEqual(readProgress(),{completed:[],practices:[],best:null})}
 globalThis.localStorage={getItem:()=>{throw new Error('blocked')}};assert.deepEqual(readProgress(),{completed:[],practices:[],best:null});
 globalThis.localStorage={getItem:()=>JSON.stringify({completed:['auswahl'],practices:[0],best:8})};assert.deepEqual(readProgress(),{completed:['auswahl'],practices:[0],best:8});
});
const {getCheckState}=await loadTS('../src/check.ts');
test('Probleme und Unsicherheit stoppen den Check bei jeder Frage',()=>{
 for(let index=0;index<5;index++)for(const answer of [1,2])assert.equal(getCheckState([...Array(index).fill(0),answer],5),'stop');
 assert.equal(getCheckState([],5),'questions');
 assert.equal(getCheckState([0,0],5),'questions');
 assert.equal(getCheckState([0,0,0,0,0],5),'reviewed');
 assert.equal(getCheckState([0,0,1,0,0],5),'stop');
});
