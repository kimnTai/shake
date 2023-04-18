import api from "../public/api.json";
import lodash from "lodash";

const obj = {
    api: {
        user: {
            register: {},
            emailVerification: {
                "{token}": {},
            },
            resendEmailVerification: {
                "{uid}": {},
            },
            login: {
                google: {},
            },
            "{uid}": {
                organizations: {
                    "{oid}": {
                        invite: {},
                        members: {},
                        settings: {
                            quit: {},
                            remove: {},
                        },
                    },
                },
                resetPassword: {},
            },
            "{uid}?q={query}": {},
        },
        reset: {
            resetPassword: {},
        },
        organizations: {
            "{oid}": {
                "{boardid}": {
                    duplicate: {},
                    tags: {
                        "{tid}": {},
                    },
                    invite: {},
                    quit: {},
                    updateTitle: {},
                    updateWorkspace: {},
                    updatePermissions: {},
                    search: {},
                    archive: {},
                    return: {},
                    list: {
                        "{lid}": {},
                    },
                },
            },
        },
        board: {},
        lists: {
            "{listid}": {},
            "{listId}": {
                archiveAllCards: {},
            },
        },
        cards: {
            "{cardId}": {},
            "{cid}": {
                members: {
                    "{memberid}": {},
                },
                attachments: {
                    "{attachid}": {},
                },
                cover: {},
                checklist: {
                    "{checklistid}": {},
                },
                comments: {
                    "{commentid}": {},
                },
                labels: {
                    "{labelid}": {},
                },
                date: {},
            },
        },
        boards: {
            "{boardid}": {
                members: {},
            },
        },
        logout: {},
    },
};

const c = api
    .map((v) => {
        const path = v.路徑.split("/").filter(Boolean);
        const obj = arrayToObject(path);
        return obj;
    })
    .reduce((pre, value) => {
        return lodash.merge(pre, value);
    }, {} as any);

function arrayToObject(arr: any[]) {
    if (!arr.length) {
        return {};
    }
    const obj = {} as any;
    if (arr.length === 1) {
        obj[arr[0]] = {};
    } else {
        const key = arr[0];
        const value = arrayToObject(arr.slice(1));
        obj[key] = value;
    }
    return obj;
}

const b = [
    "https://trello.com/1/member",
    "https://trello.com/1/member/me",
    // 標記星號的看板
    "https://trello.com/1/member/643e586a41751a29d5a5ee56/boardStars",
    // 移除星號
    "https://trello.com/1/member/643e586a41751a29d5a5ee56/boardStars/643e75c227b5d72041ffac9c",
    "https://trello.com/1/organization/userworkspace86655444",
    // 工作區成員
    "https://trello.com/1/Organizations/643e58717ad28c3aa5363107",
    "https://trello.com/1/lists",
    [
        // 看板、建立看板
        "https://trello.com/1/boards",
        "https://trello.com/1/boards/643e762642f24582ab4a4ee7",
        // 從看板建立標籤
        "https://trello.com/1/board/643e58af00c7f5fe837edd59/labels",
    ],
    [
        // 編輯標籤
        "https://trello.com/1/labels/643e58afd5e368f25051af96",
    ],
    [
        // 卡片
        "https://trello.com/1/cards",
        // 取得該卡片
        "https://trello.com/1/card/643e5ad68f6ad470b32bb728",
        [
            // 建立新標籤
            "https://trello.com/1/card/643e6384fe252aa38a8a80df/labels",
        ],
        [
            // 新增成員
            "https://trello.com/1/cards/643e6384fe252aa38a8a80df/idMembers",
        ],
        [
            // 待辦事項
            "https://trello.com/1/checklists/643e63ff382b2055535dda48",
            // 增加項目
            "https://trello.com/1/cards/643bbd6bf86f9a0e5c020443/checklist/643bc859ab29df2db1e5dbb7/checkItem",
        ],
        [
            // 評論
            "https://trello.com/1/cards/63fc76f7c4a8501277c99c58/actions/comments",
            // 編輯評論
            "https://trello.com/1/actions/643e6e4cc9fd361903d11f0a",
        ],
        [
            // 附件
            "https://trello.com/1/cards/643e6384fe252aa38a8a80df/attachments",
            "https://trello.com/1/cards/643e6384fe252aa38a8a80df/attachments/643e63b9787d1f5e4f2c907e",
        ],
    ],
];

// 追蹤or不追蹤卡片 -> PUT 卡片狀態
