import { App, PluginSettingTab, Setting } from "obsidian";
import MyPlugin from "./main";

export interface MisskeyDailyNoteSettings {
	instanceUrl: string;
	accessToken: string;
	dailyNoteFolder: string;
}

export const DEFAULT_SETTINGS: MisskeyDailyNoteSettings = {
	instanceUrl: 'https://misskey.io',
	accessToken: '',
	dailyNoteFolder: '/'
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
	}
}
