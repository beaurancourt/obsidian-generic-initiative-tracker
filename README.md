# TTRPG Generic Initiative Tracker for Obsidian.md

This plugin can be used as an initiative tracker within Obsidian.md.

When enabled, the plugin will add an additional view in the right pane, where
players and creatures can be added to track their initiatives during combat.

This is a trimmed-down fork of
https://github.com/valentine195/obsidian-initiative-tracker which aims to
separate out the iniative concepts from the DnD 5e specific stuff to make it
system agnostic.

## Main Differences

- No XP or Level settings
- Dropped support for homebrew creatures
- Dropped all of the 5e specific import functionality
- Massively simplified the settings screen
- Made the encounter renderer use internal links
- Give multiple creatures with the same name a unique index
- Misc bugfixes

## Creating Encounters in Notes

Encounters can be created and launched directly from notes using the "encounter" code block, like so:

````
```encounter
creatures:
- 2: Fighter 1, 13, 11, 550120
- 2: Fighter 2, 13, 10, 575120
```
````

This will render like this in Preview:

![image](https://user-images.githubusercontent.com/1045160/145105220-4f920d03-c84a-4edd-984c-f139988d16e7.png)

(gruvbox theme)

Clicking on the button next to the encounter name will then launch the encounter in the Initiative Tracker. The names attempt to wikilink as though you had surrounded them with `[[{name}]]`.

With players configured, that looks like:

![image](https://user-images.githubusercontent.com/1045160/145105397-546a7304-3c7f-4ffd-b74a-964381ebf0b5.png).

On hover, you get both a preview of the internal note and also an initative summary:

![image](https://user-images.githubusercontent.com/1045160/145105854-86c74cc0-6106-4ed5-89cb-aa83a5f2626d.png)

### Parameters

There are 3 parameters for each encounter, with more detail below.

````
```encounter
name: string                            # Name of the encounter. Optional.
players: boolean | string | array       # Which players to include. Optional.
creatures: array                        # Array of creatures to include in the encounter. Optional.
```
````

#### Name

The name of the encounter, which will be displayed both in Preview mode as well as in the Initiative Tracker when the encounter is launched.

#### Players

The `players` parameter can be used to filter the players stored in settings before starting the encounter.

If the `players` parameter is omitted, all players will be added to the encounter.

````
```encounter
players: false                          # No players will be added to the encounter.
players: none                           # Same as players: false
players: true                           # All players will be added. Same as omitting the parameter.
players:                                # Players will only be added to the encounter if they match the provided names.
 - Name
 - Name 2
```
````

#### Creatures

The most complicated parameter, `creatures` may be used to add additional creatures to the encounter.

The basic creature will be defined as an array with the syntax of `[name, hp, ac, initiative modifer]`.

**Please note that in all cases, hp, ac, and the modifier are optional.**

````
```encounter
creatures:
  - My Monster                          # 1 monster named My Monster will be added, with no HP, AC or modifier.
  - Goblin, 7, 15, 2                    # 1 goblin with HP: 7, AC: 15, MOD: 2 will be added.
```
````

Multiple of the same creature may be added using `X: [name, hp, ac, initiative modifer]`, which will add `X` creatures:

````
```encounter
creatures:
  - 3: Goblin, 7, 15, 2                 # 3 goblins with HP: 7, AC: 15, MOD: 2 will be added.
```
````

You may _also_ add multiple creatures by simply adding additional lines; this will also allow you to change HP, AC and modifier values for different creatures:

````
```encounter
creatures:
  - 2: Goblin, 7, 15, 2                 # 2 goblins with HP: 7, AC: 15, MOD: 2 will be added.
  - Goblin, 6, 15, 2                    # 1 goblin with HP: 6, AC: 15, MOD: 2 will be added.
  - Goblin, 9, 15, 2                    # 1 goblin with HP: 9, AC: 15, MOD: 2 will be added.
```
````

### Parameters

## Using the Initiative Tracker

Monsters may be added to the combat by clicking the `Add Creature` button, which will open a form where the creature's name, HP, AC and initiative can be set.

Once all of the creatures in a given combat have been added, initiatives can be modified by clicking on the initiative number and entering the new initiative. Names for non-player creatures can be modified in the same way.

### Actions

Creatures may be disabled or removed from the combat, or statuses (such as "poisoned") may be added in the `Actions` menu on the right of each creature.

### Controls

Combat can be started by clicking the `play` button. This will display the currently active creature. Clicking `next` or `previous` will move to the next enabled combatant.

Initiatives can be re-rolled for all creatures in the combat by clicking the `Re-roll Initiatives` button.

The creatures HP and status effects can be reset by clicking `Reset HP and Status`.

A new encounter (just player characters) can be started by clicking `New Encounter`.

### Commands

The plugin registers several commands to Obsidian that can be assigned to hotkeys or used with the Command Palette (<kbd>Ctrl</kbd> / <kbd>Cmd</kbd> + <kbd>P</kbd>).

#### Open Initiative Tracker

If the initiative tracker view has been closed for any reason, use this command to add it back to the right pane.

#### Toggle Encounter

This command can be used to start or stop an encounter.

#### Next Combatant

If the encounter is active, this command can be used to make the next enabled combatant active (similar to clicking the `Next` button).

#### Previous Combatant

If the encounter is active, this command can be used to make the previous enabled combatant active (similar to clicking the `Previous` button).

# Settings

The setting tab has options for adding and managing players and the ability to change the formula used to calculate the initiative.

## Players

Players may be added in settings. Players created in this way will be automatically added to encounters.

## Initiative Formula

> This setting can only be modified when the [Dice Roller](https://github.com/valentine195/obsidian-dice-roller) plugin is installed.

This setting can be used to modify how a creature's initiative is calculated by the plugin. Use `%mod%` as a placeholder for the creature's initiative modifier.

It defaults to `1d20 + %mod%`.

This will support any dice formula supported by the Dice Roller plugin.

# Custom Conditions

The initiative plugin will dynamically populate conditions from notes tagged
`#condition`. I'm still working on rendering the description text to look
better, but it's functional for now.

![image](https://user-images.githubusercontent.com/1045160/149223266-25afdf23-85b6-4616-9399-3986ab63bf7f.png)
![image](https://user-images.githubusercontent.com/1045160/149223344-107a3d00-647d-4ce3-a965-7f0bc8fdc293.png)


# Roadmap

This is a list of features that are planned for the plugin. Some of these may or may not be developed.

- Wikilink conditions
- Add a setting to point to a conditions tag
- Make the rendering for the conditions hover-over look better

# Installation

## From within Obsidian

From Obsidian v0.9.8, you can activate this plugin within Obsidian by doing the following:

- Open Settings > Third-party plugin
- Make sure Safe mode is **off**
- Click Browse community plugins
- Search for this plugin
- Click Install
- Once installed, close the community plugins window and activate the newly installed plugin

## From GitHub

- Download the Latest Release from the Releases section of the GitHub Repository
- Extract the plugin folder from the zip to your vault's plugins folder: `<vault>/.obsidian/plugins/`
  Note: On some machines the `.obsidian` folder may be hidden. On MacOS you should be able to press `Command+Shift+Dot` to show the folder in Finder.
- Reload Obsidian
- If prompted about Safe Mode, you can disable safe mode and enable the plugin.
  Otherwise head to Settings, third-party plugins, make sure safe mode is off and
  enable the plugin from there.

### Updates

You can follow the same procedure to update the plugin

# Warning

This plugin comes with no guarantee of stability and bugs may delete data.
Please ensure you have automated backups.

# TTRPG plugins

Check out valentine195's other plugins!

- [Obsidian Leaflet](https://github.com/valentine195/obsidian-leaflet-plugin) - Add interactive maps to Obsidian.md notes
- [Dice Roller](https://github.com/valentine195/obsidian-dice-roller) - Inline dice rolling for Obsidian.md
- [5e Statblocks](https://github.com/valentine195/obsidian-5e-statblocks) - Format statblocks 5e-style
