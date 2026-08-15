export type UserRole = "student" | "staff" | "admin";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category_id: string | null;
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category | null;
  creator?: Profile | null;
  assignee?: Profile | null;
}

export interface Comment {
  id: string;
  ticket_id: string;
  author_id: string;
  body: string;
  created_at: string;
  author?: Profile | null;
}

export interface Attachment {
  id: string;
  ticket_id: string;
  uploaded_by: string;
  file_name: string;
  storage_path: string;
  file_size: number;
  content_type: string | null;
  created_at: string;
  uploader?: Profile | null;
}
