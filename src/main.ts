import lodash from "lodash";
import origin from "../public/origin.json";
import api from "../public/api.json";

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
