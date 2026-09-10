# ADTrans RealIndo IMCS — Architecture

The public portfolio is a presentation and controlled inquiry layer. IMCS is the protected internal operating system.

Identity is established by Supabase Auth; authorization is enforced by organization-scoped PostgreSQL RLS. The browser is never trusted with service-role credentials.

Business lifecycle: inquiry → organization-scoped intake → project/investment workflow → finance/legal/risk controls → governance → executive reporting.

Legacy data remains quarantined in staging until validation, mapping, reconciliation, and explicit promotion.
