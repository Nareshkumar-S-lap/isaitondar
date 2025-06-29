export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'organizer' | 'member' | 'guest';
  avatar?: string;
  phone?: string;
  temple?: string;
}

export interface Event {
  id: string;
  name: string;
  location: string;
  locationUrl?: string;
  templeName: string;
  date: string;
  time: string;
  membersNeeded: number;
  membersJoined: string[];
  instruments: string[];
  foodRequired: boolean;
  foodType?: string;
  notes?: string;
  guru?: string;
  thevaramPathigam?: string[];
  createdBy: string;
  createdAt: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Expense {
  id: string;
  eventId: string;
  type: string;
  amount: number;
  paidBy: string;
  description?: string;
  reimbursed: boolean;
  date: string;
  receiptUrl?: string;
}

export interface ThevaramPathigam {
  id: string;
  title: string;
  titleTamil: string;
  content: string;
  contentTamil: string;
  transliteration: string;
  audioUrl?: string;
  guru?: string;
  category: 'thevaram' | 'guru-pathigam';
  tags: string[];
}

export interface ChatMessage {
  id: string;
  eventId?: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'audio';
}