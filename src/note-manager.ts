import { App, TFile, moment, normalizePath } from 'obsidian';
import { MisskeyDailyNoteSettings } from './settings';
import { MisskeyNote } from './misskey-client';

export class NoteManager {
    private app: App;
    private settings: MisskeyDailyNoteSettings;

    constructor(app: App, settings: MisskeyDailyNoteSettings) {
        this.app = app;
        this.settings = settings;
    }

    async getDailyNote(): Promise<TFile> {
        const folderPath = this.settings.dailyNoteFolder || '/';
        const dateStr = moment().format('YYYY-MM-DD');
        const fileName = `${dateStr}.md`;
        const filePath = normalizePath(`${folderPath}/${fileName}`);

        let file = this.app.vault.getAbstractFileByPath(filePath);

        if (!file) {
            // Create folder if it doesn't exist
            if (folderPath !== '/' && !(await this.app.vault.adapter.exists(folderPath))) {
                await this.app.vault.createFolder(folderPath);
            }
            // Create file
            file = await this.app.vault.create(filePath, '');
        }

        if (file instanceof TFile) {
            return file;
        } else {
            throw new Error(`Folder found at path ${filePath} where file was expected`);
        }
    }

    formatNote(note: MisskeyNote): string {
        const text = note.text || (note.renote ? `Renote: ${note.renote.text}` : '') || '(No content)';

        const time = moment(note.createdAt).format('HH:mm:ss');

        // Requested format: - HH:mm:ss <Content>
        let content = `- ${time} ${text}`;

        // Append images if any
        if (note.files && note.files.length > 0) {
            note.files.forEach(file => {
                content += `\n![](${file.url})`;
            });
        }

        return content;
    }

    async appendNotes(file: TFile, notes: MisskeyNote[]) {
        const content = await this.app.vault.read(file);


        const newLines: string[] = [];

        const sortedNotes = notes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        for (const note of sortedNotes) {
            const formattedLine = this.formatNote(note);
            if (content.includes(formattedLine)) {
                continue;
            }
            newLines.push(formattedLine);
        }

        if (newLines.length > 0) {
            const textToAppend = '\n' + newLines.join('\n');
            await this.app.vault.append(file, textToAppend);
            return newLines.length;
        }
        return 0;
    }
}
