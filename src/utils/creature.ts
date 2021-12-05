import type {
  Condition,
  CreatureState,
  HomebrewCreature,
  SRDMonster,
} from "@types";
import { Conditions } from ".";
import { DEFAULT_UNDEFINED } from "./constants";

function getId() {
  return "ID_xyxyxyxyxyxy".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class Creature {
  name: string;
  modifier: number;
  hp: number;
  ac: number;
  note: string;
  enabled: boolean = true;
  max: number;
  player: boolean;
  status: Set<Condition> = new Set();
  marker: string;
  private _initiative: number;
  source: string;
  id: string;
  constructor(creature: HomebrewCreature, initiative: number = 0) {
    this.name = creature.name;
    this._initiative = Number(initiative ?? 0);
    this.modifier = Number(creature.modifier ?? 0);

    this.max = creature.hp ? Number(creature.hp) : undefined;
    this.ac = creature.ac ? Number(creature.ac) : undefined;
    this.note = creature.note;
    this.player = creature.player;

    this.marker = creature.marker;

    this.hp = this.max;
    this.source = creature.source;

    this.id = creature.id ?? getId();
  }
  get hpDisplay() {
    if (this.max) {
      return `${this.hp}/${this.max}`;
    }
    return DEFAULT_UNDEFINED;
  }

  get initiative() {
    return this._initiative + this.modifier;
  }
  set initiative(x: number) {
    this._initiative = Number(x) - this.modifier;
  }

  *[Symbol.iterator]() {
    yield this.name;
    yield this.initiative;
    yield this.modifier;
    yield this.max;
    yield this.ac;
    yield this.note;
    yield this.id;
    yield this.marker;
  }

  static from(creature: HomebrewCreature | SRDMonster) {
    const modifier =
      "modifier" in creature
        ? creature.modifier
        : Math.floor(
            (("stats" in creature && creature.stats.length > 1
              ? creature.stats[1]
              : 10) -
              10) /
              2
          );
    return new Creature(
      {
        ...creature,
        modifier: modifier,
      },
      0
    );
  }

  update(creature: HomebrewCreature) {
    this.name = creature.name;
    this.modifier = Number(creature.modifier ?? 0);

    this.max = creature.hp ? Number(creature.hp) : undefined;

    if (this.hp > this.max) this.hp = this.max;

    this.ac = creature.ac ? Number(creature.ac) : undefined;
    this.note = creature.note;
    this.player = creature.player;

    this.marker = creature.marker;
    this.source = creature.source;
  }

  toProperties() {
    return { ...this };
  }

  toJSON(): CreatureState {
    return {
      name: this.name,
      initiative: this.initiative - this.modifier,
      modifier: this.modifier,
      hp: this.max,
      ac: this.ac,
      note: this.note,
      id: this.id,
      marker: this.marker,
      currentHP: this.hp,
      status: Array.from(this.status).map((c) => c.name),
      enabled: this.enabled,
      player: this.player,
    };
  }

  static fromJSON(state: CreatureState) {
    const creature = new Creature(state, state.initiative);
    creature.enabled = state.enabled;

    creature.hp = state.currentHP;
    creature.status = new Set(
      state.status.map((n) => Conditions.find(({ name }) => n == name))
    );
    return creature;
  }
}
