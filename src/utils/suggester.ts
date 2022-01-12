import {
  App,
  FuzzyMatch,
  FuzzySuggestModal,
  Scope,
  Setting,
  SuggestModal,
} from "obsidian";
import { createPopper, Instance as PopperInstance } from "@popperjs/core";

import type { HomebrewCreature, Condition } from "@types";
import type InitiativeTracker from "src/main";

class Suggester<T> {
  owner: SuggestModal<T>;
  items: T[];
  suggestions: HTMLDivElement[];
  selectedItem: number;
  containerEl: HTMLElement;
  constructor(owner: SuggestModal<T>, containerEl: HTMLElement, scope: Scope) {
    this.containerEl = containerEl;
    this.owner = owner;
    containerEl.on(
      "click",
      ".suggestion-item",
      this.onSuggestionClick.bind(this)
    );
    containerEl.on(
      "mousemove",
      ".suggestion-item",
      this.onSuggestionMouseover.bind(this)
    );

    scope.register([], "ArrowUp", () => {
      this.setSelectedItem(this.selectedItem - 1, true);
      return false;
    });

    scope.register([], "ArrowDown", () => {
      this.setSelectedItem(this.selectedItem + 1, true);
      return false;
    });

    scope.register([], "Enter", (evt) => {
      this.useSelectedItem(evt);
      return false;
    });

    scope.register([], "Tab", (evt) => {
      this.useSelectedItem(evt);
      return false;
    });
  }
  chooseSuggestion(evt: KeyboardEvent) {
    if (!this.items || !this.items.length) return;
    const currentValue = this.items[this.selectedItem];
    if (currentValue) {
      this.owner.selectSuggestion(currentValue, evt);
    }
  }
  onSuggestionClick(event: MouseEvent, el: HTMLDivElement): void {
    event.preventDefault();
    if (!this.suggestions || !this.suggestions.length) return;

    const item = this.suggestions.indexOf(el);
    this.setSelectedItem(item, false);
    this.useSelectedItem(event);
  }

  onSuggestionMouseover(_: MouseEvent, el: HTMLDivElement): void {
    if (!this.suggestions || !this.suggestions.length) return;
    const item = this.suggestions.indexOf(el);
    this.setSelectedItem(item, false);
  }
  empty() {
    this.containerEl.empty();
  }
  setSuggestions(items: T[]) {
    this.containerEl.empty();
    const els: HTMLDivElement[] = [];

    items.forEach((item) => {
      const suggestionEl = this.containerEl.createDiv("suggestion-item");
      this.owner.renderSuggestion(item, suggestionEl);
      els.push(suggestionEl);
    });
    this.items = items;
    this.suggestions = els;
    this.setSelectedItem(0, false);
  }
  useSelectedItem(event: MouseEvent | KeyboardEvent) {
    if (!this.items || !this.items.length) return;

    const currentValue = this.items[this.selectedItem];

    if (currentValue) {
      this.owner.selectSuggestion(currentValue, event);
    }
  }
  wrap(value: number, size: number): number {
    return ((value % size) + size) % size;
  }
  setSelectedItem(index: number, scroll: boolean) {
    const nIndex = this.wrap(index, this.suggestions.length);
    const prev = this.suggestions[this.selectedItem];
    const next = this.suggestions[nIndex];

    if (prev) prev.removeClass("is-selected");
    if (next) next.addClass("is-selected");

    this.selectedItem = nIndex;

    if (scroll) {
      next.scrollIntoView(false);
    }
  }
}

abstract class SuggestionModal<T> extends FuzzySuggestModal<T> {
  items: T[] = [];
  suggestions: HTMLDivElement[];
  popper: PopperInstance;
  scope: Scope = new Scope();
  suggester: Suggester<FuzzyMatch<T>>;
  suggestEl: HTMLDivElement;
  promptEl: HTMLDivElement;
  emptyStateText: string = "No match found";
  limit: number = 25;
  constructor(app: App, inputEl: HTMLInputElement) {
    super(app);
    this.inputEl = inputEl;

    this.suggestEl = createDiv({
      attr: { style: "min-width: 475px;" },
      cls: "suggestion-container",
    });

    this.contentEl = this.suggestEl.createDiv("suggestion");

    this.suggester = new Suggester(this, this.contentEl, this.scope);

    this.scope.register([], "Escape", this.close.bind(this));

    this.inputEl.addEventListener("input", this.onInputChanged.bind(this));
    /* this.inputEl.addEventListener("focus", this.onInputChanged.bind(this)); */
    this.inputEl.addEventListener("blur", this.close.bind(this));
    this.suggestEl.on(
      "mousedown",
      ".suggestion-container",
      (event: MouseEvent) => {
        event.preventDefault();
      }
    );
  }
  empty() {
    this.suggester.empty();
  }
  onInputChanged(): void {
    const inputStr = this.modifyInput(this.inputEl.value);
    const suggestions = this.getSuggestions(inputStr);

    if (suggestions.length > 0) {
      this.suggester.setSuggestions(suggestions.slice(0, this.limit));
    } else {
      this.onNoSuggestion();
    }
    this.open();
  }

  modifyInput(input: string): string {
    return input;
  }
  onNoSuggestion() {
    this.empty();
    this.renderSuggestion(null, this.contentEl.createDiv("suggestion-item"));
  }
  open(): void {
    // TODO: Figure out a better way to do this. Idea from Periodic Notes plugin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (<any>this.app).keymap.pushScope(this.scope);

    document.body.appendChild(this.suggestEl);
    this.popper = createPopper(this.inputEl, this.suggestEl, {
      placement: "auto-start",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 10],
          },
        },
        {
          name: "flip",
          options: {
            allowedAutoPlacements: ["top-start", "bottom-start"],
          },
        },
      ],
    });
  }

  close(): void {
    // TODO: Figure out a better way to do this. Idea from Periodic Notes plugin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (<any>this.app).keymap.popScope(this.scope);

    this.suggester.setSuggestions([]);
    if (this.popper) {
      this.popper.destroy();
    }

    this.suggestEl.detach();
  }
  createPrompt(prompts: HTMLSpanElement[]) {
    if (!this.promptEl)
      this.promptEl = this.suggestEl.createDiv("prompt-instructions");
    let prompt = this.promptEl.createDiv("prompt-instruction");
    for (let p of prompts) {
      prompt.appendChild(p);
    }
  }
  abstract onChooseItem(item: T, evt: MouseEvent | KeyboardEvent): void;
  abstract getItemText(arg: T): string;
  abstract getItems(): T[];
}

abstract class ElementSuggestionModal<T> extends FuzzySuggestModal<T> {
  items: T[] = [];
  suggestions: HTMLDivElement[];
  scope: Scope = new Scope();
  suggester: Suggester<FuzzyMatch<T>>;
  suggestEl: HTMLDivElement;
  promptEl: HTMLDivElement;
  emptyStateText: string = "No match found";
  limit: number = Infinity;
  filteredItems: FuzzyMatch<T>[] = [];
  constructor(app: App, inputEl: HTMLInputElement, suggestEl: HTMLDivElement) {
    super(app);
    this.inputEl = inputEl;

    this.suggestEl = suggestEl.createDiv(/* "suggestion-container" */);

    this.contentEl = this.suggestEl.createDiv(/* "suggestion" */);

    this.suggester = new Suggester(this, this.contentEl, this.scope);

    this.scope.register([], "Escape", this.close.bind(this));

    this.inputEl.addEventListener("input", this._onInputChanged.bind(this));
    this.inputEl.addEventListener("focus", this._onInputChanged.bind(this));
    this.inputEl.addEventListener("blur", this.close.bind(this));
    this.suggestEl.on(
      "mousedown",
      ".suggestion-container",
      (event: MouseEvent) => {
        event.preventDefault();
      }
    );
  }
  empty() {
    this.suggester.empty();
  }
  _onInputChanged(): void {
    const inputStr = this.inputEl.value;
    this.filteredItems = this.getSuggestions(inputStr);
    if (this.filteredItems.length > 0) {
      this.suggester.setSuggestions(this.filteredItems.slice(0, this.limit));
    } else {
      this.onNoSuggestion();
    }
    this.onInputChanged();
    this.open();
  }
  onInputChanged(): void {}
  onNoSuggestion() {
    this.empty();
    this.renderSuggestion(
      null,
      this.contentEl.createDiv(/* "suggestion-item" */)
    );
  }
  open(): void {}

  close(): void {}
  createPrompt(prompts: HTMLSpanElement[]) {
    if (!this.promptEl)
      this.promptEl = this.suggestEl.createDiv("prompt-instructions");
    let prompt = this.promptEl.createDiv("prompt-instruction");
    for (let p of prompts) {
      prompt.appendChild(p);
    }
  }
  abstract onChooseItem(item: T, evt: MouseEvent | KeyboardEvent): void;
  abstract getItemText(arg: T): string;
  abstract getItems(): T[];
}

export class HomebrewMonsterSuggestionModal extends ElementSuggestionModal<HomebrewCreature> {
  creature: HomebrewCreature;
  homebrew: HomebrewCreature[];
  constructor(
    public plugin: InitiativeTracker,
    inputEl: HTMLInputElement,
    el: HTMLDivElement
  ) {
    super(plugin.app, inputEl, el);
    this.homebrew = [...this.plugin.data.homebrew];
    this._onInputChanged();
  }
  getItems() {
    return this.homebrew;
  }
  getItemText(item: HomebrewCreature) {
    return item.name;
  }

  onChooseItem(item: HomebrewCreature) {
    this.inputEl.value = item.name;
    this.creature = item;
  }
  selectSuggestion(_: FuzzyMatch<HomebrewCreature>) {
    return;
  }
  renderSuggestion(result: FuzzyMatch<HomebrewCreature>, el: HTMLElement) {
    let { item, match: matches } = result || {};
    let content = new Setting(el); /* el.createDiv({
            cls: "suggestion-content"
        }); */
    if (!item) {
      content.nameEl.setText(this.emptyStateText);
      /* content.parentElement.addClass("is-selected"); */
      return;
    }

    const matchElements = matches.matches.map((_) => {
      return createSpan("suggestion-highlight");
    });
    for (let i = 0; i < item.name.length; i++) {
      let match = matches.matches.find((m) => m[0] === i);
      if (match) {
        let element = matchElements[matches.matches.indexOf(match)];
        content.nameEl.appendChild(element);
        element.appendText(item.name.substring(match[0], match[1]));

        i += match[1] - match[0] - 1;
        continue;
      }

      content.nameEl.appendText(item.name[i]);
    }

    content.setDesc(item.source ?? "");
    content.addExtraButton((b) => {
      b.setIcon("pencil")
        .setTooltip("Edit")
        .onClick(() => this.onEditItem(item));
    });
    content.addExtraButton((b) => {
      b.setIcon("trash")
        .setTooltip("Delete")
        .onClick(() => this.onRemoveItem(item));
    });
  }
  onEditItem(_: HomebrewCreature) {}
  onRemoveItem(_: HomebrewCreature) {}
}

export class ConditionSuggestionModal extends SuggestionModal<Condition> {
  items: Condition[] = [];
  condition: Condition;
  constructor(public plugin: InitiativeTracker, inputEl: HTMLInputElement) {
    super(plugin.app, inputEl);

    const cache = plugin.app.metadataCache;
    const fileNames = cache.getCachedFiles();
    const conditions = fileNames.filter((fileName) =>
      (cache.getCache(fileName).tags || []).some(
        (tag) => tag.tag == "#condition"
      )
    );
    this.items = conditions.map((condition) => {
      const link = cache.getFirstLinkpathDest(condition, condition);
      return {
        name: link.basename,
        description: link.unsafeCachedData,
        path: link.path,
      };
    });

    this.suggestEl.style.removeProperty("min-width");
    this.onInputChanged();
  }
  getItemText(item: Condition) {
    return item.name;
  }
  getItems() {
    return this.items;
  }
  onChooseItem(item: Condition) {
    this.inputEl.value = item.name;
    this.condition = item;
  }
  onNoSuggestion() {
    this.empty();
    this.renderSuggestion(null, this.contentEl.createDiv("suggestion-item"));
    this.condition = null;
  }
  selectSuggestion({ item }: FuzzyMatch<Condition>) {
    if (this.condition !== null) {
      this.inputEl.value = item.name;
      this.condition = item;
    } else {
      this.condition = {
        name: this.inputEl.value,
        description: [],
      };
    }

    this.onClose();
    this.close();
  }
  renderSuggestion(result: FuzzyMatch<Condition>, el: HTMLElement) {
    let { item, match: matches } = result || {};
    let content = new Setting(el);
    if (!item) {
      content.nameEl.setText(this.emptyStateText);
      this.condition = null;
      return;
    }

    const matchElements = matches.matches.map((_) => {
      return createSpan("suggestion-highlight");
    });

    for (let i = 0; i < item.name.length; i++) {
      let match = matches.matches.find((m) => m[0] === i);
      if (match) {
        let element = matchElements[matches.matches.indexOf(match)];
        content.nameEl.appendChild(element);
        element.appendText(item.name.substring(match[0], match[1]));

        i += match[1] - match[0] - 1;
        continue;
      }

      content.nameEl.appendText(item.name[i]);
    }
  }
}
