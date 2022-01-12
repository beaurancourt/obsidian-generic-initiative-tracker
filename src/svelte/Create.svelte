<script lang="ts">
    import { ExtraButtonComponent, Notice } from "obsidian";

    import { createEventDispatcher } from "svelte";

    import { DICE, SAVE } from "src/utils";

    import store from "./store";

    import type TrackerView from "src/view";

    const dispatch = createEventDispatcher();

    let view: TrackerView;
    store.view.subscribe((v) => (view = v));


    async function getInitiativeValue(modifier: number = 0): Promise<number> {
      let initiative = Math.floor(Math.random() * 19 + 1) + modifier;
      if (view.plugin.canUseDiceRoller) {
        const num = await view.plugin.app.plugins.plugins[
        "obsidian-dice-roller"
        ].parseDice(
          view.plugin.data.initiative.replace(/%mod%/g, `(${modifier})`)
        );

        initiative = num.result;
      }
      return initiative;
    }

    let name: string;
    let hp: string;
    let initiative: number;
    let ac: string;
    let modifier: number;
    let player: boolean;

    const saveButton = (node: HTMLElement) => {
        new ExtraButtonComponent(node)
            .setTooltip("Add Creature")
            .setIcon(SAVE)
            .onClick(() => {
                if (!name || !name.length) {
                    new Notice("Enter a name!");
                    return;
                }
                if (!modifier) {
                    modifier = 0;
                }

                if (!initiative) {
                  getInitiativeValue(modifier).then(init => {
                    dispatch("save", {
                        name,
                        hp,
                        initiative: init,
                        ac,
                        modifier,
                        player
                    });
                  })
                } else {
                  dispatch("save", {
                      name,
                      hp,
                      initiative,
                      ac,
                      modifier,
                      player
                  });
                }
            });
    };
    const cancelButton = (node: HTMLElement) => {
        new ExtraButtonComponent(node)
            .setTooltip("Cancel")
            .setIcon("cross")
            .onClick(() => {
                dispatch("cancel");
            });
    };
    const diceButton = (node: HTMLElement) => {
        new ExtraButtonComponent(node)
            .setIcon(DICE)
            .setTooltip("Roll Initiative")
            .onClick(() => {
                getInitiativeValue((modifier ?? 0)).then(init => {
                  initiative = init
                })
            });
    };
</script>

<div class="create-new">
    <div>
        <label for="add-name">Name</label>
        <input
            bind:value={name}
            id="add-name"
            type="text"
            name="name"
            tabindex="0"
        />
    </div>
    <div>
        <label for="add-hp">HP</label>
        <input
            bind:value={hp}
            id="add-hp"
            type="number"
            name="hp"
            tabindex="0"
        />
    </div>
    <div>
        <label for="add-ac">AC</label>
        <input
            bind:value={ac}
            id="add-ac"
            type="number"
            name="ac"
            tabindex="0"
        />
    </div>
    <div>
        <label for="add-mod">Modifier</label>
        <input
            bind:value={modifier}
            id="add-mod"
            type="number"
            name="ac"
            tabindex="0"
        />
    </div>
    <div class="initiative">
        <label for="add-init">Initiative</label>
        <input
            bind:value={initiative}
            id="add-init"
            type="number"
            name="initiative"
            tabindex="0"
        />
        <div class="dice" use:diceButton />
    </div>
</div>
<div class="context-buttons">
    <div class="add-button" use:saveButton />
    <div use:cancelButton class="add-button cancel-button" />
</div>

<style>
    .create-new > * {
        display: grid;
        grid-template-columns: 33% 66%;
        margin-bottom: 0.5rem;
    }
    .context-buttons {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        grid-gap: 0.125rem;
    }
    .cancel-button {
        color: var(--text-faint);
    }

    .initiative {
        position: relative;
    }
    .initiative > .dice {
        position: absolute;
        right: 0.25rem;
        top: 50%;
        transform: translateY(-50%);
    }
</style>
