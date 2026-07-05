import { create } from "zustand";

// ------------ TYPES ------------
export type ApplicationType = "INTERNSHIP" | "FELLOWSHIP" | "EARLY_CAREER";

export type Application = {
  id: string;
  type?: ApplicationType;
  title: string;
  location?: string | null;
  status: Status;
  source?: string | null;
  jobUrl?: string | null;
  notes?: string | null;
  appliedAt?: string | Date | null;
  deadline?: string | Date | null;
  favorite?: boolean;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  companyId?: string;
  company?: { id?: string; name: string } | null;
  contactId?: string | null;
  contact?: {
    name: string;
    email?: string | null;
    phone?: string | null;
    linkedIn?: string | null;
    role: string | null;
  } | null;
};

export type Status =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEW"
  | "PENDING"
  | "OFFER"
  | "REJECTED";

export type ColumnType = {
  id: string;
  title: string;
  items: string[]; // array of application IDs
};

export type TrackerStore = {
  applications: Application[];
  setApplications: (apps: Application[]) => void;

  columns: Record<string, ColumnType>;
  setColumns: (columns: Record<string, ColumnType>) => void;

  moveCard: (card: string, from: string, to: string, position: number) => void;

  reorderCard: (columnId: string, oldIndex: number, newIndex: number) => void;

  updateApplicationStatus: (id: string, status: Status) => void;
};

// ------------ STORE ------------
export const useTrackerStore = create<TrackerStore>((set) => ({
  applications: [],
  setApplications: (apps) => set({ applications: apps }),

  columns: {}, // initially empty, set from fetched apps
  setColumns: (columns) => set({ columns }),

  moveCard: (card, from, to, position) =>
    set((state) => {
      const fromItems = [...state.columns[from].items].filter(
        (id) => id !== card,
      );
      const toItems = [...state.columns[to].items];
      toItems.splice(position, 0, card);

      return {
        columns: {
          ...state.columns,
          [from]: { ...state.columns[from], items: fromItems },
          [to]: { ...state.columns[to], items: toItems },
        },
      };
    }),

  reorderCard: (columnId, oldIndex, newIndex) =>
    set((state) => {
      const newItems = [...state.columns[columnId].items];
      const [moved] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, moved);

      return {
        columns: {
          ...state.columns,
          [columnId]: { ...state.columns[columnId], items: newItems },
        },
      };
    }),

  updateApplicationStatus: (id, status) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, status } : app,
      ),
    })),
}));
