import lodash from "lodash";

const obj = {
    api: {
        email: {
            resetPassword: {},
        },
        user: {
            register: {},
            emailVerification: {
                "{token}": {},
            },
            resendEmailVerification: {
                "{userID}": {},
            },
            login: {
                google: {},
            },
            "{userID}": {
                resetPassword: {},
            },
            "{userID}?q={query}": {},
        },
        organizations: {
            "{orgID}": {
                invitationSecret: {},
                members: {},
                settings: {
                    quit: {},
                },
            },
        },
        boards: {
            "{boardID}": {
                updateWorkspace: {},
                updatePermissions: {},
                labels: {
                    "{labelID}": {},
                },
                invitationSecret: {},
                quit: {},
                search: {},
                archive: {},
                members: {},
            },
        },
        lists: {
            "{listID}": {
                archiveAllCards: {},
            },
        },
        cards: {
            "{cardID}": {
                members: {
                    "{memberID}": {},
                },
                attachments: {
                    "{attID}": {},
                },
                checklist: {
                    "{checklistID}": {},
                },
                comments: {
                    "{commentID}": {},
                },
                labels: {
                    "{labelID}": {},
                },
            },
        },
    },
};

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

const trelloAPI = [
    // 高級搜尋
    "https://trello.com/1/search",
    [
        // 成員
        "https://trello.com/1/member",
        "https://trello.com/1/member/me",
        // 標記星號的看板
        "https://trello.com/1/member/643e586a41751a29d5a5ee56/boardStars",
        // 移除星號
        "https://trello.com/1/member/643e586a41751a29d5a5ee56/boardStars/643e75c227b5d72041ffac9c",
    ],
    [
        // 組織/工作區
        "https://trello.com/1/organization/userworkspace86655444",
        // 工作區成員
        "https://trello.com/1/Organizations/643e58717ad28c3aa5363107",
        // 工作區設定
        "https://trello.com/1/Organizations/usera504f686b662cd1509f2284e24f03e8a",
        // 邀請連結
        "https://trello.com/1/organizations/643f5f3f0204a97cd3fc8922/invitationSecret",
        // 退出
        "https://trello.com/1/Organization/640301905650ad3670af3334/members/6416e67476db1ae1ddee5397",
    ],
    [
        // 列表
        "https://trello.com/1/lists",
        // 封存列表
        "https://trello.com/1/Boards/640307027081f023cc8ac467",
        // 移動列表
        "https://trello.com/1/lists/643e58af00c7f5fe837edd60",
    ],
    [
        // 看板、建立看板
        "https://trello.com/1/boards",
        // 修改看板工作區
        "https://trello.com/1/boards/643e762642f24582ab4a4ee7",
        // 從看板建立標籤
        "https://trello.com/1/board/643e58af00c7f5fe837edd59/labels",
        // 看板邀請連結
        "https://trello.com/1/boards/643e58af00c7f5fe837edd59/invitationSecret",
        // [DELETE] 退出看板
        "https://trello.com/1/Board/640307027081f023cc8ac467/members/63fc76b47d772a0c9c8bfba3",
        // [PUT] 加入看板
        "https://trello.com/1/boards/640307027081f023cc8ac467/members/",
    ],
    [
        // 編輯標籤
        "https://trello.com/1/labels/643e58afd5e368f25051af96",
    ],
    [
        // 追蹤or不追蹤卡片 -> PUT 卡片狀態
        // 卡片
        "https://trello.com/1/cards",
        // 取得該卡片
        "https://trello.com/1/card/643e5ad68f6ad470b32bb728",
        [
            // 封存
            "https://trello.com/1/boards/640307027081f023cc8ac467/cards/closed",
        ],
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
