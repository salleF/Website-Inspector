const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const files = fs.readdirSync(root).filter(file => /\.(html|js)$/.test(file));

test('Todos os scripts são sintaticamente válidos e os recursos locais existem', () => {
  for (const file of files) {
    const content = fs.readFileSync(path.join(root, file), 'utf8');
    if (file.endsWith('.js')) new vm.Script(content, { filename: file });
    else {
      for (const match of content.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) new vm.Script(match[1], { filename: file });
      for (const match of content.matchAll(/\b(?:src|href)=["']([^"'#]+)["']/gi)) {
        const url = match[1];
        if (/^(?:https?:|data:|mailto:|javascript:)/.test(url)) continue;
        assert.ok(fs.existsSync(path.join(root, decodeURIComponent(url.split(/[?#]/)[0]))), `${file}: recurso ausente ${url}`);
      }
    }
  }
});

test('Modelo do Chat mantém os cinco turnos e todos os contatos com opções únicas', () => {
  const source = fs.readFileSync(path.join(root, 'chat-patrol-data.js'), 'utf8');
  const context = vm.createContext({});
  vm.runInContext(source + '\nglobalThis.shifts = CHAT_PATROL_SHIFTS;', context);
  assert.equal(context.shifts.length, 5);
  assert.equal(context.shifts.flatMap(shift => shift.contacts).length, 11);
  const ids = new Set();
  for (const shift of context.shifts) {
    assert.ok(shift.briefing.description.length > 20);
    for (const contact of shift.contacts) {
      assert.ok(!ids.has(contact.id), `Contato duplicado ${contact.id}`);
      ids.add(contact.id);
      assert.ok(contact.dialogueTree.length >= 2);
      for (const step of contact.dialogueTree) {
        assert.ok(step.botMsg.length > 15);
        assert.equal(step.choices.length, 3);
        assert.equal(new Set(step.choices.map(choice => choice.id)).size, 3);
        for (const choice of step.choices) assert.ok(choice.text.length > 5);
      }
      for (const clue of contact.contradictions || []) {
        assert.equal(clue.targets.length, 2);
        assert.notEqual(clue.targets[0], clue.targets[1]);
        assert.ok(clue.explanation.length > 15);
      }
    }
  }
});
