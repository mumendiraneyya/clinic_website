import { workflow, node, trigger, expr } from '@n8n/workflow-sdk';

// Reusable canonical logger: appends a batch of individual WhatsApp messages
// (both voices, with their wamids) to a phone's chat_history blob, trimmed to
// the last 40 messages. Every workflow that sends a WhatsApp message to a
// patient calls this AFTER a successful send so the outbound message (and its
// wamid) becomes part of the canonical, repliable conversation record.
//
// Inputs: phone (string), messages (JSON string of [{wamid, role, text, ts?}])
// Call synchronously (waitForSubWorkflow=true) so sequential callers within one
// execution don't self-race on the read-modify-write of the blob.

const HIST_TABLE = { __rl: true, mode: 'list', value: 'gsAdL9PoCUSCk2aG', cachedResultName: 'chat_history' };

const subflowTrigger = trigger({
  type: 'n8n-nodes-base.executeWorkflowTrigger',
  version: 1.1,
  config: {
    name: 'When Executed by Parent',
    parameters: {
      inputSource: 'workflowInputs',
      workflowInputs: { values: [ { name: 'phone', type: 'string' }, { name: 'messages', type: 'string' } ] },
    },
    position: [-600, 0],
  },
  output: [{ phone: '962790000000', messages: '[{"wamid":"wamid.X","role":"assistant","text":"مرحبًا"}]' }],
});

const loadHistory = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Load History',
    parameters: {
      operation: 'get',
      dataTableId: HIST_TABLE,
      matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'phone', condition: 'eq', keyValue: expr('{{ $json.phone }}') }] },
      returnAll: false,
      limit: 1,
    },
    alwaysOutputData: true,
    position: [-380, 0],
  },
  output: [{ phone: '962790000000', history: '[]' }],
});

const appendTrim = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Append & Trim',
    parameters: {
      mode: 'runOnceForAllItems',
      language: 'javaScript',
      jsCode: `const ctx = $('When Executed by Parent').first().json;
const phone = ctx.phone;
let incoming = [];
try { incoming = JSON.parse(ctx.messages || '[]'); } catch (e) { incoming = []; }
if (!Array.isArray(incoming)) incoming = [];
const histRow = $('Load History').first().json || {};
let history = [];
try { history = JSON.parse(histRow.history || '[]'); } catch (e) { history = []; }
if (!Array.isArray(history)) history = [];
const now = new Date().toISOString();
for (const m of incoming) {
  if (!m) continue;
  history.push({ wamid: String(m.wamid || ''), role: (m.role === 'assistant' ? 'assistant' : 'user'), text: String(m.text != null ? m.text : (m.content || '')), ts: m.ts || now });
}
const trimmed = history.slice(-40);
return [{ json: { phone: phone, history: JSON.stringify(trimmed) } }];`,
    },
    position: [-160, 0],
  },
  output: [{ phone: '962790000000', history: '[]' }],
});

const saveHistory = node({
  type: 'n8n-nodes-base.dataTable',
  version: 1.1,
  config: {
    name: 'Save History',
    parameters: {
      operation: 'upsert',
      dataTableId: HIST_TABLE,
      matchType: 'allConditions',
      filters: { conditions: [{ keyName: 'phone', condition: 'eq', keyValue: expr('{{ $json.phone }}') }] },
      columns: {
        mappingMode: 'defineBelow',
        value: { phone: expr('{{ $json.phone }}'), history: expr('{{ $json.history }}') },
        matchingColumns: ['phone'],
        schema: [
          { id: 'phone', displayName: 'phone', required: false, defaultMatch: false, display: true, type: 'string', readOnly: false, removed: false },
          { id: 'history', displayName: 'history', required: false, defaultMatch: false, display: true, type: 'string', readOnly: false, removed: false },
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
      options: {},
    },
    alwaysOutputData: true,
    position: [60, 0],
  },
  output: [{ phone: '962790000000', history: '[]' }],
});

export default workflow('log-messages-to-history', 'Dads Clinic-Log Messages to History')
  .add(subflowTrigger)
  .to(loadHistory)
  .to(appendTrim)
  .to(saveHistory);
