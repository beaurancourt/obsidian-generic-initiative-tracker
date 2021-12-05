import {
  ButtonComponent,
  ExtraButtonComponent,
  Modal,
  Notice,
  PluginSettingTab,
  setIcon,
  Setting,
  TextComponent,
} from "obsidian";

import type InitiativeTracker from "./main";

import {
  ImportEntitiesFromXml,
  ImportEntitiesFromImprovedInitiative,
  ImportFromCritterDB,
  ImportFrom5eTools,
} from "src/import";

import {
  FileSuggestionModal,
  HomebrewMonsterSuggestionModal,
} from "./utils/suggester";
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
      const leaflet = new Setting(containerEl)
        .setName("Integrate with Obsidian Leaflet")

        .addToggle((t) => {
          if (!this.plugin.canUseLeaflet) {
            t.setDisabled(true);
            this.plugin.data.leafletIntegration = false;
          }
          t.setValue(this.plugin.data.leafletIntegration);
          t.onChange(async (v) => {
            this.plugin.data.leafletIntegration = v;
            this.plugin.view.setMapState(v);
            await this.plugin.saveSettings();
            this.display();
          });
        });

      leaflet.descEl.createSpan({
        text: "Integrate with the Obsidian Leaflet plugin and display combats on a map.",
      });

      if (!this.plugin.canUseLeaflet) {
        leaflet.descEl.createEl("br");
        leaflet.descEl.createEl("br");
        leaflet.descEl.createSpan({
          attr: {
            style: `color: var(--text-error);`,
          },
          text: "Requires  ",
        });
        leaflet.descEl.createEl("a", {
          text: "Obsidian Leaflet",
          href: "https://github.com/valentine195/obsidian-leaflet-plugin",
          cls: "external-link",
        });
        leaflet.descEl.createSpan({
          attr: {
            style: `color: var(--text-error);`,
          },
          text: " version 4.0.0 to modify.",
        });
      }

      if (this.plugin.canUseLeaflet) {
        const playerMarker = new Setting(containerEl)
          .setName("Default Player Marker Type")
          .addDropdown((drop) => {
            for (let marker of this.plugin.leaflet.markerIcons) {
              drop.addOption(marker.type, marker.type);
            }
            drop.setValue(this.plugin.data.playerMarker ?? "default");
            drop.onChange(async (v) => {
              this.plugin.data.playerMarker = v;
              await this.plugin.saveSettings();
              this.display();
            });
          });
        if (this.plugin.data.playerMarker) {
          const div = createDiv("marker-type-display");
          const inner = div.createDiv("marker-icon-display");

          const marker = this.plugin.leaflet.markerIcons.find(
            (icon) => icon.type == this.plugin.data.playerMarker
          );
          if (marker) {
            inner.innerHTML = marker.html;

            playerMarker.descEl.appendChild(div);
          }
        }
        const monsterMarker = new Setting(containerEl)
          .setName("Default Monster Marker Type")
          .addDropdown((drop) => {
            for (let marker of this.plugin.leaflet.markerIcons) {
              drop.addOption(marker.type, marker.type);
            }
            drop.setValue(this.plugin.data.monsterMarker);
            drop.onChange(async (v) => {
              this.plugin.data.monsterMarker = v;
              await this.plugin.saveSettings();
              this.display();
            });
          });
        if (this.plugin.data.monsterMarker) {
          const div = createDiv("marker-type-display");
          const inner = div.createDiv("marker-icon-display");

          const marker = this.plugin.leaflet.markerIcons.find(
            (icon) => icon.type == this.plugin.data.monsterMarker
          );
          if (marker) {
            inner.innerHTML = marker.html;

            monsterMarker.descEl.appendChild(div);
          }
        }
      }

      this._displayImports(containerEl);

      const homebrewContainer = containerEl.createDiv(
        "initiative-tracker-additional-container initiative-tracker-monsters"
      );
      this._displayHomebrew(homebrewContainer);

      const div = containerEl.createDiv("coffee");
      div
        .createEl("a", {
          href: "https://www.buymeacoffee.com/valentine195",
        })
        .createEl("img", {
          attr: {
            src: "https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=valentine195&button_colour=e3e7ef&font_colour=262626&font_family=Inter&outline_colour=262626&coffee_colour=ff0000",
          },
        });
    } catch (e) {
      console.error(e);
      new Notice(
        "There was an error displaying the settings tab for Obsidian Initiative Tracker."
      );
    }
  }
  private _displayImports(containerEl: HTMLElement) {
    const importSettingsContainer = containerEl.createDiv(
      "initiative-tracker-additional-container"
    );

    new Setting(importSettingsContainer)
      .setName("Import Creatures")
      .setDesc(
        "Import creatures from creature files. Only import data that you own."
      );

    const importAdditional = importSettingsContainer.createDiv("additional");
    const importAppFile = new Setting(importAdditional)
      .setName("Import DnDAppFile")
      .setDesc("Only import content that you own.");
    const inputAppFile = createEl("input", {
      attr: {
        type: "file",
        name: "dndappfile",
        accept: ".xml",
      },
    });

    inputAppFile.onchange = async () => {
      const { files } = inputAppFile;
      if (!files.length) return;
      try {
        const importedMonsters = await ImportEntitiesFromXml(
          ...Array.from(files)
        );
        try {
          await this.plugin.saveMonsters(importedMonsters);
          new Notice(
            `Successfully imported ${importedMonsters.length} creatures.`
          );
        } catch (e) {
          new Notice(
            `There was an issue importing the file${
              files.length > 1 ? "s" : ""
            }.`
          );
        }
        this.display();
      } catch (e) {}
    };

    importAppFile.addButton((b) => {
      b.setButtonText("Choose File").setTooltip("Import DnDAppFile Data");
      b.buttonEl.addClass("initiative-tracker-file-upload");
      b.buttonEl.appendChild(inputAppFile);
      b.onClick(() => inputAppFile.click());
    });

    const importImprovedInitiative = new Setting(importAdditional)
      .setName("Import Improved Initiative Data")
      .setDesc("Only import content that you own.");
    const inputImprovedInitiative = createEl("input", {
      attr: {
        type: "file",
        name: "dndappfile",
        accept: ".json",
      },
    });

    inputImprovedInitiative.onchange = async () => {
      const { files } = inputImprovedInitiative;
      if (!files.length) return;
      try {
        const importedMonsters = await ImportEntitiesFromImprovedInitiative(
          ...Array.from(files)
        );

        try {
          await this.plugin.saveMonsters(Array.from(importedMonsters.values()));
          new Notice(
            `Successfully imported ${importedMonsters.size} creatures.`
          );
        } catch (e) {
          new Notice(
            `There was an issue importing the file${
              files.length > 1 ? "s" : ""
            }.`
          );
        }
        this.display();
      } catch (e) {}
    };

    importImprovedInitiative.addButton((b) => {
      b.setButtonText("Choose File").setTooltip(
        "Import Improved Initiative Data"
      );
      b.buttonEl.addClass("initiative-tracker-file-upload");
      b.buttonEl.appendChild(inputImprovedInitiative);
      b.onClick(() => inputImprovedInitiative.click());
    });

    const importCritterDB = new Setting(importAdditional)
      .setName("Import CritterDB Data")
      .setDesc("Only import content that you own.");
    const inputCritterDB = createEl("input", {
      attr: {
        type: "file",
        name: "critterdb",
        accept: ".json",
      },
    });

    inputCritterDB.onchange = async () => {
      const { files } = inputCritterDB;
      if (!files.length) return;
      try {
        const importedMonsters = await ImportFromCritterDB(
          ...Array.from(files)
        );

        try {
          await this.plugin.saveMonsters(Array.from(importedMonsters.values()));
          new Notice(
            `Successfully imported ${importedMonsters.size} creatures.`
          );
        } catch (e) {
          new Notice(
            `There was an issue importing the file${
              files.length > 1 ? "s" : ""
            }.`
          );
        }
        this.display();
      } catch (e) {}
    };

    importCritterDB.addButton((b) => {
      b.setButtonText("Choose File").setTooltip("Import CritterDB Data");
      b.buttonEl.addClass("statblock-file-upload");
      b.buttonEl.appendChild(inputCritterDB);
      b.onClick(() => inputCritterDB.click());
    });

    const import5eTools = new Setting(importAdditional)
      .setName("Import 5e.tools Data")
      .setDesc("Only import content that you own.");
    const input5eTools = createEl("input", {
      attr: {
        type: "file",
        name: "fivetools",
        accept: ".json",
      },
    });

    input5eTools.onchange = async () => {
      const { files } = input5eTools;
      if (!files.length) return;
      try {
        const importedMonsters = await ImportFrom5eTools(...Array.from(files));

        try {
          await this.plugin.saveMonsters(Array.from(importedMonsters.values()));
          new Notice(
            `Successfully imported ${importedMonsters.size} creatures.`
          );
        } catch (e) {
          new Notice(
            `There was an issue importing the file${
              files.length > 1 ? "s" : ""
            }.`
          );
        }
        this.display();
      } catch (e) {}
    };

    import5eTools.addButton((b) => {
      b.setButtonText("Choose File").setTooltip("Import 5e.tools Data");
      b.buttonEl.addClass("statblock-file-upload");
      b.buttonEl.appendChild(input5eTools);
      b.onClick(() => input5eTools.click());
    });
  }
  private _displayHomebrew(additionalContainer: HTMLElement) {
    additionalContainer.empty();

    new Setting(additionalContainer)
      .setName("Add New Creature")
      .addButton((button: ButtonComponent): ButtonComponent => {
        let b = button
          .setTooltip("Add Creature")
          .setButtonText("+")
          .onClick(async () => {
            const modal = new NewCreatureModal(this.plugin);
            modal.open();
            modal.onClose = async () => {
              if (!modal.saved) return;

              this.plugin.saveMonster({
                ...modal.creature,
                source: "Homebrew",
              });

              this.display();
            };
          });

        return b;
      });

    let monsterFilter: TextComponent;
    const filters = additionalContainer.createDiv(
      "initiative-tracker-monster-filter"
    );
    const searchMonsters = new Setting(filters)
      .setName("Homebrew Monsters")
      .addSearch((t) => {
        t.setPlaceholder("Filter Monsters");
        monsterFilter = t;
      });

    const additional = additionalContainer.createDiv("additional");
    if (!this.plugin.data.homebrew.length) {
      additional
        .createDiv({
          attr: {
            style:
              "display: flex; justify-content: center; padding-bottom: 18px;",
          },
        })
        .createSpan({
          text: "No saved creatures! Create one to see it here.",
        });
      return;
    }

    let suggester = new HomebrewMonsterSuggestionModal(
      this.plugin,
      monsterFilter.inputEl,
      additional
    );

    searchMonsters.setDesc(
      `Manage homebrew creatures. Currently: ${
        suggester.getItems().length
      } creature${suggester.filteredItems.length != 1 ? "s" : ""}.`
    );

    suggester.onRemoveItem = async (monster) => {
      try {
        await this.plugin.deleteMonster(monster);
      } catch (e) {
        new Notice(
          `There was an error deleting the creature:${`\n\n` + e.message}`
        );
      }

      suggester.homebrew = [...this.plugin.data.homebrew];
      suggester._onInputChanged();
      /* this.display(); */
    };

    suggester.onEditItem = (monster) => {
      const modal = new NewCreatureModal(this.plugin, monster);
      modal.onClose = async () => {
        if (!modal.saved) return;
        try {
          await this.plugin.updateMonster(monster, modal.creature);

          this.plugin.app.workspace.trigger(
            "initiative-tracker:creature-updated-in-settings",
            monster
          );
        } catch (e) {
          new Notice(
            `There was an error updating the monster:${`\n\n` + e.message}`
          );
        }
        suggester.homebrew = [...this.plugin.data.homebrew];
        suggester._onInputChanged();
      };
      modal.open();
    };

    suggester.onInputChanged = () =>
      searchMonsters.setDesc(
        `Manage homebrew creatures. Currently: ${
          suggester.filteredItems.length
        } creature${suggester.filteredItems.length != 1 ? "s" : ""}.`
      );
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

    let error = false;

    contentEl.createEl("h2", {
      text: this.original ? "Edit Player" : "New Player",
    });

    new Setting(contentEl)
      .setName("Link to Note")
      .setDesc("Link player to a note in your vault.")
      .addText((t) => {
        t.setValue(this.player.note ?? "");
        const modal = new FileSuggestionModal(this.app, t);
        modal.onClose = async () => {
          if (!modal.file) return;

          const metaData = this.app.metadataCache.getFileCache(modal.file);

          this.player.note = modal.file.basename;
          this.player.name = modal.file.basename;

          if (!metaData || !metaData.frontmatter) return;

          const { ac, hp, modifier } = metaData.frontmatter;
          this.player = {
            ...this.player,
            ...{ ac, hp, modifier },
          };
          this.display();
        };
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

    if (this.plugin.canUseLeaflet) {
      const markerSetting = new Setting(contentEl)
        .setName("Leaflet Marker")
        .addDropdown((drop) => {
          for (let marker of this.plugin.leaflet.markerIcons) {
            drop.addOption(marker.type, marker.type);
          }
          drop.setValue(
            this.player.marker ?? this.plugin.data.playerMarker ?? "default"
          );
          drop.onChange(async (v) => {
            this.player.marker = v;
            this.display();
          });
        });

      if (this.player.marker) {
        const div = createDiv("marker-type-display");
        const inner = div.createDiv("marker-icon-display");

        const marker = this.plugin.leaflet.markerIcons.find(
          (icon) => icon.type == this.player.marker
        );
        if (marker) {
          inner.innerHTML = marker.html;

          markerSetting.descEl.appendChild(div);
        }
      }
    }

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
class NewCreatureModal extends Modal {
  creature: HomebrewCreature;
  saved: boolean;
  edit: boolean;
  constructor(
    private plugin: InitiativeTracker,
    private original?: HomebrewCreature
  ) {
    super(plugin.app);
    this.creature = { ...(original ?? {}) };
    this.edit = original ? true : false;
  }
  async display(load?: boolean) {
    let { contentEl } = this;

    contentEl.addClass("initiative-tracker-add-player-modal");

    contentEl.empty();

    let error = false;

    contentEl.createEl("h2", {
      text: `${this.edit ? "New" : "Edit"} Homebrew Creature`,
    });

    new Setting(contentEl)
      .setName("Link to Note")
      .setDesc("Link creature to a note in your vault.")
      .addText((t) => {
        t.setValue(this.creature.note ?? "");
        const modal = new FileSuggestionModal(this.app, t);
        modal.onClose = async () => {
          if (!modal.file) return;

          const metaData = this.app.metadataCache.getFileCache(modal.file);

          this.creature.note = modal.file.basename;
          this.creature.name = modal.file.basename;

          if (!metaData || !metaData.frontmatter) return;

          const { ac, hp, modifier } = metaData.frontmatter;
          this.creature = {
            ...this.creature,
            ...{ ac, hp, modifier },
          };
          this.display();
        };
      });

    let nameInput: InputValidate,
      hpInput: InputValidate,
      acInput: InputValidate,
      modInput: InputValidate;

    new Setting(contentEl)
      .setName("Name")
      .setDesc("Creature name.")
      .addText((t) => {
        nameInput = {
          input: t.inputEl,
          validate: (i: HTMLInputElement) => {
            let error = false;
            if (
              (!i.value.length && !load) ||
              (this.plugin.data.players.find((p) => p.name === i.value) &&
                this.creature.name != this.original.name)
            ) {
              i.addClass("has-error");
              error = true;
            }
            return error;
          },
        };
        t.setValue(this.creature.name ?? "");
        t.onChange((v) => {
          t.inputEl.removeClass("has-error");
          this.creature.name = v;
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
      t.setValue(`${this.creature.hp ?? ""}`);
      t.onChange((v) => {
        t.inputEl.removeClass("has-error");
        this.creature.hp = Number(v);
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
      t.setValue(`${this.creature.ac ?? ""}`);
      t.onChange((v) => {
        t.inputEl.removeClass("has-error");
        this.creature.ac = Number(v);
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
        t.setValue(`${this.creature.modifier ?? ""}`);
        t.onChange((v) => {
          this.creature.modifier = Number(v);
        });
      });
    new Setting(contentEl)
      .setName("Experience Points")
      .setDesc(
        "If entered, this will be used to calculate encounter experience points."
      )
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
        t.setValue(`${this.creature.xp ?? ""}`);
        t.onChange((v) => {
          this.creature.xp = Number(v);
        });
      });
    new Setting(contentEl)
      .setName("Challenge Rating")
      .setDesc(
        "If entered, this will be used to calculate creature experience points (if not provided)."
      )
      .addText((t) => {
        modInput = {
          input: t.inputEl,
          validate: (i) => {
            let error = false;
            if (i.value && typeof i.value != "string") {
              t.inputEl.addClass("has-error");
              error = true;
            }
            return error;
          },
        };
        t.setValue(`${this.creature.cr ?? ""}`);
        t.onChange((v) => {
          this.creature.cr = v;
        });
      });

    if (this.plugin.canUseLeaflet) {
      const markerSetting = new Setting(contentEl)
        .setName("Leaflet Marker")
        .addDropdown((drop) => {
          for (let marker of this.plugin.leaflet.markerIcons) {
            drop.addOption(marker.type, marker.type);
          }
          drop.setValue(
            this.creature.marker ?? this.plugin.data.monsterMarker ?? "default"
          );
          drop.onChange(async (v) => {
            this.creature.marker = v;
            this.display();
          });
        });
      if (this.creature.marker) {
        const div = createDiv("marker-type-display");
        const inner = div.createDiv("marker-icon-display");

        const marker = this.plugin.leaflet.markerIcons.find(
          (icon) => icon.type == this.creature.marker
        );
        if (marker) {
          inner.innerHTML = marker.html;

          markerSetting.descEl.appendChild(div);
        }
      }
    }

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
