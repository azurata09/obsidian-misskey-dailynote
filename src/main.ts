import { Plugin, Notice } from 'obsidian';
import { DEFAULT_SETTINGS, MisskeyDailyNoteSettings, MisskeyDailyNoteSettingTab } from "./settings";
import { MisskeyClient } from "./misskey-client";
import { NoteManager } from "./note-manager";

export default class MisskeyDailyNotePlugin extends Plugin {
	settings: MisskeyDailyNoteSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'sync-misskey-notes',
			name: 'Misskeyの投稿を同期',
			callback: async () => {
				new Notice('Misskeyの投稿を同期中...');
				try {
					const client = new MisskeyClient(this.settings.instanceUrl, this.settings.accessToken);
					const noteManager = new NoteManager(this.app, this.settings);

					const me = await client.getMyUser();

					const todayStart = new Date();
					todayStart.setHours(0, 0, 0, 0);

					const notes = await client.fetchNotes(me.id, undefined, 100, todayStart.getTime());

					const dailyNote = await noteManager.getDailyNote();
					const count = await noteManager.appendNotes(dailyNote, notes);

					new Notice(`Misskeyの投稿を同期しました。${count}件`);
				} catch (error) {
					console.error(error);
					new Notice(`Misskeyの同期に失敗しました: ${(error as Error).message}`);
				}
			}
		});

		this.addSettingTab(new MisskeyDailyNoteSettingTab(this.app, this));
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MisskeyDailyNoteSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
