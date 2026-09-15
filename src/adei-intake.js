const DESIGN_TYPES = [
  'SITE_PLAN', 'FLOOR_PLAN', 'FACADE', 'EXTERIOR', 'INTERIOR', 'STRUCTURAL', 'MEP', 'LANDSCAPE', 'GREEN_BUILDING', 'RESILIENCE', 'BOQ_RAB', 'SCHEDULE'
];

export function createDesignIntake(input = {}) {
  return {
    title: String(input.title || 'Untitled AI Design Study').trim(),
    projectId: input.projectId || null,
    designTypes: (Array.isArray(input.designTypes) ? input.designTypes : []).filter((type) => DESIGN_TYPES.includes(type)),
    sourceType: input.sourceType || 'TEXT',
    sourceReferences: Array.isArray(input.sourceReferences) ? input.sourceReferences.slice(0, 50) : [],
    objectives: String(input.objectives || '').trim(),
    constraints: String(input.constraints || '').trim(),
    budgetTarget: input.budgetTarget ?? null,
    targetDate: input.targetDate || null,
    status: 'AI_DRAFT',
    governance: {
      professionalValidationRequired: true,
      directorApprovalRequired: true,
      baselineLockedUntilApproval: true,
    },
  };
}

export function getADEIDesignTypes() { return [...DESIGN_TYPES]; }
