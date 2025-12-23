import { requestUrl, RequestUrlParam } from 'obsidian';

export interface MisskeyUser {
    id: string;
    name: string;
    username: string;
    host: string | null;
    avatarUrl: string;
    isBot: boolean;
    isCat: boolean;
    emojis: { name: string; url: string }[];
    onlineStatus: string;
}

export interface MisskeyFolder {
    id: string;
    name: string;
    parentId: string | null;
    foldersCount: number;
    filesCount: number;
}

export interface MisskeyFile {
    id: string;
    createdAt: string;
    name: string;
    type: string;
    md5: string;
    size: number;
    isSensitive: boolean;
    blurhash: string | null;
    properties: {
        width: number;
        height: number;
    };
    url: string;
    thumbnailUrl: string;
    comment: string | null;
    folderId: string | null;
    folder: MisskeyFolder | null;
    userId: string | null;
    user: MisskeyUser | null;
}

export interface MisskeyNote {
    id: string;
    createdAt: string;
    userId: string;
    user: MisskeyUser;
    text: string | null;
    cw: string | null;
    visibility: 'public' | 'home' | 'followers' | 'specified';
    renoteId: string | null;
    renote?: MisskeyNote;
    files: MisskeyFile[];
}

export class MisskeyClient {
    private instanceUrl: string;
    private accessToken: string;

    constructor(instanceUrl: string, accessToken: string) {
        this.instanceUrl = instanceUrl.replace(/\/$/, ''); // Remove trailing slash
        this.accessToken = accessToken;
    }

    async fetchNotes(userId: string, untilId?: string, limit: number = 100, sinceDate?: number, untilDate?: number): Promise<MisskeyNote[]> {
        const url = `${this.instanceUrl}/api/users/notes`;
        const body = {
            userId: userId,
            limit: limit,
            untilId: untilId,
            sinceDate: sinceDate,
            untilDate: untilDate,
            i: this.accessToken,
            includeReplies: false,
            includeRenotes: true,
            excludeNsfw: false
        };

        const params: RequestUrlParam = {
            url: url,
            method: "POST",
            body: JSON.stringify(body),
            contentType: "application/json"
        };

        try {
            const response = await requestUrl(params);
            if (response.status !== 200) {
                throw new Error(`Failed to fetch notes: ${response.status} ${response.text}`);
            }
            return response.json as MisskeyNote[];
        } catch (error) {
            console.error("Misskey API request failed:", error);
            throw error;
        }
    }

    async getMyUser(): Promise<MisskeyUser> {
        const url = `${this.instanceUrl}/api/i`;
        const params: RequestUrlParam = {
            url: url,
            method: "POST",
            body: JSON.stringify({ i: this.accessToken }),
            contentType: "application/json"
        };

        const response = await requestUrl(params);
        return response.json as MisskeyUser;
    }
}
