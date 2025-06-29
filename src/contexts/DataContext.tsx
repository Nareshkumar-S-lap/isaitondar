import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Event, Expense, ThevaramPathigam, ChatMessage } from '../types';
import { nanoid } from 'nanoid';

interface DataContextType {
  events: Event[];
  expenses: Expense[];
  pathigams: ThevaramPathigam[];
  messages: ChatMessage[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addPathigam: (pathigam: Omit<ThevaramPathigam, 'id'>) => void;
  updatePathigam: (id: string, pathigam: Partial<ThevaramPathigam>) => void;
  deletePathigam: (id: string) => void;
  joinEvent: (eventId: string, userId: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Shivaratri Celebration',
    location: 'Kapaleeshwarar Temple, Mylapore',
    locationUrl: 'https://maps.google.com/kapaleeshwarar',
    templeName: 'Kapaleeshwarar Temple',
    date: '2024-02-08',
    time: '18:00',
    membersNeeded: 12,
    membersJoined: ['1', '2'],
    instruments: ['Mridangam', 'Violin', 'Veena', 'Flute'],
    foodRequired: true,
    foodType: 'Prasadam',
    notes: 'Traditional attire required. Bring your own water bottle.',
    guru: 'Thirugnana Sambandar',
    thevaramPathigam: ['pathigam1', 'pathigam2'],
    createdBy: '1',
    createdAt: '2024-01-15T10:00:00Z',
    status: 'upcoming'
  },
  {
    id: '2',
    name: 'Karthik Deepam',
    location: 'Parthasarathy Temple, Triplicane',
    templeName: 'Parthasarathy Temple',
    date: '2024-02-15',
    time: '17:30',
    membersNeeded: 8,
    membersJoined: ['2', '3'],
    instruments: ['Thavil', 'Nadaswaram'],
    foodRequired: false,
    guru: 'Appar',
    thevaramPathigam: ['pathigam3'],
    createdBy: '2',
    createdAt: '2024-01-20T14:00:00Z',
    status: 'upcoming'
  }
];

const mockPathigams: ThevaramPathigam[] = [
  {
    id: 'pathigam1',
    title: 'Thiruvasagam - First Pathigam',
    titleTamil: 'திருவாசகம் - முதல் பதிகம்',
    content: 'Anbae sivamayam ulakam anbae sivam...',
    contentTamil: 'அன்பே சிவமயம் உலகம் அன்பே சிவம்...',
    transliteration: 'Anbae sivamayam ulakam anbae sivam...',
    audioUrl: '/audio/pathigam1.mp3',
    guru: 'Manikkavacakar',
    category: 'thevaram',
    tags: ['devotional', 'shiva']
  },
  {
    id: 'pathigam2',
    title: 'Thevaram - Sambandar Pathigam',
    titleTamil: 'தேவாரம் - சம்பந்தர் பதிகம்',
    content: 'Thodudaya seivian...',
    contentTamil: 'தொடுடைய செவியன்...',
    transliteration: 'Thodudaya seivian...',
    guru: 'Thirugnana Sambandar',
    category: 'thevaram',
    tags: ['classical', 'temple']
  }
];

const mockExpenses: Expense[] = [
  {
    id: '1',
    eventId: '1',
    type: 'Food & Catering',
    amount: 5000,
    paidBy: '1',
    description: 'Prasadam for 50 people',
    reimbursed: false,
    date: '2024-02-08'
  },
  {
    id: '2',
    eventId: '1',
    type: 'Transportation',
    amount: 2000,
    paidBy: '2',
    description: 'Bus rental for group travel',
    reimbursed: true,
    date: '2024-02-08'
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [pathigams, setPathigams] = useState<ThevaramPathigam[]>(mockPathigams);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: nanoid(),
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...eventData } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    setExpenses(prev => prev.filter(expense => expense.eventId !== id));
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: nanoid()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = (id: string, expenseData: Partial<Expense>) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, ...expenseData } : expense
    ));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const addPathigam = (pathigamData: Omit<ThevaramPathigam, 'id'>) => {
    const newPathigam: ThevaramPathigam = {
      ...pathigamData,
      id: nanoid()
    };
    setPathigams(prev => [...prev, newPathigam]);
  };

  const updatePathigam = (id: string, pathigamData: Partial<ThevaramPathigam>) => {
    setPathigams(prev => prev.map(pathigam => 
      pathigam.id === id ? { ...pathigam, ...pathigamData } : pathigam
    ));
  };

  const deletePathigam = (id: string) => {
    setPathigams(prev => prev.filter(pathigam => pathigam.id !== id));
  };

  const joinEvent = (eventId: string, userId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, membersJoined: [...event.membersJoined, userId] }
        : event
    ));
  };

  const addMessage = (messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: nanoid(),
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <DataContext.Provider value={{
      events,
      expenses,
      pathigams,
      messages,
      addEvent,
      updateEvent,
      deleteEvent,
      addExpense,
      updateExpense,
      deleteExpense,
      addPathigam,
      updatePathigam,
      deletePathigam,
      joinEvent,
      addMessage
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}