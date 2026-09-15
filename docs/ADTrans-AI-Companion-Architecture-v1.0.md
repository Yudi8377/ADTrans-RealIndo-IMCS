# ADTrans RealIndo — AI Companion Architecture v1.0

## Decision

ADTrans AI Companion is a first-class platform capability. Every departmental application and installer is designed to expose an AI Companion from the first deployment, subject to authentication, authorization, device policy, connectivity, and local capability constraints.

## Product model

Each authorized worker may have a named personal companion. The companion can present as chat, voice, vision, or avatar depending on device capability. The avatar is the interface; the governed AI agent, memory, tools, policy engine, and audit layer are the platform.

## Core architecture

```text
User → Role/Permission → AI Companion → AI Gateway → Tool Gateway → ADTrans OS
                              │
                              ├─ Context
                              ├─ Memory
                              ├─ Vision
                              ├─ Voice
                              └─ Agent orchestration
```

The AI never receives broader authority than its human principal. Every tool action is evaluated against RBAC/RLS/policy and high-risk actions require explicit human approval or an existing approval workflow.

## Continuous learning

Learning is controlled rather than autonomous mutation:

`Interaction → Candidate Memory → Validation → Policy Check → Approved Memory → Personalization`

Memory scopes:

- PERSONAL — user preferences and working style
- PROJECT — project-specific context and lessons
- ORGANIZATION — approved enterprise knowledge
- TECHNICAL — validated technical knowledge
- REGULATORY — source/version/jurisdiction controlled knowledge
- DECISION — approved business/design decisions

The AI cannot self-modify authorization, financial controls, safety limits, regulatory policy, audit evidence, or project baselines.

## Department specialization

The same gateway supports specialized capabilities for Executive, Finance, HR/Payroll, Procurement, Warehouse, Construction, Engineering, Property Management, CRM/Sales, Legal/Compliance, Maintenance, GIS/Field Intelligence, and future ADEI/Resilience domains.

## Field-first capability

On mobile/tablet/rugged devices the companion supports voice-first interaction, camera/vision workflows, offline bounded assistance, project context, field reports, work orders, checklists, evidence capture, and later AR/MR/smart-glass interfaces.

## Professional UX

The companion is available at first deployment but remains unobtrusive: desktop side panel/floating control, mobile assistant, and field hands-free mode. A user may name and personalize the companion where policy permits.

## Security and privacy

- No service-role or secret credentials in clients.
- AI tool access is mediated by the platform.
- Sensitive data is minimized and classified.
- Raw biometric templates/images are not stored in ordinary attendance records by default.
- AI memory is auditable and revocable.
- Regulatory knowledge is versioned and sourced.
- Financial/payment operations remain governed by approval and segregation-of-duties controls.
- Critical safety systems remain fail-safe and do not depend solely on cloud AI.

## Roadmap

1. IMCS universal companion shell.
2. Authenticated user/role context.
3. AI Gateway and tool permission contract.
4. Personal companion profile and controlled memory.
5. Provider-neutral model routing.
6. Voice and vision.
7. Department-specific agents.
8. Offline local assistant with bounded capability.
9. Avatar and real-time interaction.
10. Construction/design AI, BIM/Digital Twin, AR/MR, and enterprise collective learning.
