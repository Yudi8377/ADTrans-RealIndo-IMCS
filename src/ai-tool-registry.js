const TOOLS = [
  { name: 'read_business_context', mode: 'READ', risk: 'LOW', capability: 'enterprise', description: 'Read authorized enterprise/business context.' },
  { name: 'read_project_context', mode: 'READ', risk: 'LOW', capability: 'project', description: 'Read authorized project context.' },
  { name: 'draft_work_order', mode: 'DRAFT', risk: 'MEDIUM', capability: 'operations', description: 'Prepare a work order draft without posting it.' },
  { name: 'draft_finance_transaction', mode: 'DRAFT', risk: 'HIGH', capability: 'finance', description: 'Prepare a finance transaction draft; posting remains separately governed.' },
  { name: 'submit_approval_request', mode: 'CONTROLLED', risk: 'HIGH', capability: 'enterprise', description: 'Request a human approval for a governed action.' },
];

export function listAITools(capabilities = []) {
  return TOOLS.filter((tool) => !tool.capability || capabilities.includes(tool.capability));
}

export function canUseAITool(toolName, { capabilities = [], confirmed = false } = {}) {
  const tool = TOOLS.find((item) => item.name === toolName);
  if (!tool) return { allowed: false, reason: 'Unknown AI tool.' };
  if (!capabilities.includes(tool.capability)) return { allowed: false, reason: `Capability ${tool.capability} is not granted.` };
  if (tool.risk === 'HIGH' && !confirmed) return { allowed: false, requiresConfirmation: true, reason: 'Human confirmation is required before this high-risk action.' };
  return { allowed: true, tool };
}

export function getAIToolRegistry() { return [...TOOLS]; }
