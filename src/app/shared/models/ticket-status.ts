// Ticket status values accepted by the backend (PUT Ticket/{id}/status).
export const TICKET_STATUSES = ['Open', 'InProgress', 'Closed'] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];

// Older tickets may still carry the previous name for "InProgress".
const LEGACY_STATUSES: Record<string, TicketStatus> = {
  resolved: 'InProgress',
  'in progress': 'InProgress',
  'in process': 'InProgress',
};

// Maps whatever the API returns onto one of TICKET_STATUSES
// (case-insensitive; missing status counts as Open).
export function normalizeTicketStatus(status: string | null | undefined): string {

  const value = (status || 'Open').trim();
  const key = value.toLowerCase();

  return (
    TICKET_STATUSES.find(s => s.toLowerCase() === key) ??
    LEGACY_STATUSES[key] ??
    value
  );
}

// Text shown to users for a status
export function ticketStatusLabel(status: string | null | undefined): string {
  return normalizeTicketStatus(status);
}
