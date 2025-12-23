import { App, PluginSettingTab, Setting } from "obsidian";
import MyPlugin from "./main";

export interface MisskeyDailyNoteSettings {
	instanceUrl: string;
	accessToken: string;
	dailyNoteFolder: string;
	autoSyncInterval: number;
}

export const DEFAULT_SETTINGS: MisskeyDailyNoteSettings = {
	instanceUrl: 'https://misskey.io',
	accessToken: '',
	dailyNoteFolder: '/',
	autoSyncInterval: 0
}

export class MisskeyDailyNoteSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('インスタンスURL')
			.setDesc('MisskeyのインスタンスのURL (例: https://misskey.io)')
			.addText(text => text
				.setPlaceholder('https://misskey.io')
				.setValue(this.plugin.settings.instanceUrl)
				.onChange(async (value) => {
					this.plugin.settings.instanceUrl = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('アクセストークン')
			.setDesc('Misskeyアカウントのアクセストークン')
			.addText(text => text
				.setPlaceholder('アクセストークン')
				.setValue(this.plugin.settings.accessToken)
				.onChange(async (value) => {
					this.plugin.settings.accessToken = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('デイリーノートフォルダ')
			.setDesc('デイリーノートが保存されるフォルダ (デフォルト: /)')
			.addText(text => text
				.setPlaceholder('/')
				.setValue(this.plugin.settings.dailyNoteFolder)
				.onChange(async (value) => {
					this.plugin.settings.dailyNoteFolder = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('自動同期の間隔 (分)')
			// eslint-disable-next-line obsidianmd/ui/sentence-case
			.setDesc('自動的にMisskeyの投稿を同期する間隔を設定します（0で無効化）。変更を反映するにはObsidianを再読み込みしてください。')
			.addText(text => text
				.setPlaceholder('0')
				.setValue(String(this.plugin.settings.autoSyncInterval))
				.onChange(async (value) => {
					const num = Number(value);
					if (!isNaN(num) && num >= 0) {
						this.plugin.settings.autoSyncInterval = num;
						await this.plugin.saveSettings();
					}
				}));
	}
}
