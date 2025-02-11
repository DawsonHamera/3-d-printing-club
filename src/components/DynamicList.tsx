import { createContext, useContext, useEffect, useState } from "react";
import ApiService from "../services/ApiService";
import { useAuth } from "../providers/AuthProvider";

interface DynamicListProps {
    get: string; // API endpoint to fetch items
    add: string; // API endpoint to add an item
    remove: string; // API endpoint to remove an item
    update: string; // API endpoint to update an item
    readonly?: boolean; // Optional flag to disable editing
    children: React.ReactNode; // Accepts anything inside <DynamicList>
}

interface DynamicListContextType {
    items: any[];
}


const DynamicListContext = createContext<DynamicListContextType>({});
export const useDynamicList = () => {
    return useContext(DynamicListContext);
}

const DynamicList: React.FC<DynamicListProps> = ({ get, add, remove, update, readonly, children }) => {
    const [items, setItems] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { apiFetch } = ApiService()

    useEffect(() => {
        apiFetch(get).then((response) => {
            if (response.error) {
                setError(response.error);
            } else {
                setItems(response.data); // Ensure we're setting the `data` part
            }
        });
    }, [get]);

    return (
        <DynamicListContext.Provider value={{ items }}>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {children}
        </DynamicListContext.Provider>
    );
};

const DynamicListEditor = () => {

}

interface DynamicListItemsProps {
    renderItem: (item: any) => JSX.Element;
}

const DynamicListItems: React.FC<DynamicListItemsProps> = ({ renderItem }) => {
    const { items } = useDynamicList();

    return (
        <div>
            <h1>List</h1>
            {items.map((item, index) => (
                <div key={index}>{renderItem(item)}</div>
            ))}
        </div>
    );
};

export {DynamicList, DynamicListItems}