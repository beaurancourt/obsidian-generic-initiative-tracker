import {
  ButtonComponent,
  ExtraButtonComponent,
  Modal,
  Notice,
  PluginSettingTab,
  setIcon,
  Setting,
} from "obsidian";

import type InitiativeTracker from "./main";

import { AC, DEFAULT_UNDEFINED, EDIT, HP, INITIATIVE } from "./utils";
import type { HomebrewCreature, InputValidate } from "@types";

export default class InitiativeTrackerSettings extends PluginSettingTab {
  constructor(private plugin: InitiativeTracker) {
    super(plugin.app, plugin);
  }
  async display(): Promise<void> {
    try {
      let { containerEl } = this;

      containerEl.empty();
      containerEl.addClass("initiative-tracker-settings");

      containerEl.createEl("h2", { text: "Initiative Tracker Settings" });
      const additionalContainer = containerEl.createDiv(
        "initiative-tracker-additional-container"
      );

      this._displayPlayers(additionalContainer);

      if (this.plugin.canUseStatBlocks) {
        const syncEl = containerEl.createDiv("initiative-sync");

        new Setting(syncEl)
          .setName("Sync Monsters from 5e Statblocks")
          .setDesc(
            "Homebrew creatures saved to the 5e Statblocks plugin will be available in the quick-add."
          )
          .addToggle((t) => {
            t.setValue(this.plugin.data.sync);
            t.onChange(async (v) => {
              this.plugin.data.sync = v;

              await this.plugin.saveSettings();
              this.display();
            });
          });
        if (this.plugin.data.sync) {
          const synced = new Setting(syncEl).setDesc(
            `${this.plugin.statblock_creatures.length} creatures synced.`
          );
          synced.settingEl.addClass("initiative-synced");
          setIcon(synced.nameEl, "check-in-circle");
          synced.nameEl.appendChild(createSpan({ text: "Synced" }));
        }
      }

      const formula = new Setting(containerEl)
        .setName("Initiative Formula")

        .addText((t) => {
          if (!this.plugin.canUseDiceRoller) {
            t.setDisabled(true);
            this.plugin.data.initiative = "1d20 + %mod%";
          }
          t.setValue(this.plugin.data.initiative);
          t.onChange((v) => {
            this.plugin.data.initiative = v;
          });
          t.inputEl.onblur = async () => {
            if (this.plugin.view) this.plugin.view.rollInitiatives();
            await this.plugin.saveSettings();
          };
        });

      formula.descEl.createSpan({
        text: "Initiative formula to use when calculating initiative. Use ",
      });
      formula.descEl.createEl("code", { text: "%mod%" });
      formula.descEl.createSpan({
        text: " for the modifier placeholder.",
      });

      if (!this.plugin.canUseDiceRoller) {
        formula.descEl.createEl("br");
        formula.descEl.createEl("br");
        formula.descEl.createSpan({
          attr: {
            style: `color: var(--text-error);`,
          },
          text: "Requires the ",
        });
        formula.descEl.createEl("a", {
          text: "Dice Roller",
          href: "https://github.com/valentine195/obsidian-dice-roller",
          cls: "external-link",
        });
        formula.descEl.createSpan({
          attr: {
            style: `color: var(--text-error);`,
          },
          text: " plugin to modify.",
        });
      }
    } catch (e) {
      console.error(e);
      new Notice(
        "There was an error displaying the settings tab for Obsidian Initiative Tracker."
      );
    }
  }
  private _displayPlayers(additionalContainer: HTMLDivElement) {
    additionalContainer.empty();
    const additional = additionalContainer.createDiv("additional");
    new Setting(additional)
      .setName("Add New Player")
      .setDesc("These players will always be added to new encounters.")
      .addButton((button: ButtonComponent): ButtonComponent => {
        let b = button
          .setTooltip("Add Player")
          .setButtonText("+")
          .onClick(async () => {
            const modal = new NewPlayerModal(this.plugin);
            modal.open();
            modal.onClose = async () => {
              if (!modal.saved) return;

              await this.plugin.savePlayer({
                ...modal.player,
                player: true,
              });

              this._displayPlayers(additionalContainer);
            };
          });

        return b;
      });
    const playerView = additional.createDiv("initiative-tracker-players");
    if (!this.plugin.data.players.length) {
      additional
        .createDiv({
          attr: {
            style:
              "display: flex; justify-content: center; padding-bottom: 18px;",
          },
        })
        .createSpan({
          text: "No saved players! Create one to see it here.",
        });
    } else {
      const headers = playerView.createDiv("initiative-tracker-player headers");

      headers.createDiv({ text: "Name" });
      new ExtraButtonComponent(headers.createDiv())
        .setIcon(HP)
        .setTooltip("Max HP");
      new ExtraButtonComponent(headers.createDiv())
        .setIcon(AC)
        .setTooltip("Armor Class");
      new ExtraButtonComponent(headers.createDiv())
        .setIcon(INITIATIVE)
        .setTooltip("Initiative Modifier");

      headers.createDiv();

      for (let player of this.plugin.data.players) {
        const playerDiv = playerView.createDiv("initiative-tracker-player");
        playerDiv.createDiv({ text: player.name });
        playerDiv.createDiv({
          text: `${player.hp ?? DEFAULT_UNDEFINED}`,
        });
        playerDiv.createDiv({
          text: `${player.ac ?? DEFAULT_UNDEFINED}`,
        });
        playerDiv.createDiv({
          text: `${player.modifier ?? DEFAULT_UNDEFINED}`,
        });
        const icons = playerDiv.createDiv("initiative-tracker-player-icon");
        new ExtraButtonComponent(icons.createDiv())
          .setIcon(EDIT)
          .setTooltip("Edit")
          .onClick(() => {
            const modal = new NewPlayerModal(this.plugin, player);
            modal.open();
            modal.onClose = async () => {
              if (!modal.saved) return;
              await this.plugin.updatePlayer(player, modal.player);
              this.plugin.app.workspace.trigger(
                "initiative-tracker:creature-updated-in-settings",
                player
              );

              this._displayPlayers(additionalContainer);
            };
          });
        new ExtraButtonComponent(icons.createDiv())
          .setIcon("trash")
          .setTooltip("Delete")
          .onClick(async () => {
            this.plugin.data.players = this.plugin.data.players.filter(
              (p) => p != player
            );

            await this.plugin.saveSettings();
            this._displayPlayers(additionalContainer);
          });
      }
    }
  }
}

class NewPlayerModal extends Modal {
  player: HomebrewCreature;
  saved: boolean;
  constructor(
    private plugin: InitiativeTracker,
    private original?: HomebrewCreature
  ) {
    super(plugin.app);
    this.player = { ...(original ?? {}) };
  }
  async display(load?: boolean) {
    let { contentEl } = this;

    contentEl.addClass("initiative-tracker-add-player-modal");

    contentEl.empty();

    contentEl.createEl("h2", {
      text: this.original ? "Edit Player" : "New Player",
    });

    let nameInput: InputValidate,
      hpInput: InputValidate,
      acInput: InputValidate,
      modInput: InputValidate;

    new Setting(contentEl)
      .setName("Name")
      .setDesc("Player name. Must be unique!")
      .addText((t) => {
        nameInput = {
          input: t.inputEl,
          validate: (i: HTMLInputElement) => {
            let error = false;
            if (
              (!i.value.length && !load) ||
              (this.plugin.data.players.find((p) => p.name === i.value) &&
                this.player.name != this.original.name)
            ) {
              i.addClass("has-error");
              error = true;
            }
            return error;
          },
        };
        t.setValue(this.player.name ?? "");
        t.onChange((v) => {
          t.inputEl.removeClass("has-error");
          this.player.name = v;
        });
      });
    new Setting(contentEl).setName("Max Hit Points").addText((t) => {
      hpInput = {
        input: t.inputEl,
        validate: (i: HTMLInputElement) => {
          let error = false;
          if (isNaN(Number(i.value))) {
            i.addClass("has-error");
            error = true;
          }
          return error;
        },
      };
      t.setValue(`${this.player.hp ?? ""}`);
      t.onChange((v) => {
        t.inputEl.removeClass("has-error");
        this.player.hp = Number(v);
      });
    });
    new Setting(contentEl).setName("Armor Class").addText((t) => {
      acInput = {
        input: t.inputEl,
        validate: (i) => {
          let error = false;
          if (isNaN(Number(i.value))) {
            t.inputEl.addClass("has-error");
            error = true;
          }
          return error;
        },
      };
      t.setValue(`${this.player.ac ?? ""}`);
      t.onChange((v) => {
        t.inputEl.removeClass("has-error");
        this.player.ac = Number(v);
      });
    });
    new Setting(contentEl)
      .setName("Initiative Modifier")
      .setDesc("This will be added to randomly-rolled initiatives.")
      .addText((t) => {
        modInput = {
          input: t.inputEl,
          validate: (i) => {
            let error = false;
            if (isNaN(Number(i.value))) {
              t.inputEl.addClass("has-error");
              error = true;
            }
            return error;
          },
        };
        t.setValue(`${this.player.modifier ?? ""}`);
        t.onChange((v) => {
          this.player.modifier = Number(v);
        });
      });

    let footerEl = contentEl.createDiv();
    let footerButtons = new Setting(footerEl);
    footerButtons.addButton((b) => {
      b.setTooltip("Save")
        .setIcon("checkmark")
        .onClick(async () => {
          let error = this.validateInputs(
            nameInput,
            acInput,
            hpInput,
            modInput
          );
          if (error) {
            new Notice("Fix errors before saving.");
            return;
          }
          this.saved = true;
          this.close();
        });
      return b;
    });
    footerButtons.addExtraButton((b) => {
      b.setIcon("cross")
        .setTooltip("Cancel")
        .onClick(() => {
          this.saved = false;
          this.close();
        });
      return b;
    });

    this.validateInputs(nameInput, acInput, hpInput, modInput);
  }
  validateInputs(...inputs: InputValidate[]) {
    let error = false;
    for (let input of inputs) {
      if (input.validate(input.input)) {
        error = true;
      } else {
        input.input.removeClass("has-error");
      }
    }
    return error;
  }
  onOpen() {
    this.display(true);
  }
}
