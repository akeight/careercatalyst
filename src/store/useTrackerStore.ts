import { create } from 'zustand';

type ColumnType = {
    id: string;
    title: string;
    items: string[];
};

type TrackerStore = {
    columns: Record<string, ColumnType>;
    moveCard: (card: string, fromColumn: string, toColumn: string, position: number) => void;
    reorderCard: (columnId: string, oldIndex: number, newIndex: number) => void;
};

export const useTrackerStore = create<TrackerStore>((set) => ({
    columns: {
        saved: { id: 'saved', title: 'Have Not Applied', items: ['Capital One', 'Uber'] },
        applied: { id: 'applied', title: 'Applied', items: ['Google', 'Mongo DB'] },
        interviewing: { id: 'interviewing', title: 'Interview Scheduled', items: ['Bloomberg'] },
        interviewed: { id: 'interviewed', title: 'Interviewed', items: ['Amazon'] },
        offers: { id: 'offers', title: 'Offer Pending', items: [] },
        rejected: { id: 'rejected', title: 'Rejected', items: [] },
    },
    moveCard: (card, from, to, position) =>
        set((state) => {
            const fromItems = [...state.columns[from].items].filter((i) => i !== card);
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
}));
