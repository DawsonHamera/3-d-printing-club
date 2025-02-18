import React, {
    Children,
    createContext,
    isValidElement,
    ReactElement,
    useContext,
    useEffect,
    useState,
} from "react";
import {
    IonButton,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonAlert,
    IonItemSliding,
    IonIcon,
    IonItemOption,
    IonItemOptions,
    IonRefresher,
    IonRefresherContent,
    IonProgressBar,
} from "@ionic/react";
import ApiService from "../services/ApiService";
import { v4 as uuidv4 } from 'uuid';
import { trash } from "ionicons/icons";
import './DynamicList.css'

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
    error: string | null;
    setError: (error: string) => void;
    getItems: () => void;
    removeItem: (idName: string, id: any) => void;
    addItem: (item: any) => void;
    handleRefresh: (event: CustomEvent) => void;
}

const DynamicListContext = createContext<DynamicListContextType | undefined>(
    undefined
);

export const useDynamicList = () => {
    const context = useContext(DynamicListContext);
    if (!context) {
        throw new Error(
            "useDynamicList must be used within a DynamicListProvider"
        );
    }
    return context;
};

const DynamicList: React.FC<DynamicListProps> = ({
    get,
    add,
    remove,
    update,
    readonly,
    children,
}) => {
    const [items, setItems] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { apiFetch, apiPost, apiLoading } = ApiService();

    // Define getItems and addItem before useEffect for clarity
    const getItems = async () => {
        apiFetch(get).then((response) => {
            if (response.error) {
                setError(response.error.message);
            } else {
                setItems(response.data); // Ensure we're setting the `data` part
            }
        });
    };

    const addItem = async (item: any) => {
        apiPost(add, item).then((response) => {
            console.log(response)
            if (response.error) {
                setError(response.error.message);
            } else {
                getItems();
            }
        });
    };

    const removeItem = async (idName: string, id: any) => {
        apiPost(remove, { [idName]: id }).then((response) => {
            console.log(response)
            if (response.error) {
                setError(response.error.message);
            } else {
                getItems();
            }
        });
    };
    const handleRefresh = async (event: CustomEvent) => {
        await getItems(); // Fetch the latest items
        event.detail.complete(); // Complete the refresh action
    };

    useEffect(() => {
        getItems();
    }, [get]);

    return (
        <DynamicListContext.Provider value={{ items, error, setError, getItems, addItem, removeItem, handleRefresh }}>
            <IonAlert
                isOpen={error != null}
                onDidDismiss={() => setError(null)}
                header={'Error'}
                message={error ? error : ''}
                buttons={['OK']}
            />
            {apiLoading && <IonProgressBar type="indeterminate" />}
            {children}
        </DynamicListContext.Provider>
    );
};

interface DynamicListEditorProps {
    buttonText: string;
    submitText: string;
    title: string;
    hiddenFields?: any;
    children: React.ReactNode;
}

const DynamicListEditor: React.FC<DynamicListEditorProps> = ({
    buttonText,
    submitText,
    title,
    hiddenFields,
    children,
}) => {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const { addItem, error, setError } = useDynamicList();
    const [formData, setFormData] = useState<
        Record<string, string | number | boolean>
    >({});

    const { } = useDynamicList()

    const handleChange = (field: string, value: any) => {
        console.log(field, "->", value);
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddItem = () => {
        const merged = { ...hiddenFields, ...formData };
        // You can call addItem(merged) here if needed:
        // addItem(merged);
        var empty = 0;
        childArray.forEach((child) => {
            if (!merged[child.props.field]) {
                empty = 1
            }
        });
        if (empty == 1) {
            setError("All fields must be filled")
        }
        else {
            addItem(merged)
            setIsEditorOpen(false)
        }
    };

    const childArray = Children.toArray(children).filter((child) =>
        isValidElement<DynamicListEditorInputProps>(child) && "field" in child.props
    ) as ReactElement<DynamicListEditorInputProps>[];

    return (
        <>
            <IonButton onClick={() => setIsEditorOpen(true)} className="center">
                {buttonText}
            </IonButton>
            <IonModal isOpen={isEditorOpen}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{title}</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setIsEditorOpen(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonList>
                        {childArray.length === 0 ? (
                            <p style={{ color: "red" }}>
                                ⚠️ Error: At least one input is required!
                            </p>
                        ) : (
                            childArray.map((child) =>
                                React.cloneElement(child, {
                                    value: formData[child.props.field] || "",
                                    onChange: handleChange,
                                })
                            )
                        )}
                    </IonList>
                    <IonButton expand="full" onClick={handleAddItem}>
                        {submitText}
                    </IonButton>
                </IonContent>
            </IonModal>
        </>
    );
};

interface DynamicListEditorInputProps {
    field: string;
    label: string;
    value?: any;
    options?: Array<{ value: any; label: string }>;
    onChange?: (field: string, value: any) => void;
}

const DynamicListEditorInput: React.FC<DynamicListEditorInputProps> = ({
    field,
    label,
    value,
    onChange,
}) => {
    if (onChange != null) {
        return (
            <IonItem>
                <IonInput
                    label={label}
                    value={value}
                    onIonInput={(e) => onChange(field, e.detail.value)}
                />
            </IonItem>
        );
    }
    return (
        <IonItem>
            <p style={{ color: "red" }}>
                ⚠️ A wrapper of DynamicListEditor is needed!
            </p>
        </IonItem>
    );
};

const DynamicListEditorCode: React.FC<DynamicListEditorInputProps> = ({
    field,
    label,
    value,
    onChange,
}) => {
    if (onChange != null) {
        return (
            <IonItem>
                <IonInput
                    label={label}
                    value={value}
                    onIonInput={(e) => onChange(field, e.detail.value)}
                ></IonInput>
                <IonButton onClick={() => onChange(field, uuidv4().substring(0, 8))}>Generate</IonButton>
            </IonItem>
        );
    }
    return (
        <IonItem>
            <p style={{ color: "red" }}>
                ⚠️ A wrapper of DynamicListEditor is needed!
            </p>
        </IonItem>
    );
};

const DynamicListEditorSelect: React.FC<DynamicListEditorInputProps> = ({
    field,
    label,
    value,
    options,
    onChange,
}) => {
    if (onChange != null && options != null) {
        return (
            <IonItem>
                <IonSelect
                    label={label}
                    value={value}
                    interface="popover"
                    onIonChange={(e) => onChange(field, e.detail.value)}
                >
                    {options.map((option: { value: any, label: string }) => (
                        <IonSelectOption key={option.value} value={option.value}>
                            {option.label}
                        </IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
        );
    }
    return (
        <IonItem>
            <p style={{ color: "red" }}>
                ⚠️ A wrapper of DynamicListEditor is needed!
            </p>
        </IonItem>
    );
};

const DynamicListEditorDate: React.FC<DynamicListEditorInputProps> = ({
    field,
    label,
    value,
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    if (onChange != null) {
        return (
            <IonItem>
                <IonButton onClick={() => setIsOpen(true)}>{label}</IonButton>
                <p style={{ marginLeft: 15 }}>{value ? new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric' }) : ''}</p>
                <IonModal isOpen={isOpen} initialBreakpoint={0.5} breakpoints={[0.5]} onDidDismiss={() => setIsOpen(false)}>
                    <div className="center">
                        <IonDatetime
                            presentation="date"
                            className="timedate"
                            value={value}
                            onIonChange={(event) => { onChange(field, event.detail.value) }}></IonDatetime>
                    </div>
                </IonModal>
            </IonItem>
        );
    }
    return (
        <IonItem>
            <p style={{ color: "red" }}>
                ⚠️ A wrapper of DynamicListEditor is needed!
            </p>
        </IonItem>
    );
};

const DynamicListEditorTime: React.FC<DynamicListEditorInputProps> = ({
    field,
    label,
    value,
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    if (onChange != null) {
        return (
            <IonItem>
                <IonButton onClick={() => setIsOpen(true)}>{label}</IonButton>
                <p style={{ marginLeft: 15 }}>{value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                <IonModal isOpen={isOpen} initialBreakpoint={0.5} breakpoints={[0.5]} onDidDismiss={() => setIsOpen(false)}>
                    <div className="center">
                        <IonDatetime
                            presentation="time"
                            className="timedate"
                            value={value}
                            onIonChange={(event) => { onChange(field, event.detail.value) }}></IonDatetime>
                    </div>
                </IonModal>
            </IonItem>
        );
    }
    return (
        <IonItem>
            <p style={{ color: "red" }}>
                ⚠️ A wrapper of DynamicListEditor is needed!
            </p>
        </IonItem>
    );
};

interface DynamicListItemsProps {
    renderItem: (item: any) => JSX.Element;
    canEdit?: boolean;
    identifier: string;
}

const DynamicListItems: React.FC<DynamicListItemsProps> = ({ renderItem, canEdit, identifier }) => {
    const { items, removeItem, handleRefresh } = useDynamicList();

    return (
        <IonContent>
            {items.map((item, index) => (
                <IonItemSliding key={index}>
                    <IonItem>{renderItem(item)}</IonItem>
                    {canEdit && (
                        <IonItemOptions side="end">
                            <IonItemOption color="danger" onClick={() => removeItem(identifier, item[identifier])}>
                                <IonIcon slot="icon-only" icon={trash}></IonIcon>
                            </IonItemOption>
                        </IonItemOptions>
                    )}
                </IonItemSliding>

            ))}
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
        </IonContent>
    );
};

export {
    DynamicList,
    DynamicListItems,
    DynamicListEditor,
    DynamicListEditorInput,
    DynamicListEditorSelect,
    DynamicListEditorDate,
    DynamicListEditorTime,
    DynamicListEditorCode
};
