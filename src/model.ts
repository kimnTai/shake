interface Base {
    id: string;
}

interface User extends Base {
    name: string;
    email: string;
    password: string;
    avatar: string;
    googleId: string;
}

interface Organization extends Base {
    name: string;
    permission: "private" | "public";

    member: Array<{
        userId: User["id"];
        role: "editor " | "viewer" | "manager";
    }>;
    board: Array<Board["id"]>;
}

interface Board extends Base {
    name: string;
    closed: boolean;
    permission: "private" | "public";

    list: Array<List["id"]>;
}

interface List extends Base {
    name: string;
    closed: boolean;
    position: number;

    boardId: Board["id"];
    card: Array<Card["id"]>;
}

interface Card extends Base {
    name: string;
    description: string;
    closed: boolean;
    position: number;
    dueDate: Date;
    startDate: Date;
    dueReminder: number;

    listId: List["id"];
    label: Array<Label["id"]>;
    member: Array<User["id"]>;
    checklist: Array<Checklist["id"]>;
    attachment: Array<Attachment["id"]>;
}

interface Label extends Base {
    name: string;
    color: boolean;

    boardId: Board["id"];
}

interface Checklist extends Base {
    name: string;
    position: number;

    cardId: Card["id"];
    checkItem: Array<Checklist["id"]>;
}

interface CheckItem extends Base {
    name: string;
    completed: boolean;
    position: number;

    checklistId: Checklist["id"];
}

interface Comment extends Base {
    comment: string;

    userId: User["id"];
    cardId: Card["id"];
}

interface Attachment extends Base {
    dirname: string;
    filename: string;

    cardId: Card["id"];
    userId: User["id"];
}

interface Action extends Base {
    event: "createCard" | "moveCard" | "commentCard";
    data: string;

    cardId: Card["id"];
    userId: User["id"];
}

interface Notification extends Base {
    text: string;
    isRead: boolean;

    Action: Action["id"];
    userId: User["id"];
}
