(() => {
  "use strict";
  var e = {
      d: (t, i) => {
        for (var n in i)
          e.o(i, n) &&
            !e.o(t, n) &&
            Object.defineProperty(t, n, { enumerable: !0, get: i[n] });
      },
      o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
      r: (e) => {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      },
    },
    t = {};
  function i(e, t, i, n) {
    return new (i || (i = Promise))(function (a, r) {
      function s(e) {
        try {
          l(n.next(e));
        } catch (e) {
          r(e);
        }
      }
      function o(e) {
        try {
          l(n.throw(e));
        } catch (e) {
          r(e);
        }
      }
      function l(e) {
        var t;
        e.done
          ? a(e.value)
          : ((t = e.value),
            t instanceof i
              ? t
              : new i(function (e) {
                  e(t);
                })).then(s, o);
      }
      l((n = n.apply(e, t || [])).next());
    });
  }
  e.r(t), e.d(t, { default: () => tn }), Object.create, Object.create;
  const n = require("obsidian"),
    a = "initiative-tracker-view",
    r = "–",
    s = {
      players: [],
      homebrew: [],
      version: null,
      canUseDiceRoll: !1,
      initiative: "1d20 + %mod%",
      sync: !1,
      leafletIntegration: !1,
      playerMarker: "default",
      monsterMarker: "default",
      state: { creatures: [], state: !1, current: null, name: null },
    },
    o = "initiative-tracker",
    l = "initiative-tracker-map",
    c = "crossed-swords",
    d = "initiative-tracker-save",
    u = "initiative-tracker-add",
    p = "trash",
    h = "initiative-tracker-play",
    f = "initiative-tracker-forward",
    v = "initiative-tracker-backward",
    m = "initiative-tracker-stop",
    g = "initiative-tracker-hp",
    w = "initiative-tracker-ac",
    y = "initiative-tracker-hamburger",
    b = "initiative-tracker-disable",
    x = "initiative-tracker-enable",
    k = "initiative-tracker-edit",
    C = "initiative-tracker-tags",
    S = "initiative-tracker-initiative",
    $ = "initiative-tracker-redo",
    E = "initiative-tracker-new",
    I = "initiative-tracker-dice",
    A = "initiative-tracker-copy",
    T = [
      {
        name: "Blinded",
        description: [
          "A blinded creature can’t see and automatically fails any ability check that requires sight.",
          "Attack rolls against the creature have advantage, and the creature’s Attack rolls have disadvantage.",
        ],
      },
      {
        name: "Charmed",
        description: [
          "A charmed creature can’t Attack the charmer or target the charmer with harmful Abilities or magical Effects.",
          "The charmer has advantage on any ability check to interact socially with the creature.",
        ],
      },
      {
        name: "Concentrating",
        description: [
          "Some spells require you to maintain concentration in order to keep their magic active. If you lose concentration, such a spell ends.",
          "A creature loses concentration when: it casts another spell that requires concentration, is incapacitated, or dies.",
          "When a creature takes damage, it must make a constitution saving throw with a DC of 10 or half the damage it took, whichever is higher. On a failure, concentration is lost.",
        ],
      },
      {
        name: "Deafened",
        description: [
          "A deafened creature can’t hear and automatically fails any ability check that requires hearing.",
        ],
      },
      {
        name: "Frightened",
        description: [
          "A frightened creature has disadvantage on Ability Checks and Attack rolls while the source of its fear is within Line of Sight.",
          "The creature can’t willingly move closer to the source of its fear.",
        ],
      },
      {
        name: "Grappled",
        description: [
          "A grappled creature’s speed becomes 0, and it can’t benefit from any bonus to its speed.",
          "The condition ends if the Grappler is incapacitated.",
          "The condition also ends if an Effect removes the grappled creature from the reach of the Grappler or Grappling Effect, such as when a creature is hurled away by the Thunderwave spell.",
        ],
      },
      {
        name: "Incapacitated",
        description: [
          "An incapacitated creature can’t take Actions or Reactions.",
        ],
      },
      {
        name: "Invisible",
        description: [
          "An invisible creature is impossible to see without the aid of magic or a Special sense. For the Purpose of Hiding, the creature is heavily obscured. The creature’s Location can be detected by any noise it makes or any tracks it leaves.",
          "Attack rolls against the creature have disadvantage, and the creature’s Attack rolls have advantage.",
        ],
      },
      {
        name: "Paralyzed",
        description: [
          "A paralyzed creature is incapacitated and can’t move or speak.",
          "The creature automatically fails Strength and Dexterity Saving Throws.",
          "Attack rolls against the creature have advantage.",
          "Any Attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.",
        ],
      },
      {
        name: "Petrified",
        description: [
          "A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone). Its weight increases by a factor of ten, and it ceases aging.",
          "The creature is incapacitated, can’t move or speak, and is unaware of its surroundings.",
          "Attack rolls against the creature have advantage.",
          "The creature automatically fails Strength and Dexterity Saving Throws.",
          "The creature has Resistance to all damage.",
          "The creature is immune to poison and disease, although a poison or disease already in its system is suspended, not neutralized.",
        ],
      },
      {
        name: "Poisoned",
        description: [
          "A poisoned creature has disadvantage on Attack rolls and Ability Checks.",
        ],
      },
      {
        name: "Prone",
        description: [
          "A prone creature’s only Movement option is to crawl, unless it stands up and thereby ends the condition.",
          "The creature has disadvantage on Attack rolls.",
          "An Attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the Attack roll has disadvantage.",
        ],
      },
      {
        name: "Reacted",
        description: [
          "A creature, unless otherwise specified, gets one reaction per round of combat.",
          "A reaction is an instant response to a trigger of some kind, which can occur on your turn or on someone else’s.",
          "A reaction can be spent to make an opportunity attack, do a readied action, or use an ability that requires a reaction.",
          "A creature that has already reacted cannot use a reaction until the start of its turn.",
        ],
      },
      {
        name: "Restrained",
        description: [
          "A restrained creature’s speed becomes 0, and it can’t benefit from any bonus to its speed.",
          "Attack rolls against the creature have advantage, and the creature’s Attack rolls have disadvantage.",
          "The creature has disadvantage on Dexterity Saving Throws.",
        ],
      },
      {
        name: "Stunned",
        description: [
          "A stunned creature is incapacitated, can’t move, and can speak only falteringly.",
          "The creature automatically fails Strength and Dexterity Saving Throws.",
          "Attack rolls against the creature have advantage.",
        ],
      },
      {
        name: "Unconscious",
        description: [
          "An unconscious creature is incapacitated, can’t move or speak, and is unaware of its surroundings.",
          "The creature drops whatever it’s holding and falls prone.",
          "The creature automatically fails Strength and Dexterity Saving Throws.",
          "Attack rolls against the creature have advantage.",
          "Any Attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.",
        ],
      },
    ];
  class O extends n.PluginSettingTab {
    constructor(e) {
      super(e.app, e), (this.plugin = e);
    }
    display() {
      return i(this, void 0, void 0, function* () {
        try {
          let { containerEl: e } = this;
          e.empty(),
            e.addClass("initiative-tracker-settings"),
            e.createEl("h2", { text: "Initiative Tracker Settings" });
          const t = e.createDiv("initiative-tracker-additional-container");
          if ((this._displayPlayers(t), this.plugin.canUseStatBlocks)) {
            const t = e.createDiv("initiative-sync");
            if (
              (new n.Setting(t)
                .setName("Sync Monsters from 5e Statblocks")
                .setDesc(
                  "Homebrew creatures saved to the 5e Statblocks plugin will be available in the quick-add."
                )
                .addToggle((e) => {
                  e.setValue(this.plugin.data.sync),
                    e.onChange((e) =>
                      i(this, void 0, void 0, function* () {
                        (this.plugin.data.sync = e),
                          yield this.plugin.saveSettings(),
                          this.display();
                      })
                    );
                }),
              this.plugin.data.sync)
            ) {
              const e = new n.Setting(t).setDesc(
                `${this.plugin.statblock_creatures.length} creatures synced.`
              );
              e.settingEl.addClass("initiative-synced"),
                (0, n.setIcon)(e.nameEl, "check-in-circle"),
                e.nameEl.appendChild(createSpan({ text: "Synced" }));
            }
          }
          const a = new n.Setting(e)
            .setName("Initiative Formula")
            .addText((e) => {
              this.plugin.canUseDiceRoller ||
                (e.setDisabled(!0),
                (this.plugin.data.initiative = "1d20 + %mod%")),
                e.setValue(this.plugin.data.initiative),
                e.onChange((e) => {
                  this.plugin.data.initiative = e;
                }),
                (e.inputEl.onblur = () =>
                  i(this, void 0, void 0, function* () {
                    this.plugin.view && this.plugin.view.rollInitiatives(),
                      yield this.plugin.saveSettings();
                  }));
            });
          a.descEl.createSpan({
            text: "Initiative formula to use when calculating initiative. Use ",
          }),
            a.descEl.createEl("code", { text: "%mod%" }),
            a.descEl.createSpan({ text: " for the modifier placeholder." }),
            this.plugin.canUseDiceRoller ||
              (a.descEl.createEl("br"),
              a.descEl.createEl("br"),
              a.descEl.createSpan({
                attr: { style: "color: var(--text-error);" },
                text: "Requires the ",
              }),
              a.descEl.createEl("a", {
                text: "Dice Roller",
                href: "https://github.com/valentine195/obsidian-dice-roller",
                cls: "external-link",
              }),
              a.descEl.createSpan({
                attr: { style: "color: var(--text-error);" },
                text: " plugin to modify.",
              }));
        } catch (e) {
          console.error(e),
            new n.Notice(
              "There was an error displaying the settings tab for Obsidian Initiative Tracker."
            );
        }
      });
    }
    _displayPlayers(e) {
      var t, a, s;
      e.empty();
      const o = e.createDiv("additional");
      new n.Setting(o)
        .setName("Add New Player")
        .setDesc("These players will always be added to new encounters.")
        .addButton((t) =>
          t
            .setTooltip("Add Player")
            .setButtonText("+")
            .onClick(() =>
              i(this, void 0, void 0, function* () {
                const t = new j(this.plugin);
                t.open(),
                  (t.onClose = () =>
                    i(this, void 0, void 0, function* () {
                      t.saved &&
                        (yield this.plugin.savePlayer(
                          Object.assign(Object.assign({}, t.player), {
                            player: !0,
                          })
                        ),
                        this._displayPlayers(e));
                    }));
              })
            )
        );
      const l = o.createDiv("initiative-tracker-players");
      if (this.plugin.data.players.length) {
        const o = l.createDiv("initiative-tracker-player headers");
        o.createDiv({ text: "Name" }),
          new n.ExtraButtonComponent(o.createDiv())
            .setIcon(g)
            .setTooltip("Max HP"),
          new n.ExtraButtonComponent(o.createDiv())
            .setIcon(w)
            .setTooltip("Armor Class"),
          new n.ExtraButtonComponent(o.createDiv())
            .setIcon(S)
            .setTooltip("Initiative Modifier"),
          o.createDiv();
        for (let o of this.plugin.data.players) {
          const c = l.createDiv("initiative-tracker-player");
          c.createDiv({ text: o.name }),
            c.createDiv({
              text: `${null !== (t = o.hp) && void 0 !== t ? t : r}`,
            }),
            c.createDiv({
              text: `${null !== (a = o.ac) && void 0 !== a ? a : r}`,
            }),
            c.createDiv({
              text: `${null !== (s = o.modifier) && void 0 !== s ? s : r}`,
            });
          const d = c.createDiv("initiative-tracker-player-icon");
          new n.ExtraButtonComponent(d.createDiv())
            .setIcon(k)
            .setTooltip("Edit")
            .onClick(() => {
              const t = new j(this.plugin, o);
              t.open(),
                (t.onClose = () =>
                  i(this, void 0, void 0, function* () {
                    t.saved &&
                      (yield this.plugin.updatePlayer(o, t.player),
                      this.plugin.app.workspace.trigger(
                        "initiative-tracker:creature-updated-in-settings",
                        o
                      ),
                      this._displayPlayers(e));
                  }));
            }),
            new n.ExtraButtonComponent(d.createDiv())
              .setIcon("trash")
              .setTooltip("Delete")
              .onClick(() =>
                i(this, void 0, void 0, function* () {
                  (this.plugin.data.players = this.plugin.data.players.filter(
                    (e) => e != o
                  )),
                    yield this.plugin.saveSettings(),
                    this._displayPlayers(e);
                })
              );
        }
      } else
        o.createDiv({
          attr: {
            style:
              "display: flex; justify-content: center; padding-bottom: 18px;",
          },
        }).createSpan({ text: "No saved players! Create one to see it here." });
    }
  }
  class j extends n.Modal {
    constructor(e, t) {
      super(e.app),
        (this.plugin = e),
        (this.original = t),
        (this.player = Object.assign({}, null != t ? t : {}));
    }
    display(e) {
      return i(this, void 0, void 0, function* () {
        let t,
          a,
          r,
          s,
          { contentEl: o } = this;
        o.addClass("initiative-tracker-add-player-modal"),
          o.empty(),
          o.createEl("h2", {
            text: this.original ? "Edit Player" : "New Player",
          }),
          new n.Setting(o)
            .setName("Name")
            .setDesc("Player name. Must be unique!")
            .addText((i) => {
              var n;
              (t = {
                input: i.inputEl,
                validate: (t) => {
                  let i = !1;
                  return (
                    ((!t.value.length && !e) ||
                      (this.plugin.data.players.find(
                        (e) => e.name === t.value
                      ) &&
                        this.player.name != this.original.name)) &&
                      (t.addClass("has-error"), (i = !0)),
                    i
                  );
                },
              }),
                i.setValue(
                  null !== (n = this.player.name) && void 0 !== n ? n : ""
                ),
                i.onChange((e) => {
                  i.inputEl.removeClass("has-error"), (this.player.name = e);
                });
            }),
          new n.Setting(o).setName("Max Hit Points").addText((e) => {
            var t;
            (a = {
              input: e.inputEl,
              validate: (e) => {
                let t = !1;
                return (
                  isNaN(Number(e.value)) && (e.addClass("has-error"), (t = !0)),
                  t
                );
              },
            }),
              e.setValue(
                `${null !== (t = this.player.hp) && void 0 !== t ? t : ""}`
              ),
              e.onChange((t) => {
                e.inputEl.removeClass("has-error"),
                  (this.player.hp = Number(t));
              });
          }),
          new n.Setting(o).setName("Armor Class").addText((e) => {
            var t;
            (r = {
              input: e.inputEl,
              validate: (t) => {
                let i = !1;
                return (
                  isNaN(Number(t.value)) &&
                    (e.inputEl.addClass("has-error"), (i = !0)),
                  i
                );
              },
            }),
              e.setValue(
                `${null !== (t = this.player.ac) && void 0 !== t ? t : ""}`
              ),
              e.onChange((t) => {
                e.inputEl.removeClass("has-error"),
                  (this.player.ac = Number(t));
              });
          }),
          new n.Setting(o)
            .setName("Initiative Modifier")
            .setDesc("This will be added to randomly-rolled initiatives.")
            .addText((e) => {
              var t;
              (s = {
                input: e.inputEl,
                validate: (t) => {
                  let i = !1;
                  return (
                    isNaN(Number(t.value)) &&
                      (e.inputEl.addClass("has-error"), (i = !0)),
                    i
                  );
                },
              }),
                e.setValue(
                  `${
                    null !== (t = this.player.modifier) && void 0 !== t ? t : ""
                  }`
                ),
                e.onChange((e) => {
                  this.player.modifier = Number(e);
                });
            });
        let l = o.createDiv(),
          c = new n.Setting(l);
        c.addButton(
          (e) => (
            e
              .setTooltip("Save")
              .setIcon("checkmark")
              .onClick(() =>
                i(this, void 0, void 0, function* () {
                  this.validateInputs(t, r, a, s)
                    ? new n.Notice("Fix errors before saving.")
                    : ((this.saved = !0), this.close());
                })
              ),
            e
          )
        ),
          c.addExtraButton(
            (e) => (
              e
                .setIcon("cross")
                .setTooltip("Cancel")
                .onClick(() => {
                  (this.saved = !1), this.close();
                }),
              e
            )
          ),
          this.validateInputs(t, r, a, s);
      });
    }
    validateInputs(...e) {
      let t = !1;
      for (let i of e)
        i.validate(i.input) ? (t = !0) : i.input.removeClass("has-error");
      return t;
    }
    onOpen() {
      this.display(!0);
    }
  }
  class M {
    constructor(e, t = 0) {
      var i, n;
      (this.enabled = !0),
        (this.status = new Set()),
        (this.name = e.name),
        (this.modifier = Number(
          null !== (i = e.modifier) && void 0 !== i ? i : 0
        )),
        (this._initiative = Number(null != t ? t : 0) - this.modifier),
        (this.max = e.hp ? Number(e.hp) : void 0),
        (this.ac = e.ac ? Number(e.ac) : void 0),
        (this.note = e.note),
        (this.player = e.player),
        (this.marker = e.marker),
        (this.hp = this.max),
        (this.source = e.source),
        (this.id =
          null !== (n = e.id) && void 0 !== n
            ? n
            : "ID_xyxyxyxyxyxy".replace(/[xy]/g, function (e) {
                var t = (16 * Math.random()) | 0;
                return ("x" == e ? t : (3 & t) | 8).toString(16);
              }));
    }
    get hpDisplay() {
      return this.max ? `${this.hp}/${this.max}` : r;
    }
    get initiative() {
      return this._initiative + this.modifier;
    }
    set initiative(e) {
      this._initiative = Number(e) - this.modifier;
    }
    *[Symbol.iterator]() {
      yield this.name,
        yield this.initiative,
        yield this.modifier,
        yield this.max,
        yield this.ac,
        yield this.note,
        yield this.id,
        yield this.marker;
    }
    static from(e) {
      const t =
        "modifier" in e
          ? e.modifier
          : Math.floor(
              (("stats" in e && e.stats.length > 1 ? e.stats[1] : 10) - 10) / 2
            );
      return new M(Object.assign(Object.assign({}, e), { modifier: t }), 0);
    }
    update(e) {
      var t;
      (this.name = e.name),
        (this.modifier = Number(
          null !== (t = e.modifier) && void 0 !== t ? t : 0
        )),
        (this.max = e.hp ? Number(e.hp) : void 0),
        this.hp > this.max && (this.hp = this.max),
        (this.ac = e.ac ? Number(e.ac) : void 0),
        (this.note = e.note),
        (this.player = e.player),
        (this.marker = e.marker),
        (this.source = e.source);
    }
    toProperties() {
      return Object.assign({}, this);
    }
    toJSON() {
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
        status: Array.from(this.status).map((e) => e.name),
        enabled: this.enabled,
        player: this.player,
      };
    }
    static fromJSON(e) {
      const t = new M(e, e.initiative);
      return (
        (t.enabled = e.enabled),
        (t.hp = e.currentHP),
        (t.status = new Set(
          e.status.map((e) => T.find(({ name: t }) => e == t))
        )),
        t
      );
    }
  }
  function N() {}
  function D(e) {
    return e();
  }
  function z() {
    return Object.create(null);
  }
  function P(e) {
    e.forEach(D);
  }
  function B(e) {
    return "function" == typeof e;
  }
  function L(e, t) {
    return e != e
      ? t == t
      : e !== t || (e && "object" == typeof e) || "function" == typeof e;
  }
  function _(e) {
    return 0 === Object.keys(e).length;
  }
  function H(e) {
    return e && B(e.destroy) ? e.destroy : N;
  }
  new Set();
  let V,
    R = !1;
  function q(e, t) {
    e.appendChild(t);
  }
  function W(e, t, i) {
    const n = (function (e) {
      if (!e) return document;
      const t = e.getRootNode ? e.getRootNode() : e.ownerDocument;
      return t && t.host ? t : e.ownerDocument;
    })(e);
    if (!n.getElementById(t)) {
      const e = G("style");
      (e.id = t),
        (e.textContent = i),
        (function (e, t) {
          q(e.head || e, t);
        })(n, e);
    }
  }
  function U(e, t, i) {
    e.insertBefore(t, i || null);
  }
  function F(e) {
    e.parentNode.removeChild(e);
  }
  function Y(e, t) {
    for (let i = 0; i < e.length; i += 1) e[i] && e[i].d(t);
  }
  function G(e) {
    return document.createElement(e);
  }
  function J(e) {
    return document.createElementNS("http://www.w3.org/2000/svg", e);
  }
  function X(e) {
    return document.createTextNode(e);
  }
  function K() {
    return X(" ");
  }
  function Q(e, t, i, n) {
    return e.addEventListener(t, i, n), () => e.removeEventListener(t, i, n);
  }
  function Z(e, t, i) {
    null == i
      ? e.removeAttribute(t)
      : e.getAttribute(t) !== i && e.setAttribute(t, i);
  }
  function ee(e) {
    return "" === e ? null : +e;
  }
  function te(e, t) {
    (t = "" + t), e.wholeText !== t && (e.data = t);
  }
  function ie(e, t) {
    e.value = null == t ? "" : t;
  }
  function ne(e, t, i) {
    e.classList[i ? "add" : "remove"](t);
  }
  function ae(e) {
    V = e;
  }
  function re() {
    if (!V) throw new Error("Function called outside component initialization");
    return V;
  }
  function se() {
    const e = re();
    return (t, i) => {
      const n = e.$$.callbacks[t];
      if (n) {
        const a = (function (e, t, i = !1) {
          const n = document.createEvent("CustomEvent");
          return n.initCustomEvent(e, i, !1, t), n;
        })(t, i);
        n.slice().forEach((t) => {
          t.call(e, a);
        });
      }
    };
  }
  new Set();
  const oe = [],
    le = [],
    ce = [],
    de = [],
    ue = Promise.resolve();
  let pe = !1;
  function he(e) {
    ce.push(e);
  }
  let fe = !1;
  const ve = new Set();
  function me() {
    if (!fe) {
      fe = !0;
      do {
        for (let e = 0; e < oe.length; e += 1) {
          const t = oe[e];
          ae(t), ge(t.$$);
        }
        for (ae(null), oe.length = 0; le.length; ) le.pop()();
        for (let e = 0; e < ce.length; e += 1) {
          const t = ce[e];
          ve.has(t) || (ve.add(t), t());
        }
        ce.length = 0;
      } while (oe.length);
      for (; de.length; ) de.pop()();
      (pe = !1), (fe = !1), ve.clear();
    }
  }
  function ge(e) {
    if (null !== e.fragment) {
      e.update(), P(e.before_update);
      const t = e.dirty;
      (e.dirty = [-1]),
        e.fragment && e.fragment.p(e.ctx, t),
        e.after_update.forEach(he);
    }
  }
  const we = new Set();
  let ye, be;
  function xe() {
    ye = { r: 0, c: [], p: ye };
  }
  function ke() {
    ye.r || P(ye.c), (ye = ye.p);
  }
  function Ce(e, t) {
    e && e.i && (we.delete(e), e.i(t));
  }
  function Se(e, t, i, n) {
    if (e && e.o) {
      if (we.has(e)) return;
      we.add(e),
        ye.c.push(() => {
          we.delete(e), n && (i && e.d(1), n());
        }),
        e.o(t);
    }
  }
  function $e(e) {
    e && e.c();
  }
  function Ee(e, t, i, n) {
    const { fragment: a, on_mount: r, on_destroy: s, after_update: o } = e.$$;
    a && a.m(t, i),
      n ||
        he(() => {
          const t = r.map(D).filter(B);
          s ? s.push(...t) : P(t), (e.$$.on_mount = []);
        }),
      o.forEach(he);
  }
  function Ie(e, t) {
    const i = e.$$;
    null !== i.fragment &&
      (P(i.on_destroy),
      i.fragment && i.fragment.d(t),
      (i.on_destroy = i.fragment = null),
      (i.ctx = []));
  }
  function Ae(e, t, i, n, a, r, s, o = [-1]) {
    const l = V;
    ae(e);
    const c = (e.$$ = {
      fragment: null,
      ctx: null,
      props: r,
      update: N,
      not_equal: a,
      bound: z(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(l ? l.$$.context : t.context || []),
      callbacks: z(),
      dirty: o,
      skip_bound: !1,
      root: t.target || l.$$.root,
    });
    s && s(c.root);
    let d = !1;
    if (
      ((c.ctx = i
        ? i(e, t.props || {}, (t, i, ...n) => {
            const r = n.length ? n[0] : i;
            return (
              c.ctx &&
                a(c.ctx[t], (c.ctx[t] = r)) &&
                (!c.skip_bound && c.bound[t] && c.bound[t](r),
                d &&
                  (function (e, t) {
                    -1 === e.$$.dirty[0] &&
                      (oe.push(e),
                      pe || ((pe = !0), ue.then(me)),
                      e.$$.dirty.fill(0)),
                      (e.$$.dirty[(t / 31) | 0] |= 1 << t % 31);
                  })(e, t)),
              i
            );
          })
        : []),
      c.update(),
      (d = !0),
      P(c.before_update),
      (c.fragment = !!n && n(c.ctx)),
      t.target)
    ) {
      if (t.hydrate) {
        R = !0;
        const e = ((u = t.target), Array.from(u.childNodes));
        c.fragment && c.fragment.l(e), e.forEach(F);
      } else c.fragment && c.fragment.c();
      t.intro && Ce(e.$$.fragment),
        Ee(e, t.target, t.anchor, t.customElement),
        (R = !1),
        me();
    }
    var u;
    ae(l);
  }
  "undefined" != typeof window
    ? window
    : "undefined" != typeof globalThis
    ? globalThis
    : global,
    new Set([
      "allowfullscreen",
      "allowpaymentrequest",
      "async",
      "autofocus",
      "autoplay",
      "checked",
      "controls",
      "default",
      "defer",
      "disabled",
      "formnovalidate",
      "hidden",
      "ismap",
      "loop",
      "multiple",
      "muted",
      "nomodule",
      "novalidate",
      "open",
      "playsinline",
      "readonly",
      "required",
      "reversed",
      "selected",
    ]),
    "function" == typeof HTMLElement &&
      (be = class extends HTMLElement {
        constructor() {
          super(), this.attachShadow({ mode: "open" });
        }
        connectedCallback() {
          const { on_mount: e } = this.$$;
          this.$$.on_disconnect = e.map(D).filter(B);
          for (const e in this.$$.slotted) this.appendChild(this.$$.slotted[e]);
        }
        attributeChangedCallback(e, t, i) {
          this[e] = i;
        }
        disconnectedCallback() {
          P(this.$$.on_disconnect);
        }
        $destroy() {
          Ie(this, 1), (this.$destroy = N);
        }
        $on(e, t) {
          const i = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
          return (
            i.push(t),
            () => {
              const e = i.indexOf(t);
              -1 !== e && i.splice(e, 1);
            }
          );
        }
        $set(e) {
          this.$$set &&
            !_(e) &&
            ((this.$$.skip_bound = !0),
            this.$$set(e),
            (this.$$.skip_bound = !1));
        }
      });
  class Te {
    $destroy() {
      Ie(this, 1), (this.$destroy = N);
    }
    $on(e, t) {
      const i = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
      return (
        i.push(t),
        () => {
          const e = i.indexOf(t);
          -1 !== e && i.splice(e, 1);
        }
      );
    }
    $set(e) {
      this.$$set &&
        !_(e) &&
        ((this.$$.skip_bound = !0), this.$$set(e), (this.$$.skip_bound = !1));
    }
  }
  function Oe(e) {
    W(
      e,
      "svelte-u7pobm",
      ".encounter-name.svelte-u7pobm.svelte-u7pobm{display:flex;justify-content:flex-start;align-items:center}.encounter-instance.svelte-u7pobm>.creatures-container>.encounter-creatures:first-of-type h4.svelte-u7pobm,.encounter-creatures.svelte-u7pobm>ul.svelte-u7pobm{margin-top:0}.creature-li.svelte-u7pobm.svelte-u7pobm{width:fit-content}"
    );
  }
  function je(e, t, i) {
    const n = e.slice();
    return (n[8] = t[i][0]), (n[9] = t[i][1]), n;
  }
  function Me(e, t, i) {
    const n = e.slice();
    return (n[12] = t[i]), n;
  }
  function Ne(e) {
    let t;
    return {
      c() {
        (t = G("div")),
          (t.innerHTML = '<h4 class="svelte-u7pobm">No Players</h4>'),
          Z(t, "class", "encounter-creatures encounter-players");
      },
      m(e, i) {
        U(e, t, i);
      },
      p: N,
      d(e) {
        e && F(t);
      },
    };
  }
  function De(e) {
    let t,
      i,
      n,
      a,
      r = e[2],
      s = [];
    for (let t = 0; t < r.length; t += 1) s[t] = ze(Me(e, r, t));
    return {
      c() {
        (t = G("div")),
          (i = G("h4")),
          (i.textContent = "Players"),
          (n = K()),
          (a = G("ul"));
        for (let e = 0; e < s.length; e += 1) s[e].c();
        Z(i, "class", "svelte-u7pobm"),
          Z(a, "class", "svelte-u7pobm"),
          Z(t, "class", "encounter-creatures encounter-players svelte-u7pobm");
      },
      m(e, r) {
        U(e, t, r), q(t, i), q(t, n), q(t, a);
        for (let e = 0; e < s.length; e += 1) s[e].m(a, null);
      },
      p(e, t) {
        if (4 & t) {
          let i;
          for (r = e[2], i = 0; i < r.length; i += 1) {
            const n = Me(e, r, i);
            s[i] ? s[i].p(n, t) : ((s[i] = ze(n)), s[i].c(), s[i].m(a, null));
          }
          for (; i < s.length; i += 1) s[i].d(1);
          s.length = r.length;
        }
      },
      d(e) {
        e && F(t), Y(s, e);
      },
    };
  }
  function ze(e) {
    let t,
      i,
      n,
      a,
      r = e[12] + "";
    return {
      c() {
        (t = G("li")), (i = G("span")), (n = X(r)), (a = K());
      },
      m(e, r) {
        U(e, t, r), q(t, i), q(i, n), q(t, a);
      },
      p(e, t) {
        4 & t && r !== (r = e[12] + "") && te(n, r);
      },
      d(e) {
        e && F(t);
      },
    };
  }
  function Pe(e) {
    let t;
    return {
      c() {
        (t = G("strong")), (t.textContent = "No creatures");
      },
      m(e, i) {
        U(e, t, i);
      },
      p: N,
      d(e) {
        e && F(t);
      },
    };
  }
  function Be(e) {
    let t,
      i = e[3],
      n = [];
    for (let t = 0; t < i.length; t += 1) n[t] = Le(je(e, i, t));
    return {
      c() {
        t = G("ul");
        for (let e = 0; e < n.length; e += 1) n[e].c();
        Z(t, "class", "svelte-u7pobm");
      },
      m(e, i) {
        U(e, t, i);
        for (let e = 0; e < n.length; e += 1) n[e].m(t, null);
      },
      p(e, a) {
        if (40 & a) {
          let r;
          for (i = e[3], r = 0; r < i.length; r += 1) {
            const s = je(e, i, r);
            n[r] ? n[r].p(s, a) : ((n[r] = Le(s)), n[r].c(), n[r].m(t, null));
          }
          for (; r < n.length; r += 1) n[r].d(1);
          n.length = i.length;
        }
      },
      d(e) {
        e && F(t), Y(n, e);
      },
    };
  }
  function Le(e) {
    let t,
      i,
      n,
      a,
      r,
      s,
      o,
      l,
      c,
      d,
      u = e[9] + "",
      p = e[8].name + "";
    return {
      c() {
        (t = G("li")),
          (i = G("strong")),
          (n = X(u)),
          (a = X(" ")),
          (r = G("a")),
          (s = X(p)),
          (c = K()),
          Z(r, "data-href", (o = e[8].name)),
          Z(r, "href", (l = e[8].name)),
          Z(r, "class", "internal-link"),
          Z(r, "target", "_blank"),
          Z(r, "rel", "noopener"),
          Z(t, "aria-label", (d = e[5](e[8]))),
          Z(t, "class", "creature-li svelte-u7pobm");
      },
      m(e, o) {
        U(e, t, o), q(t, i), q(i, n), q(t, a), q(t, r), q(r, s), q(t, c);
      },
      p: N,
      d(e) {
        e && F(t);
      },
    };
  }
  function _e(e) {
    let t, i, n, a, r, s, o, l, c, d, u, p, h, f, v;
    function m(e, t) {
      return e[2] instanceof Array && e[2].length ? De : e[2] ? void 0 : Ne;
    }
    let g = m(e),
      w = g && g(e);
    function y(e, t) {
      return e[1].length ? Be : Pe;
    }
    let b = y(e),
      x = b(e);
    return {
      c() {
        (t = G("div")),
          (i = G("div")),
          (n = G("div")),
          (r = K()),
          (s = G("h3")),
          (o = X(e[0])),
          (l = K()),
          (c = G("div")),
          w && w.c(),
          (d = K()),
          (u = G("div")),
          (p = G("h4")),
          (p.textContent = "Creatures"),
          (h = K()),
          x.c(),
          Z(s, "data-heading", e[0]),
          Z(s, "class", "initiative-tracker-name"),
          Z(i, "class", "encounter-name svelte-u7pobm"),
          Z(p, "class", "svelte-u7pobm"),
          Z(u, "class", "encounter-creatures svelte-u7pobm"),
          Z(c, "class", "creatures-container"),
          Z(t, "class", "encounter-instance svelte-u7pobm");
      },
      m(m, g) {
        U(m, t, g),
          q(t, i),
          q(i, n),
          q(i, r),
          q(i, s),
          q(s, o),
          q(t, l),
          q(t, c),
          w && w.m(c, null),
          q(c, d),
          q(c, u),
          q(u, p),
          q(u, h),
          x.m(u, null),
          f || ((v = H((a = e[4].call(null, n)))), (f = !0));
      },
      p(e, [t]) {
        1 & t && te(o, e[0]),
          1 & t && Z(s, "data-heading", e[0]),
          g === (g = m(e)) && w
            ? w.p(e, t)
            : (w && w.d(1), (w = g && g(e)), w && (w.c(), w.m(c, d))),
          b === (b = y(e)) && x
            ? x.p(e, t)
            : (x.d(1), (x = b(e)), x && (x.c(), x.m(u, null)));
      },
      i: N,
      o: N,
      d(e) {
        e && F(t), w && w.d(), x.d(), (f = !1), v();
      },
    };
  }
  function He(e, t, i) {
    const a = se();
    let { name: r = "Encounter" } = t,
      { creatures: s = [] } = t,
      { players: o = !0 } = t;
    const l = [],
      d = (e, t) =>
        e.name == t.name &&
        e.ac == t.ac &&
        e.hp == t.hp &&
        e.modifier == t.modifier;
    for (let e of s) {
      const t = { name: e.name, ac: e.ac, hp: e.hp, modifier: e.modifier },
        i = l.find(([e]) => d(e, t));
      i ? l.splice(l.indexOf(i), 1, [i[0], i[1] + 1]) : l.push([t, 1]);
    }
    return (
      (e.$$set = (e) => {
        "name" in e && i(0, (r = e.name)),
          "creatures" in e && i(1, (s = e.creatures)),
          "players" in e && i(2, (o = e.players));
      }),
      [
        r,
        s,
        o,
        l,
        (e) => {
          new n.ExtraButtonComponent(e)
            .setIcon(c)
            .setTooltip("Begin Encounter")
            .onClick(() => {
              a("begin-encounter");
            });
        },
        (e) => {
          if (!e) return;
          let t = [];
          return (
            e.hp && t.push(`HP: ${e.hp}`),
            e.ac && t.push(`AC: ${e.ac}`),
            e.modifier && t.push(`MOD: ${e.modifier}`),
            `${t.join(", ")}`
          );
        },
      ]
    );
  }
  const Ve = class extends Te {
      constructor(e) {
        super(),
          Ae(this, e, He, _e, L, { name: 0, creatures: 1, players: 2 }, Oe);
      }
    },
    Re = [];
  const qe = {
    view: (function (e, t = N) {
      let i;
      const n = new Set();
      function a(t) {
        if (L(e, t) && ((e = t), i)) {
          const t = !Re.length;
          for (const t of n) t[1](), Re.push(t, e);
          if (t) {
            for (let e = 0; e < Re.length; e += 2) Re[e][0](Re[e + 1]);
            Re.length = 0;
          }
        }
      }
      return {
        set: a,
        update: function (t) {
          a(t(e));
        },
        subscribe: function (r, s = N) {
          const o = [r, s];
          return (
            n.add(o),
            1 === n.size && (i = t(a) || N),
            r(e),
            () => {
              n.delete(o), 0 === n.size && (i(), (i = null));
            }
          );
        },
      };
    })(),
  };
  function We(e) {
    W(
      e,
      "svelte-g63m31",
      ".buttons.svelte-g63m31.svelte-g63m31{display:flex;justify-content:space-between;padding:0 0 0.5rem 0}.state.svelte-g63m31.svelte-g63m31{display:flex;justify-content:flex-start;align-items:center}.clean.svelte-g63m31.svelte-g63m31{display:flex;justify-content:flex-end;align-items:center}.state.svelte-g63m31>.svelte-g63m31:not(:last-child),.clean.svelte-g63m31>.svelte-g63m31:not(:last-child){margin-right:0.25rem}"
    );
  }
  function Ue(e) {
    let t, i, n, a;
    return {
      c() {
        (t = G("div")), Z(t, "class", "svelte-g63m31");
      },
      m(r, s) {
        U(r, t, s), n || ((a = H((i = e[2].call(null, t)))), (n = !0));
      },
      d(e) {
        e && F(t), (n = !1), a();
      },
    };
  }
  function Fe(e) {
    let t, i, n, a, r, s, o, l, c, d;
    return {
      c() {
        (t = G("div")),
          (n = K()),
          (a = G("div")),
          (s = K()),
          (o = G("div")),
          Z(t, "class", "svelte-g63m31"),
          Z(a, "class", "svelte-g63m31"),
          Z(o, "class", "svelte-g63m31");
      },
      m(u, p) {
        U(u, t, p),
          U(u, n, p),
          U(u, a, p),
          U(u, s, p),
          U(u, o, p),
          c ||
            ((d = [
              H((i = e[3].call(null, t))),
              H((r = e[5].call(null, a))),
              H((l = e[4].call(null, o))),
            ]),
            (c = !0));
      },
      d(e) {
        e && F(t), e && F(n), e && F(a), e && F(s), e && F(o), (c = !1), P(d);
      },
    };
  }
  function Ye(e) {
    let t, i, n, a;
    return {
      c() {
        (t = G("div")), Z(t, "class", "svelte-g63m31");
      },
      m(r, s) {
        U(r, t, s), n || ((a = H((i = e[9].call(null, t)))), (n = !0));
      },
      d(e) {
        e && F(t), (n = !1), a();
      },
    };
  }
  function Ge(e) {
    let t, i, n, a, r, s, o, l, c, d, u, p, h, f, v;
    function m(e, t) {
      return e[0] ? Fe : Ue;
    }
    let g = m(e),
      w = g(e),
      y = e[1] && Ye(e);
    return {
      c() {
        (t = G("div")),
          (i = G("div")),
          w.c(),
          (n = K()),
          (a = G("div")),
          (r = G("div")),
          (o = K()),
          (l = G("div")),
          (d = K()),
          (u = G("div")),
          (h = K()),
          y && y.c(),
          Z(i, "class", "state svelte-g63m31"),
          Z(r, "class", "svelte-g63m31"),
          Z(l, "class", "svelte-g63m31"),
          Z(u, "class", "svelte-g63m31"),
          Z(a, "class", "clean svelte-g63m31"),
          Z(t, "class", "buttons svelte-g63m31");
      },
      m(m, g) {
        U(m, t, g),
          q(t, i),
          w.m(i, null),
          q(t, n),
          q(t, a),
          q(a, r),
          q(a, o),
          q(a, l),
          q(a, d),
          q(a, u),
          q(a, h),
          y && y.m(a, null),
          f ||
            ((v = [
              H((s = e[8].call(null, r))),
              H((c = e[6].call(null, l))),
              H((p = e[7].call(null, u))),
            ]),
            (f = !0));
      },
      p(e, [t]) {
        g !== (g = m(e)) && (w.d(1), (w = g(e)), w && (w.c(), w.m(i, null))),
          e[1]
            ? y || ((y = Ye(e)), y.c(), y.m(a, null))
            : y && (y.d(1), (y = null));
      },
      i: N,
      o: N,
      d(e) {
        e && F(t), w.d(), y && y.d(), (f = !1), P(v);
      },
    };
  }
  function Je(e, t, i) {
    let a,
      { state: r = !1 } = t,
      { map: s = !1 } = t;
    return (
      qe.view.subscribe((e) => {
        a = e;
      }),
      (e.$$set = (e) => {
        "state" in e && i(0, (r = e.state)), "map" in e && i(1, (s = e.map));
      }),
      [
        r,
        s,
        (e) => {
          new n.ExtraButtonComponent(e)
            .setIcon(h)
            .setTooltip("Play")
            .onClick(() => {
              a.toggleState(), i(0, (r = a.state));
            });
        },
        (e) => {
          new n.ExtraButtonComponent(e)
            .setIcon(m)
            .setTooltip("Stop")
            .onClick(() => {
              a.toggleState(), i(0, (r = a.state));
            });
        },
        (e) => {
          new n.ExtraButtonComponent(e)
            .setIcon(f)
            .setTooltip("Next")
            .onClick(() => {
              a.goToNext();
            });
        },
        (e) => {
          new n.ExtraButtonComponent(e)
            .setIcon(v)
            .setTooltip("Previous")
            .onClick(() => {
              a.goToPrevious();
            });
        },
        (e) => {
          new n.ExtraButtonComponent(e)
            .setIcon($)
            .setTooltip("Reset HP & Status")
            .onClick(() => {
              a.resetEncounter();
            });
        },
        (e) => {
          new n.ExtraButtonComponent(e)
            .setIcon(E)
            .setTooltip("New Encounter")
            .onClick(() => {
              a.newEncounter();
            });
        },
        (e) => {
          new n.ExtraButtonComponent(e)
            .setIcon(I)
            .setTooltip("Re-roll Initiatives")
            .onClick(() => {
              a.rollInitiatives();
            });
        },
        (e) => {
          new n.ExtraButtonComponent(e)
            .setIcon(l)
            .setTooltip("Open Leaflet Map")
            .onClick(() => {
              a.openInitiativeView();
            });
        },
      ]
    );
  }
  const Xe = class extends Te {
    constructor(e) {
      super(), Ae(this, e, Je, Ge, L, { state: 0, map: 1 }, We);
    }
  };
  function Ke(e) {
    W(
      e,
      "svelte-r8zdh4",
      ".tag.svelte-r8zdh4{display:flex;align-items:center;padding-right:0px;margin-right:0.125rem}"
    );
  }
  function Qe(e) {
    let t,
      i,
      n,
      a,
      r,
      s,
      o,
      l,
      c,
      d = e[0].name + "";
    return {
      c() {
        (t = G("div")),
          (i = G("span")),
          (n = X(d)),
          (a = K()),
          (r = G("div")),
          Z(t, "class", "tag svelte-r8zdh4"),
          Z(
            t,
            "aria-label",
            (o = e[0].description.length ? e[0].description.join("\n\n") : null)
          ),
          Z(t, "aria-label-classes", "initiative-tracker-condition-tooltip");
      },
      m(o, d) {
        U(o, t, d),
          q(t, i),
          q(i, n),
          q(t, a),
          q(t, r),
          l || ((c = H((s = e[1].call(null, r)))), (l = !0));
      },
      p(e, [i]) {
        1 & i && d !== (d = e[0].name + "") && te(n, d),
          1 & i &&
            o !==
              (o = e[0].description.length
                ? e[0].description.join("\n\n")
                : null) &&
            Z(t, "aria-label", o);
      },
      i: N,
      o: N,
      d(e) {
        e && F(t), (l = !1), c();
      },
    };
  }
  function Ze(e, t, i) {
    const a = se();
    let { status: r } = t;
    return (
      (e.$$set = (e) => {
        "status" in e && i(0, (r = e.status));
      }),
      [
        r,
        (e) => {
          new n.ExtraButtonComponent(e)
            .setIcon("cross-in-box")
            .onClick(() => {
              a("remove");
            })
            .extraSettingsEl.setAttr("style", "margin-left: 3px;");
        },
      ]
    );
  }
  const et = class extends Te {
    constructor(e) {
      super(), Ae(this, e, Ze, Qe, L, { status: 0 }, Ke);
    }
  };
  function tt(e) {
    W(
      e,
      "svelte-8bdvrx",
      '.initiative-tracker-creature.svelte-8bdvrx.svelte-8bdvrx{width:100%;padding:0.5rem 0;display:contents}.initiative-tracker-creature.disabled.svelte-8bdvrx .svelte-8bdvrx{color:var(--text-faint)}.active-holder.svelte-8bdvrx.svelte-8bdvrx{margin-left:-0.5rem}.tree-item-flair-outer.svelte-8bdvrx.svelte-8bdvrx::after{content:""}.initiative-tracker-creature.svelte-8bdvrx .initiative.svelte-8bdvrx{display:block;padding:0;width:20px;text-align:center;white-space:nowrap;margin-left:-0.5rem;user-select:all;border:0;color:inherit}.initiative-tracker-creature.svelte-8bdvrx .name.svelte-8bdvrx{display:block;text-align:left;background-color:inherit;border:0;font-size:smaller;padding:0;height:unset;word-break:keep-all}.statuses.svelte-8bdvrx.svelte-8bdvrx{grid-column:span 4;font-size:smaller;margin-bottom:0.5rem;display:flex;flex-flow:row wrap}.center.svelte-8bdvrx.svelte-8bdvrx{text-align:center}.editable.svelte-8bdvrx.svelte-8bdvrx:not(.player){cursor:pointer}.controls.svelte-8bdvrx.svelte-8bdvrx{display:flex;justify-content:flex-end}.add-button.svelte-8bdvrx.svelte-8bdvrx{display:none}.show.svelte-8bdvrx.svelte-8bdvrx{display:block}'
    );
  }
  function it(e, t, i) {
    const n = e.slice();
    return (n[19] = t[i]), n;
  }
  function nt(e) {
    let t, i;
    return {
      c() {
        (t = J("svg")),
          (i = J("path")),
          Z(i, "fill", "currentColor"),
          Z(
            i,
            "d",
            "M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"
          ),
          Z(i, "class", "svelte-8bdvrx"),
          Z(t, "xmlns", "http://www.w3.org/2000/svg"),
          Z(t, "aria-hidden", "true"),
          Z(t, "focusable", "false"),
          Z(t, "data-prefix", "fas"),
          Z(t, "data-icon", "angle-right"),
          Z(t, "class", "svg-inline--fa fa-angle-right fa-w-8 svelte-8bdvrx"),
          Z(t, "role", "img"),
          Z(t, "viewBox", "0 0 256 512");
      },
      m(e, n) {
        U(e, t, n), q(t, i);
      },
      d(e) {
        e && F(t);
      },
    };
  }
  function at(e) {
    let t,
      i,
      n,
      a,
      r = e[0].name + "";
    return {
      c() {
        (t = G("span")),
          (i = X(r)),
          Z(t, "contenteditable", ""),
          Z(t, "class", "editable name svelte-8bdvrx"),
          Z(t, "type", "text");
      },
      m(r, s) {
        U(r, t, s),
          q(t, i),
          n || ((a = [Q(t, "blur", e[8]), Q(t, "keydown", ht)]), (n = !0));
      },
      p(e, t) {
        1 & t && r !== (r = e[0].name + "") && te(i, r);
      },
      d(e) {
        e && F(t), (n = !1), P(a);
      },
    };
  }
  function rt(e) {
    let t,
      i,
      n = e[0].name + "";
    return {
      c() {
        (t = G("small")), (i = X(n)), Z(t, "class", "name svelte-8bdvrx");
      },
      m(e, n) {
        U(e, t, n), q(t, i);
      },
      p(e, t) {
        1 & t && n !== (n = e[0].name + "") && te(i, n);
      },
      d(e) {
        e && F(t);
      },
    };
  }
  function st(e) {
    let t, i, n, a;
    return {
      c() {
        (t = G("div")),
          Z(t, "class", "add-button enable svelte-8bdvrx"),
          ne(t, "show", !e[1]);
      },
      m(r, s) {
        U(r, t, s), n || ((a = H((i = e[11].call(null, t)))), (n = !0));
      },
      p(e, i) {
        2 & i && ne(t, "show", !e[1]);
      },
      d(e) {
        e && F(t), (n = !1), a();
      },
    };
  }
  function ot(e) {
    let t, i, n, a;
    return {
      c() {
        (t = G("div")),
          Z(t, "class", "add-button enable svelte-8bdvrx"),
          ne(t, "show", !e[1]);
      },
      m(r, s) {
        U(r, t, s), n || ((a = H((i = e[12].call(null, t)))), (n = !0));
      },
      p(e, i) {
        2 & i && ne(t, "show", !e[1]);
      },
      d(e) {
        e && F(t), (n = !1), a();
      },
    };
  }
  function lt(e) {
    let t, i, n, a;
    return {
      c() {
        (t = G("div")),
          Z(t, "class", "add-button marker svelte-8bdvrx"),
          ne(t, "show", !e[1]);
      },
      m(r, s) {
        U(r, t, s), n || ((a = H((i = e[13].call(null, t)))), (n = !0));
      },
      p(e, i) {
        2 & i && ne(t, "show", !e[1]);
      },
      d(e) {
        e && F(t), (n = !1), a();
      },
    };
  }
  function ct(e) {
    let t, i;
    return (
      (t = new et({ props: { status: e[19] } })),
      t.$on("remove", function () {
        return e[18](e[19]);
      }),
      {
        c() {
          $e(t.$$.fragment);
        },
        m(e, n) {
          Ee(t, e, n), (i = !0);
        },
        p(i, n) {
          e = i;
          const a = {};
          64 & n && (a.status = e[19]), t.$set(a);
        },
        i(e) {
          i || (Ce(t.$$.fragment, e), (i = !0));
        },
        o(e) {
          Se(t.$$.fragment, e), (i = !1);
        },
        d(e) {
          Ie(t, e);
        },
      }
    );
  }
  function dt(e) {
    let t,
      i,
      n,
      a,
      s,
      o,
      l,
      c,
      d,
      u,
      p,
      h,
      f,
      v,
      m,
      g,
      w,
      y,
      b,
      x,
      k,
      C,
      S,
      $,
      E,
      I,
      A,
      T,
      O,
      j,
      M,
      N,
      D,
      z,
      B,
      L,
      _ = e[0].hpDisplay + "",
      V = (e[0].ac ?? r) + "",
      R = e[2] && e[3] && nt();
    function W(e, t) {
      return e[0].player ? rt : at;
    }
    let J = W(e),
      ee = J(e);
    function ie(e, t) {
      return e[0].enabled ? ot : st;
    }
    let ae = ie(e),
      re = ae(e),
      se = e[4].plugin.data.leafletIntegration && lt(e),
      oe = e[6],
      le = [];
    for (let t = 0; t < oe.length; t += 1) le[t] = ct(it(e, oe, t));
    const ce = (e) =>
      Se(le[e], 1, 1, () => {
        le[e] = null;
      });
    return {
      c() {
        (t = G("div")),
          (i = G("span")),
          R && R.c(),
          (n = K()),
          (a = G("div")),
          (s = G("input")),
          (c = K()),
          ee.c(),
          (d = K()),
          (u = G("div")),
          (p = G("span")),
          (h = X(_)),
          (f = K()),
          (v = G("span")),
          (m = X(V)),
          (g = K()),
          (w = G("div")),
          (y = G("div")),
          (x = K()),
          (k = G("div")),
          (S = K()),
          re.c(),
          ($ = K()),
          se && se.c(),
          (E = K()),
          (I = G("div")),
          (T = K()),
          (O = G("span")),
          (j = K()),
          (M = G("span")),
          (N = K()),
          (D = G("div"));
        for (let e = 0; e < le.length; e += 1) le[e].c();
        Z(i, "class", "active-holder svelte-8bdvrx"),
          Z(s, "class", "editable initiative tree-item-flair svelte-8bdvrx"),
          Z(
            s,
            "aria-label",
            (o = `${e[0].initiative - e[0].modifier} + ${e[0].modifier}`)
          ),
          (s.value = l = e[0].initiative),
          Z(a, "class", "tree-item-flair-outer svelte-8bdvrx"),
          Z(p, "class", "editable svelte-8bdvrx"),
          Z(u, "class", "center svelte-8bdvrx"),
          Z(v, "class", "center svelte-8bdvrx"),
          Z(y, "class", "add-button icon svelte-8bdvrx"),
          ne(y, "show", e[1]),
          Z(k, "class", "add-button tags svelte-8bdvrx"),
          ne(k, "show", !e[1]),
          Z(I, "class", "add-button delete svelte-8bdvrx"),
          ne(I, "show", !e[1]),
          Z(w, "class", "controls svelte-8bdvrx"),
          Z(O, "class", "svelte-8bdvrx"),
          Z(M, "class", "svelte-8bdvrx"),
          Z(D, "class", "statuses svelte-8bdvrx"),
          Z(t, "class", "initiative-tracker-creature svelte-8bdvrx"),
          ne(t, "disabled", !e[0].enabled);
      },
      m(r, o) {
        U(r, t, o),
          q(t, i),
          R && R.m(i, null),
          q(t, n),
          q(t, a),
          q(a, s),
          e[16](s),
          q(t, c),
          ee.m(t, null),
          q(t, d),
          q(t, u),
          q(u, p),
          q(p, h),
          q(t, f),
          q(t, v),
          q(v, m),
          q(t, g),
          q(t, w),
          q(w, y),
          q(w, x),
          q(w, k),
          q(w, S),
          re.m(w, null),
          q(w, $),
          se && se.m(w, null),
          q(w, E),
          q(w, I),
          q(t, T),
          q(t, O),
          q(t, j),
          q(t, M),
          q(t, N),
          q(t, D);
        for (let e = 0; e < le.length; e += 1) le[e].m(D, null);
        (z = !0),
          B ||
            ((L = [
              Q(s, "click", ut),
              Q(s, "blur", e[15]),
              Q(s, "keydown", pt),
              Q(p, "click", e[17]),
              H((b = e[14].call(null, y))),
              H((C = e[10].call(null, k))),
              H((A = e[9].call(null, I))),
            ]),
            (B = !0));
      },
      p(e, [n]) {
        if (
          (e[2] && e[3]
            ? R || ((R = nt()), R.c(), R.m(i, null))
            : R && (R.d(1), (R = null)),
          (!z ||
            (1 & n &&
              o !==
                (o = `${e[0].initiative - e[0].modifier} + ${
                  e[0].modifier
                }`))) &&
            Z(s, "aria-label", o),
          (!z || (1 & n && l !== (l = e[0].initiative) && s.value !== l)) &&
            (s.value = l),
          J === (J = W(e)) && ee
            ? ee.p(e, n)
            : (ee.d(1), (ee = J(e)), ee && (ee.c(), ee.m(t, d))),
          (!z || 1 & n) && _ !== (_ = e[0].hpDisplay + "") && te(h, _),
          (!z || 1 & n) && V !== (V = (e[0].ac ?? r) + "") && te(m, V),
          2 & n && ne(y, "show", e[1]),
          2 & n && ne(k, "show", !e[1]),
          ae === (ae = ie(e)) && re
            ? re.p(e, n)
            : (re.d(1), (re = ae(e)), re && (re.c(), re.m(w, $))),
          e[4].plugin.data.leafletIntegration
            ? se
              ? se.p(e, n)
              : ((se = lt(e)), se.c(), se.m(w, E))
            : se && (se.d(1), (se = null)),
          2 & n && ne(I, "show", !e[1]),
          81 & n)
        ) {
          let t;
          for (oe = e[6], t = 0; t < oe.length; t += 1) {
            const i = it(e, oe, t);
            le[t]
              ? (le[t].p(i, n), Ce(le[t], 1))
              : ((le[t] = ct(i)), le[t].c(), Ce(le[t], 1), le[t].m(D, null));
          }
          for (xe(), t = oe.length; t < le.length; t += 1) ce(t);
          ke();
        }
        1 & n && ne(t, "disabled", !e[0].enabled);
      },
      i(e) {
        if (!z) {
          for (let e = 0; e < oe.length; e += 1) Ce(le[e]);
          z = !0;
        }
      },
      o(e) {
        le = le.filter(Boolean);
        for (let e = 0; e < le.length; e += 1) Se(le[e]);
        z = !1;
      },
      d(i) {
        i && F(t),
          R && R.d(),
          e[16](null),
          ee.d(),
          re.d(),
          se && se.d(),
          Y(le, i),
          (B = !1),
          P(L);
      },
    };
  }
  const ut = function (e) {
      this.select();
    },
    pt = function (e) {
      return "Enter" === e.key || "Tab" === e.key
        ? (e.preventDefault(), void this.blur())
        : /^(\d*\.?\d*|Backspace|Delete|Arrow\w+)$/.test(e.key)
        ? void 0
        : (e.preventDefault(), !1);
    },
    ht = function (e) {
      if ("Enter" === e.key || "Tab" === e.key)
        return e.preventDefault(), void this.blur();
    };
  function ft(e, t, i) {
    let a,
      { creature: r } = t,
      { show: s } = t,
      { state: o } = t;
    const l = se();
    let c;
    qe.view.subscribe((e) => {
      i(4, (c = e));
    });
    let d,
      { active: u = !1 } = t;
    var h;
    return (
      (h = () => {
        i(5, (d.value = `${r.initiative}`), d);
      }),
      re().$$.after_update.push(h),
      (e.$$set = (e) => {
        "creature" in e && i(0, (r = e.creature)),
          "show" in e && i(1, (s = e.show)),
          "state" in e && i(2, (o = e.state)),
          "active" in e && i(3, (u = e.active));
      }),
      (e.$$.update = () => {
        1 & e.$$.dirty && i(6, (a = Array.from(r.status)));
      }),
      [
        r,
        s,
        o,
        u,
        c,
        d,
        a,
        l,
        (e) => {
          c.updateCreature(r, { name: e.target.textContent });
        },
        (e) => {
          new n.ExtraButtonComponent(e)
            .setTooltip("Remove")
            .setIcon(p)
            .onClick(() => {
              c.removeCreature(r);
            });
        },
        (e) => {
          new n.ExtraButtonComponent(e)
            .setTooltip("Add Status")
            .setIcon(C)
            .onClick(() => {
              l("tag", r);
            });
        },
        (e) => {
          new n.ExtraButtonComponent(e)
            .setTooltip("Enable")
            .setIcon(x)
            .onClick(() => {
              c.setCreatureState(r, !0);
            });
        },
        (e) => {
          new n.ExtraButtonComponent(e)
            .setTooltip("Disable")
            .setIcon(b)
            .onClick(() => {
              c.setCreatureState(r, !1);
            });
        },
        (e) => {
          new n.ExtraButtonComponent(e).setTooltip(
            "Change Marker"
          ).extraSettingsEl.onclick = (e) => {
            const t = new n.Menu(c.plugin.app);
            t.setNoIcon();
            for (let e of c.plugin.leaflet.markerIcons)
              t.addItem((t) => {
                t.setTitle(e.type),
                  t.onClick(() => {
                    c.updateCreature(r, { marker: e.type });
                  });
              });
            t.showAtPosition({ x: e.clientX, y: e.clientY });
          };
        },
        (e) => {
          new n.ExtraButtonComponent(e)
            .setIcon(y)
            .setTooltip("Actions").extraSettingsEl.onclick = (e) => {
            const t = new n.Menu(c.plugin.app);
            t.addItem((e) => {
              e.setIcon(C)
                .setTitle("Add Status")
                .onClick(() => {
                  l("tag", r);
                });
            }),
              r.enabled
                ? t.addItem((e) => {
                    e.setIcon(b)
                      .setTitle("Disable")
                      .onClick(() => {
                        c.setCreatureState(r, !1);
                      });
                  })
                : t.addItem((e) => {
                    e.setIcon(x)
                      .setTitle("Enable")
                      .onClick(() => {
                        c.setCreatureState(r, !0);
                      });
                  }),
              c.plugin.data.leafletIntegration &&
                t.addItem((e) => {
                  e.setTitle("Change Marker").onClick((e) => {
                    const t = new n.Menu(c.plugin.app);
                    t.setNoIcon();
                    for (let e of c.plugin.leaflet.markerIcons)
                      t.addItem((t) => {
                        t.setTitle(e.type),
                          t.onClick(() => {
                            c.updateCreature(r, { marker: e.type });
                          });
                      });
                    t.showAtMouseEvent(e);
                  });
                }),
              t.addItem((e) => {
                e.setIcon(p)
                  .setTitle("Remove")
                  .onClick(() => {
                    c.removeCreature(r);
                  });
              }),
              t.showAtPosition(e);
          };
        },
        function (e) {
          const t = this.value;
          if (isNaN(Number(t)) || Number(t) < 1)
            return (
              new n.Notice("Enter a valid initiative."),
              void (this.value = `${r.initiative}`)
            );
          r.initiative != Number(t) && c.updateCreature(r, { initiative: t });
        },
        function (e) {
          le[e ? "unshift" : "push"](() => {
            (d = e), i(5, d);
          });
        },
        () => {
          l("hp", r);
        },
        (e) => {
          c.removeStatus(r, e);
        },
      ]
    );
  }
  const vt = class extends Te {
    constructor(e) {
      super(),
        Ae(
          this,
          e,
          ft,
          dt,
          L,
          { creature: 0, show: 1, state: 2, active: 3 },
          tt
        );
    }
  };
  function mt(e) {
    W(
      e,
      "svelte-19yavkh",
      ".no-creatures.svelte-19yavkh{margin:1rem;text-align:center}.initiative-tracker-table.svelte-19yavkh{padding:0.5rem;display:grid;grid-template-columns:0rem auto /* 12px */ 1fr auto auto auto;align-items:center;gap:0 0.5rem;width:100%;margin-left:0rem}.left.svelte-19yavkh{text-align:left}.center.svelte-19yavkh{text-align:center}.tracker-table-header.svelte-19yavkh{display:contents;font-weight:bolder}"
    );
  }
  function gt(e, t, i) {
    const n = e.slice();
    return (n[11] = t[i]), n;
  }
  function wt(e) {
    let t;
    return {
      c() {
        (t = G("div")),
          (t.innerHTML =
            "<p>Add a creature to get started!</p> \n            <small>Players may be created in settings.</small>"),
          Z(t, "class", "no-creatures svelte-19yavkh");
      },
      m(e, i) {
        U(e, t, i);
      },
      p: N,
      i: N,
      o: N,
      d(e) {
        e && F(t);
      },
    };
  }
  function yt(e) {
    let t,
      i,
      n,
      a,
      r,
      s,
      o,
      l,
      c,
      d,
      u,
      p,
      h,
      f,
      v,
      m,
      g,
      w,
      y,
      b = e[0],
      x = [];
    for (let t = 0; t < b.length; t += 1) x[t] = bt(gt(e, b, t));
    const k = (e) =>
      Se(x[e], 1, 1, () => {
        x[e] = null;
      });
    return {
      c() {
        (t = G("div")),
          (i = G("div")),
          (n = G("span")),
          (a = K()),
          (r = G("span")),
          (s = K()),
          (o = G("span")),
          (o.textContent = "Name"),
          (l = K()),
          (c = G("span")),
          (u = K()),
          (p = G("span")),
          (f = K()),
          (v = G("span")),
          (m = K());
        for (let e = 0; e < x.length; e += 1) x[e].c();
        Z(o, "class", "left svelte-19yavkh"),
          Z(c, "class", "center svelte-19yavkh"),
          Z(p, "class", "center svelte-19yavkh"),
          Z(i, "class", "tracker-table-header svelte-19yavkh"),
          Z(t, "class", "initiative-tracker-table svelte-19yavkh");
      },
      m(b, k) {
        U(b, t, k),
          q(t, i),
          q(i, n),
          q(i, a),
          q(i, r),
          q(i, s),
          q(i, o),
          q(i, l),
          q(i, c),
          q(i, u),
          q(i, p),
          q(i, f),
          q(i, v),
          q(t, m);
        for (let e = 0; e < x.length; e += 1) x[e].m(t, null);
        e[10](t),
          (g = !0),
          w ||
            ((y = [H((d = e[6].call(null, c))), H((h = e[7].call(null, p)))]),
            (w = !0));
      },
      p(e, i) {
        if (47 & i) {
          let n;
          for (b = e[0], n = 0; n < b.length; n += 1) {
            const a = gt(e, b, n);
            x[n]
              ? (x[n].p(a, i), Ce(x[n], 1))
              : ((x[n] = bt(a)), x[n].c(), Ce(x[n], 1), x[n].m(t, null));
          }
          for (xe(), n = b.length; n < x.length; n += 1) k(n);
          ke();
        }
      },
      i(e) {
        if (!g) {
          for (let e = 0; e < b.length; e += 1) Ce(x[e]);
          g = !0;
        }
      },
      o(e) {
        x = x.filter(Boolean);
        for (let e = 0; e < x.length; e += 1) Se(x[e]);
        g = !1;
      },
      d(i) {
        i && F(t), Y(x, i), e[10](null), (w = !1), P(y);
      },
    };
  }
  function bt(e) {
    let t, i;
    return (
      (t = new vt({
        props: {
          creature: e[11],
          show: e[1],
          state: e[2],
          active: e[0][e[3]] == e[11],
        },
      })),
      t.$on("hp", e[8]),
      t.$on("tag", e[9]),
      {
        c() {
          $e(t.$$.fragment);
        },
        m(e, n) {
          Ee(t, e, n), (i = !0);
        },
        p(e, i) {
          const n = {};
          1 & i && (n.creature = e[11]),
            2 & i && (n.show = e[1]),
            4 & i && (n.state = e[2]),
            9 & i && (n.active = e[0][e[3]] == e[11]),
            t.$set(n);
        },
        i(e) {
          i || (Ce(t.$$.fragment, e), (i = !0));
        },
        o(e) {
          Se(t.$$.fragment, e), (i = !1);
        },
        d(e) {
          Ie(t, e);
        },
      }
    );
  }
  function xt(e) {
    let t, i, n, a;
    const r = [yt, wt],
      s = [];
    function o(e, t) {
      return e[0].length ? 0 : 1;
    }
    return (
      (i = o(e)),
      (n = s[i] = r[i](e)),
      {
        c() {
          (t = G("div")), n.c();
        },
        m(e, n) {
          U(e, t, n), s[i].m(t, null), (a = !0);
        },
        p(e, [a]) {
          let l = i;
          (i = o(e)),
            i === l
              ? s[i].p(e, a)
              : (xe(),
                Se(s[l], 1, 1, () => {
                  s[l] = null;
                }),
                ke(),
                (n = s[i]),
                n ? n.p(e, a) : ((n = s[i] = r[i](e)), n.c()),
                Ce(n, 1),
                n.m(t, null));
        },
        i(e) {
          a || (Ce(n), (a = !0));
        },
        o(e) {
          Se(n), (a = !1);
        },
        d(e) {
          e && F(t), s[i].d();
        },
      }
    );
  }
  function kt(e, t, i) {
    const a = se();
    let r,
      { creatures: s = [] } = t,
      { show: o = !1 } = t,
      { state: l } = t,
      { current: c } = t;
    return (
      (e.$$set = (e) => {
        "creatures" in e && i(0, (s = e.creatures)),
          "show" in e && i(1, (o = e.show)),
          "state" in e && i(2, (l = e.state)),
          "current" in e && i(3, (c = e.current));
      }),
      [
        s,
        o,
        l,
        c,
        r,
        a,
        (e) => {
          (0, n.setIcon)(e, g);
        },
        (e) => {
          (0, n.setIcon)(e, w);
        },
        (e) => a("update-hp", e.detail),
        (e) => a("update-tags", e.detail),
        function (e) {
          le[e ? "unshift" : "push"](() => {
            (r = e), i(4, r);
          });
        },
      ]
    );
  }
  const Ct = class extends Te {
    constructor(e) {
      super(),
        Ae(
          this,
          e,
          kt,
          xt,
          L,
          { creatures: 0, show: 1, state: 2, current: 3 },
          mt
        );
    }
  };
  function St(e) {
    W(
      e,
      "svelte-1rjv45j",
      ".create-new.svelte-1rjv45j>.svelte-1rjv45j{display:grid;grid-template-columns:33% 66%;margin-bottom:0.5rem}.context-buttons.svelte-1rjv45j.svelte-1rjv45j{display:flex;justify-content:flex-end;align-items:center;grid-gap:0.125rem}.cancel-button.svelte-1rjv45j.svelte-1rjv45j{color:var(--text-faint)}.initiative.svelte-1rjv45j.svelte-1rjv45j{position:relative}.initiative.svelte-1rjv45j>.dice.svelte-1rjv45j{position:absolute;right:0.25rem;top:50%;transform:translateY(-50%)}"
    );
  }
  function $t(e) {
    let t,
      i,
      n,
      a,
      r,
      s,
      o,
      l,
      c,
      d,
      u,
      p,
      h,
      f,
      v,
      m,
      g,
      w,
      y,
      b,
      x,
      k,
      C,
      S,
      $,
      E,
      I,
      A,
      T,
      O,
      j,
      M,
      D,
      z,
      B,
      L,
      _;
    return {
      c() {
        (t = G("div")),
          (i = G("div")),
          (n = G("label")),
          (n.textContent = "Name"),
          (a = K()),
          (r = G("input")),
          (s = K()),
          (o = G("div")),
          (l = G("label")),
          (l.textContent = "HP"),
          (c = K()),
          (d = G("input")),
          (u = K()),
          (p = G("div")),
          (h = G("label")),
          (h.textContent = "AC"),
          (f = K()),
          (v = G("input")),
          (m = K()),
          (g = G("div")),
          (w = G("label")),
          (w.textContent = "Modifier"),
          (y = K()),
          (b = G("input")),
          (x = K()),
          (k = G("div")),
          (C = G("label")),
          (C.textContent = "Initiative"),
          (S = K()),
          ($ = G("input")),
          (E = K()),
          (I = G("div")),
          (T = K()),
          (O = G("div")),
          (j = G("div")),
          (D = K()),
          (z = G("div")),
          Z(n, "for", "add-name"),
          Z(r, "id", "add-name"),
          Z(r, "type", "text"),
          Z(r, "name", "name"),
          Z(r, "tabindex", "0"),
          Z(i, "class", "svelte-1rjv45j"),
          Z(l, "for", "add-hp"),
          Z(d, "id", "add-hp"),
          Z(d, "type", "number"),
          Z(d, "name", "hp"),
          Z(d, "tabindex", "0"),
          Z(o, "class", "svelte-1rjv45j"),
          Z(h, "for", "add-ac"),
          Z(v, "id", "add-ac"),
          Z(v, "type", "number"),
          Z(v, "name", "ac"),
          Z(v, "tabindex", "0"),
          Z(p, "class", "svelte-1rjv45j"),
          Z(w, "for", "add-mod"),
          Z(b, "id", "add-mod"),
          Z(b, "type", "number"),
          Z(b, "name", "ac"),
          Z(b, "tabindex", "0"),
          Z(g, "class", "svelte-1rjv45j"),
          Z(C, "for", "add-init"),
          Z($, "id", "add-init"),
          Z($, "type", "number"),
          Z($, "name", "initiative"),
          Z($, "tabindex", "0"),
          Z(I, "class", "dice svelte-1rjv45j"),
          Z(k, "class", "initiative svelte-1rjv45j"),
          Z(t, "class", "create-new svelte-1rjv45j"),
          Z(j, "class", "add-button"),
          Z(z, "class", "add-button cancel-button svelte-1rjv45j"),
          Z(O, "class", "context-buttons svelte-1rjv45j");
      },
      m(N, P) {
        U(N, t, P),
          q(t, i),
          q(i, n),
          q(i, a),
          q(i, r),
          ie(r, e[0]),
          q(t, s),
          q(t, o),
          q(o, l),
          q(o, c),
          q(o, d),
          ie(d, e[1]),
          q(t, u),
          q(t, p),
          q(p, h),
          q(p, f),
          q(p, v),
          ie(v, e[3]),
          q(t, m),
          q(t, g),
          q(g, w),
          q(g, y),
          q(g, b),
          ie(b, e[4]),
          q(t, x),
          q(t, k),
          q(k, C),
          q(k, S),
          q(k, $),
          ie($, e[2]),
          q(k, E),
          q(k, I),
          U(N, T, P),
          U(N, O, P),
          q(O, j),
          q(O, D),
          q(O, z),
          L ||
            ((_ = [
              Q(r, "input", e[8]),
              Q(d, "input", e[9]),
              Q(v, "input", e[10]),
              Q(b, "input", e[11]),
              Q($, "input", e[12]),
              H((A = e[7].call(null, I))),
              H((M = e[5].call(null, j))),
              H((B = e[6].call(null, z))),
            ]),
            (L = !0));
      },
      p(e, [t]) {
        1 & t && r.value !== e[0] && ie(r, e[0]),
          2 & t && ee(d.value) !== e[1] && ie(d, e[1]),
          8 & t && ee(v.value) !== e[3] && ie(v, e[3]),
          16 & t && ee(b.value) !== e[4] && ie(b, e[4]),
          4 & t && ee($.value) !== e[2] && ie($, e[2]);
      },
      i: N,
      o: N,
      d(e) {
        e && F(t), e && F(T), e && F(O), (L = !1), P(_);
      },
    };
  }
  function Et(e, t, a) {
    const r = se();
    let s, o, l, c, u, p, h;
    function f(e = 0) {
      return i(this, void 0, void 0, function* () {
        let t = Math.floor(19 * Math.random() + 1) + e;
        return (
          console.log(s.plugin),
          s.plugin.canUseDiceRoller &&
            (t = (yield s.plugin.app.plugins.plugins[
              "obsidian-dice-roller"
            ].parseDice(s.plugin.data.initiative.replace(/%mod%/g, `(${e})`)))
              .result),
          t
        );
      });
    }
    return (
      qe.view.subscribe((e) => (s = e)),
      [
        o,
        l,
        c,
        u,
        p,
        (e) => {
          new n.ExtraButtonComponent(e)
            .setTooltip("Add Creature")
            .setIcon(d)
            .onClick(() => {
              o && o.length
                ? (p || a(4, (p = 0)),
                  c
                    ? r("save", {
                        name: o,
                        hp: l,
                        initiative: c,
                        ac: u,
                        modifier: p,
                        player: h,
                      })
                    : f(p).then((e) => {
                        r("save", {
                          name: o,
                          hp: l,
                          initiative: e,
                          ac: u,
                          modifier: p,
                          player: h,
                        });
                      }))
                : new n.Notice("Enter a name!");
            });
        },
        (e) => {
          new n.ExtraButtonComponent(e)
            .setTooltip("Cancel")
            .setIcon("cross")
            .onClick(() => {
              r("cancel");
            });
        },
        (e) => {
          new n.ExtraButtonComponent(e)
            .setIcon(I)
            .setTooltip("Roll Initiative")
            .onClick(() => {
              f(null != p ? p : 0).then((e) => {
                a(2, (c = e));
              });
            });
        },
        function () {
          (o = this.value), a(0, o);
        },
        function () {
          (l = ee(this.value)), a(1, l);
        },
        function () {
          (u = ee(this.value)), a(3, u);
        },
        function () {
          (p = ee(this.value)), a(4, p);
        },
        function () {
          (c = ee(this.value)), a(2, c);
        },
      ]
    );
  }
  const It = class extends Te {
    constructor(e) {
      super(), Ae(this, e, Et, $t, L, {}, St);
    }
  };
  function At(e) {
    if (null == e) return window;
    if ("[object Window]" !== e.toString()) {
      var t = e.ownerDocument;
      return (t && t.defaultView) || window;
    }
    return e;
  }
  function Tt(e) {
    return e instanceof At(e).Element || e instanceof Element;
  }
  function Ot(e) {
    return e instanceof At(e).HTMLElement || e instanceof HTMLElement;
  }
  function jt(e) {
    return (
      "undefined" != typeof ShadowRoot &&
      (e instanceof At(e).ShadowRoot || e instanceof ShadowRoot)
    );
  }
  var Mt = Math.round;
  function Nt(e, t) {
    void 0 === t && (t = !1);
    var i = e.getBoundingClientRect(),
      n = 1,
      a = 1;
    if (Ot(e) && t) {
      var r = e.offsetHeight,
        s = e.offsetWidth;
      s > 0 && (n = i.width / s || 1), r > 0 && (a = i.height / r || 1);
    }
    return {
      width: Mt(i.width / n),
      height: Mt(i.height / a),
      top: Mt(i.top / a),
      right: Mt(i.right / n),
      bottom: Mt(i.bottom / a),
      left: Mt(i.left / n),
      x: Mt(i.left / n),
      y: Mt(i.top / a),
    };
  }
  function Dt(e) {
    var t = At(e);
    return { scrollLeft: t.pageXOffset, scrollTop: t.pageYOffset };
  }
  function zt(e) {
    return e ? (e.nodeName || "").toLowerCase() : null;
  }
  function Pt(e) {
    return ((Tt(e) ? e.ownerDocument : e.document) || window.document)
      .documentElement;
  }
  function Bt(e) {
    return Nt(Pt(e)).left + Dt(e).scrollLeft;
  }
  function Lt(e) {
    return At(e).getComputedStyle(e);
  }
  function _t(e) {
    var t = Lt(e),
      i = t.overflow,
      n = t.overflowX,
      a = t.overflowY;
    return /auto|scroll|overlay|hidden/.test(i + a + n);
  }
  function Ht(e, t, i) {
    void 0 === i && (i = !1);
    var n,
      a,
      r = Ot(t),
      s =
        Ot(t) &&
        (function (e) {
          var t = e.getBoundingClientRect(),
            i = t.width / e.offsetWidth || 1,
            n = t.height / e.offsetHeight || 1;
          return 1 !== i || 1 !== n;
        })(t),
      o = Pt(t),
      l = Nt(e, s),
      c = { scrollLeft: 0, scrollTop: 0 },
      d = { x: 0, y: 0 };
    return (
      (r || (!r && !i)) &&
        (("body" !== zt(t) || _t(o)) &&
          (c =
            (n = t) !== At(n) && Ot(n)
              ? { scrollLeft: (a = n).scrollLeft, scrollTop: a.scrollTop }
              : Dt(n)),
        Ot(t)
          ? (((d = Nt(t, !0)).x += t.clientLeft), (d.y += t.clientTop))
          : o && (d.x = Bt(o))),
      {
        x: l.left + c.scrollLeft - d.x,
        y: l.top + c.scrollTop - d.y,
        width: l.width,
        height: l.height,
      }
    );
  }
  function Vt(e) {
    var t = Nt(e),
      i = e.offsetWidth,
      n = e.offsetHeight;
    return (
      Math.abs(t.width - i) <= 1 && (i = t.width),
      Math.abs(t.height - n) <= 1 && (n = t.height),
      { x: e.offsetLeft, y: e.offsetTop, width: i, height: n }
    );
  }
  function Rt(e) {
    return "html" === zt(e)
      ? e
      : e.assignedSlot || e.parentNode || (jt(e) ? e.host : null) || Pt(e);
  }
  function qt(e) {
    return ["html", "body", "#document"].indexOf(zt(e)) >= 0
      ? e.ownerDocument.body
      : Ot(e) && _t(e)
      ? e
      : qt(Rt(e));
  }
  function Wt(e, t) {
    var i;
    void 0 === t && (t = []);
    var n = qt(e),
      a = n === (null == (i = e.ownerDocument) ? void 0 : i.body),
      r = At(n),
      s = a ? [r].concat(r.visualViewport || [], _t(n) ? n : []) : n,
      o = t.concat(s);
    return a ? o : o.concat(Wt(Rt(s)));
  }
  function Ut(e) {
    return ["table", "td", "th"].indexOf(zt(e)) >= 0;
  }
  function Ft(e) {
    return Ot(e) && "fixed" !== Lt(e).position ? e.offsetParent : null;
  }
  function Yt(e) {
    for (var t = At(e), i = Ft(e); i && Ut(i) && "static" === Lt(i).position; )
      i = Ft(i);
    return i &&
      ("html" === zt(i) || ("body" === zt(i) && "static" === Lt(i).position))
      ? t
      : i ||
          (function (e) {
            var t = -1 !== navigator.userAgent.toLowerCase().indexOf("firefox");
            if (
              -1 !== navigator.userAgent.indexOf("Trident") &&
              Ot(e) &&
              "fixed" === Lt(e).position
            )
              return null;
            for (
              var i = Rt(e);
              Ot(i) && ["html", "body"].indexOf(zt(i)) < 0;

            ) {
              var n = Lt(i);
              if (
                "none" !== n.transform ||
                "none" !== n.perspective ||
                "paint" === n.contain ||
                -1 !== ["transform", "perspective"].indexOf(n.willChange) ||
                (t && "filter" === n.willChange) ||
                (t && n.filter && "none" !== n.filter)
              )
                return i;
              i = i.parentNode;
            }
            return null;
          })(e) ||
          t;
  }
  var Gt = "top",
    Jt = "bottom",
    Xt = "right",
    Kt = "left",
    Qt = "auto",
    Zt = [Gt, Jt, Xt, Kt],
    ei = "start",
    ti = "end",
    ii = "viewport",
    ni = "popper",
    ai = Zt.reduce(function (e, t) {
      return e.concat([t + "-" + ei, t + "-" + ti]);
    }, []),
    ri = [].concat(Zt, [Qt]).reduce(function (e, t) {
      return e.concat([t, t + "-" + ei, t + "-" + ti]);
    }, []),
    si = [
      "beforeRead",
      "read",
      "afterRead",
      "beforeMain",
      "main",
      "afterMain",
      "beforeWrite",
      "write",
      "afterWrite",
    ];
  function oi(e) {
    var t = new Map(),
      i = new Set(),
      n = [];
    function a(e) {
      i.add(e.name),
        []
          .concat(e.requires || [], e.requiresIfExists || [])
          .forEach(function (e) {
            if (!i.has(e)) {
              var n = t.get(e);
              n && a(n);
            }
          }),
        n.push(e);
    }
    return (
      e.forEach(function (e) {
        t.set(e.name, e);
      }),
      e.forEach(function (e) {
        i.has(e.name) || a(e);
      }),
      n
    );
  }
  var li = { placement: "bottom", modifiers: [], strategy: "absolute" };
  function ci() {
    for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++)
      t[i] = arguments[i];
    return !t.some(function (e) {
      return !(e && "function" == typeof e.getBoundingClientRect);
    });
  }
  function di(e) {
    void 0 === e && (e = {});
    var t = e,
      i = t.defaultModifiers,
      n = void 0 === i ? [] : i,
      a = t.defaultOptions,
      r = void 0 === a ? li : a;
    return function (e, t, i) {
      void 0 === i && (i = r);
      var a,
        s,
        o = {
          placement: "bottom",
          orderedModifiers: [],
          options: Object.assign({}, li, r),
          modifiersData: {},
          elements: { reference: e, popper: t },
          attributes: {},
          styles: {},
        },
        l = [],
        c = !1,
        d = {
          state: o,
          setOptions: function (i) {
            var a = "function" == typeof i ? i(o.options) : i;
            u(),
              (o.options = Object.assign({}, r, o.options, a)),
              (o.scrollParents = {
                reference: Tt(e)
                  ? Wt(e)
                  : e.contextElement
                  ? Wt(e.contextElement)
                  : [],
                popper: Wt(t),
              });
            var s,
              c,
              p = (function (e) {
                var t = oi(e);
                return si.reduce(function (e, i) {
                  return e.concat(
                    t.filter(function (e) {
                      return e.phase === i;
                    })
                  );
                }, []);
              })(
                ((s = [].concat(n, o.options.modifiers)),
                (c = s.reduce(function (e, t) {
                  var i = e[t.name];
                  return (
                    (e[t.name] = i
                      ? Object.assign({}, i, t, {
                          options: Object.assign({}, i.options, t.options),
                          data: Object.assign({}, i.data, t.data),
                        })
                      : t),
                    e
                  );
                }, {})),
                Object.keys(c).map(function (e) {
                  return c[e];
                }))
              );
            return (
              (o.orderedModifiers = p.filter(function (e) {
                return e.enabled;
              })),
              o.orderedModifiers.forEach(function (e) {
                var t = e.name,
                  i = e.options,
                  n = void 0 === i ? {} : i,
                  a = e.effect;
                if ("function" == typeof a) {
                  var r = a({ state: o, name: t, instance: d, options: n });
                  l.push(r || function () {});
                }
              }),
              d.update()
            );
          },
          forceUpdate: function () {
            if (!c) {
              var e = o.elements,
                t = e.reference,
                i = e.popper;
              if (ci(t, i)) {
                (o.rects = {
                  reference: Ht(t, Yt(i), "fixed" === o.options.strategy),
                  popper: Vt(i),
                }),
                  (o.reset = !1),
                  (o.placement = o.options.placement),
                  o.orderedModifiers.forEach(function (e) {
                    return (o.modifiersData[e.name] = Object.assign(
                      {},
                      e.data
                    ));
                  });
                for (var n = 0; n < o.orderedModifiers.length; n++)
                  if (!0 !== o.reset) {
                    var a = o.orderedModifiers[n],
                      r = a.fn,
                      s = a.options,
                      l = void 0 === s ? {} : s,
                      u = a.name;
                    "function" == typeof r &&
                      (o =
                        r({ state: o, options: l, name: u, instance: d }) || o);
                  } else (o.reset = !1), (n = -1);
              }
            }
          },
          update:
            ((a = function () {
              return new Promise(function (e) {
                d.forceUpdate(), e(o);
              });
            }),
            function () {
              return (
                s ||
                  (s = new Promise(function (e) {
                    Promise.resolve().then(function () {
                      (s = void 0), e(a());
                    });
                  })),
                s
              );
            }),
          destroy: function () {
            u(), (c = !0);
          },
        };
      if (!ci(e, t)) return d;
      function u() {
        l.forEach(function (e) {
          return e();
        }),
          (l = []);
      }
      return (
        d.setOptions(i).then(function (e) {
          !c && i.onFirstUpdate && i.onFirstUpdate(e);
        }),
        d
      );
    };
  }
  var ui = { passive: !0 };
  const pi = {
    name: "eventListeners",
    enabled: !0,
    phase: "write",
    fn: function () {},
    effect: function (e) {
      var t = e.state,
        i = e.instance,
        n = e.options,
        a = n.scroll,
        r = void 0 === a || a,
        s = n.resize,
        o = void 0 === s || s,
        l = At(t.elements.popper),
        c = [].concat(t.scrollParents.reference, t.scrollParents.popper);
      return (
        r &&
          c.forEach(function (e) {
            e.addEventListener("scroll", i.update, ui);
          }),
        o && l.addEventListener("resize", i.update, ui),
        function () {
          r &&
            c.forEach(function (e) {
              e.removeEventListener("scroll", i.update, ui);
            }),
            o && l.removeEventListener("resize", i.update, ui);
        }
      );
    },
    data: {},
  };
  function hi(e) {
    return e.split("-")[0];
  }
  function fi(e) {
    return e.split("-")[1];
  }
  function vi(e) {
    return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
  }
  function mi(e) {
    var t,
      i = e.reference,
      n = e.element,
      a = e.placement,
      r = a ? hi(a) : null,
      s = a ? fi(a) : null,
      o = i.x + i.width / 2 - n.width / 2,
      l = i.y + i.height / 2 - n.height / 2;
    switch (r) {
      case Gt:
        t = { x: o, y: i.y - n.height };
        break;
      case Jt:
        t = { x: o, y: i.y + i.height };
        break;
      case Xt:
        t = { x: i.x + i.width, y: l };
        break;
      case Kt:
        t = { x: i.x - n.width, y: l };
        break;
      default:
        t = { x: i.x, y: i.y };
    }
    var c = r ? vi(r) : null;
    if (null != c) {
      var d = "y" === c ? "height" : "width";
      switch (s) {
        case ei:
          t[c] = t[c] - (i[d] / 2 - n[d] / 2);
          break;
        case ti:
          t[c] = t[c] + (i[d] / 2 - n[d] / 2);
      }
    }
    return t;
  }
  const gi = {
    name: "popperOffsets",
    enabled: !0,
    phase: "read",
    fn: function (e) {
      var t = e.state,
        i = e.name;
      t.modifiersData[i] = mi({
        reference: t.rects.reference,
        element: t.rects.popper,
        strategy: "absolute",
        placement: t.placement,
      });
    },
    data: {},
  };
  var wi = Math.max,
    yi = Math.min,
    bi = Math.round,
    xi = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
  function ki(e) {
    var t,
      i = e.popper,
      n = e.popperRect,
      a = e.placement,
      r = e.variation,
      s = e.offsets,
      o = e.position,
      l = e.gpuAcceleration,
      c = e.adaptive,
      d = e.roundOffsets,
      u =
        !0 === d
          ? (function (e) {
              var t = e.x,
                i = e.y,
                n = window.devicePixelRatio || 1;
              return { x: bi(bi(t * n) / n) || 0, y: bi(bi(i * n) / n) || 0 };
            })(s)
          : "function" == typeof d
          ? d(s)
          : s,
      p = u.x,
      h = void 0 === p ? 0 : p,
      f = u.y,
      v = void 0 === f ? 0 : f,
      m = s.hasOwnProperty("x"),
      g = s.hasOwnProperty("y"),
      w = Kt,
      y = Gt,
      b = window;
    if (c) {
      var x = Yt(i),
        k = "clientHeight",
        C = "clientWidth";
      x === At(i) &&
        "static" !== Lt((x = Pt(i))).position &&
        "absolute" === o &&
        ((k = "scrollHeight"), (C = "scrollWidth")),
        (x = x),
        (a !== Gt && ((a !== Kt && a !== Xt) || r !== ti)) ||
          ((y = Jt), (v -= x[k] - n.height), (v *= l ? 1 : -1)),
        (a !== Kt && ((a !== Gt && a !== Jt) || r !== ti)) ||
          ((w = Xt), (h -= x[C] - n.width), (h *= l ? 1 : -1));
    }
    var S,
      $ = Object.assign({ position: o }, c && xi);
    return l
      ? Object.assign(
          {},
          $,
          (((S = {})[y] = g ? "0" : ""),
          (S[w] = m ? "0" : ""),
          (S.transform =
            (b.devicePixelRatio || 1) <= 1
              ? "translate(" + h + "px, " + v + "px)"
              : "translate3d(" + h + "px, " + v + "px, 0)"),
          S)
        )
      : Object.assign(
          {},
          $,
          (((t = {})[y] = g ? v + "px" : ""),
          (t[w] = m ? h + "px" : ""),
          (t.transform = ""),
          t)
        );
  }
  var Ci = { left: "right", right: "left", bottom: "top", top: "bottom" };
  function Si(e) {
    return e.replace(/left|right|bottom|top/g, function (e) {
      return Ci[e];
    });
  }
  var $i = { start: "end", end: "start" };
  function Ei(e) {
    return e.replace(/start|end/g, function (e) {
      return $i[e];
    });
  }
  function Ii(e, t) {
    var i = t.getRootNode && t.getRootNode();
    if (e.contains(t)) return !0;
    if (i && jt(i)) {
      var n = t;
      do {
        if (n && e.isSameNode(n)) return !0;
        n = n.parentNode || n.host;
      } while (n);
    }
    return !1;
  }
  function Ai(e) {
    return Object.assign({}, e, {
      left: e.x,
      top: e.y,
      right: e.x + e.width,
      bottom: e.y + e.height,
    });
  }
  function Ti(e, t) {
    return t === ii
      ? Ai(
          (function (e) {
            var t = At(e),
              i = Pt(e),
              n = t.visualViewport,
              a = i.clientWidth,
              r = i.clientHeight,
              s = 0,
              o = 0;
            return (
              n &&
                ((a = n.width),
                (r = n.height),
                /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
                  ((s = n.offsetLeft), (o = n.offsetTop))),
              { width: a, height: r, x: s + Bt(e), y: o }
            );
          })(e)
        )
      : Ot(t)
      ? (function (e) {
          var t = Nt(e);
          return (
            (t.top = t.top + e.clientTop),
            (t.left = t.left + e.clientLeft),
            (t.bottom = t.top + e.clientHeight),
            (t.right = t.left + e.clientWidth),
            (t.width = e.clientWidth),
            (t.height = e.clientHeight),
            (t.x = t.left),
            (t.y = t.top),
            t
          );
        })(t)
      : Ai(
          (function (e) {
            var t,
              i = Pt(e),
              n = Dt(e),
              a = null == (t = e.ownerDocument) ? void 0 : t.body,
              r = wi(
                i.scrollWidth,
                i.clientWidth,
                a ? a.scrollWidth : 0,
                a ? a.clientWidth : 0
              ),
              s = wi(
                i.scrollHeight,
                i.clientHeight,
                a ? a.scrollHeight : 0,
                a ? a.clientHeight : 0
              ),
              o = -n.scrollLeft + Bt(e),
              l = -n.scrollTop;
            return (
              "rtl" === Lt(a || i).direction &&
                (o += wi(i.clientWidth, a ? a.clientWidth : 0) - r),
              { width: r, height: s, x: o, y: l }
            );
          })(Pt(e))
        );
  }
  function Oi(e) {
    return Object.assign({}, { top: 0, right: 0, bottom: 0, left: 0 }, e);
  }
  function ji(e, t) {
    return t.reduce(function (t, i) {
      return (t[i] = e), t;
    }, {});
  }
  function Mi(e, t) {
    void 0 === t && (t = {});
    var i = t,
      n = i.placement,
      a = void 0 === n ? e.placement : n,
      r = i.boundary,
      s = void 0 === r ? "clippingParents" : r,
      o = i.rootBoundary,
      l = void 0 === o ? ii : o,
      c = i.elementContext,
      d = void 0 === c ? ni : c,
      u = i.altBoundary,
      p = void 0 !== u && u,
      h = i.padding,
      f = void 0 === h ? 0 : h,
      v = Oi("number" != typeof f ? f : ji(f, Zt)),
      m = d === ni ? "reference" : ni,
      g = e.rects.popper,
      w = e.elements[p ? m : d],
      y = (function (e, t, i) {
        var n =
            "clippingParents" === t
              ? (function (e) {
                  var t = Wt(Rt(e)),
                    i =
                      ["absolute", "fixed"].indexOf(Lt(e).position) >= 0 &&
                      Ot(e)
                        ? Yt(e)
                        : e;
                  return Tt(i)
                    ? t.filter(function (e) {
                        return Tt(e) && Ii(e, i) && "body" !== zt(e);
                      })
                    : [];
                })(e)
              : [].concat(t),
          a = [].concat(n, [i]),
          r = a[0],
          s = a.reduce(function (t, i) {
            var n = Ti(e, i);
            return (
              (t.top = wi(n.top, t.top)),
              (t.right = yi(n.right, t.right)),
              (t.bottom = yi(n.bottom, t.bottom)),
              (t.left = wi(n.left, t.left)),
              t
            );
          }, Ti(e, r));
        return (
          (s.width = s.right - s.left),
          (s.height = s.bottom - s.top),
          (s.x = s.left),
          (s.y = s.top),
          s
        );
      })(Tt(w) ? w : w.contextElement || Pt(e.elements.popper), s, l),
      b = Nt(e.elements.reference),
      x = mi({ reference: b, element: g, strategy: "absolute", placement: a }),
      k = Ai(Object.assign({}, g, x)),
      C = d === ni ? k : b,
      S = {
        top: y.top - C.top + v.top,
        bottom: C.bottom - y.bottom + v.bottom,
        left: y.left - C.left + v.left,
        right: C.right - y.right + v.right,
      },
      $ = e.modifiersData.offset;
    if (d === ni && $) {
      var E = $[a];
      Object.keys(S).forEach(function (e) {
        var t = [Xt, Jt].indexOf(e) >= 0 ? 1 : -1,
          i = [Gt, Jt].indexOf(e) >= 0 ? "y" : "x";
        S[e] += E[i] * t;
      });
    }
    return S;
  }
  const Ni = {
    name: "flip",
    enabled: !0,
    phase: "main",
    fn: function (e) {
      var t = e.state,
        i = e.options,
        n = e.name;
      if (!t.modifiersData[n]._skip) {
        for (
          var a = i.mainAxis,
            r = void 0 === a || a,
            s = i.altAxis,
            o = void 0 === s || s,
            l = i.fallbackPlacements,
            c = i.padding,
            d = i.boundary,
            u = i.rootBoundary,
            p = i.altBoundary,
            h = i.flipVariations,
            f = void 0 === h || h,
            v = i.allowedAutoPlacements,
            m = t.options.placement,
            g = hi(m),
            w =
              l ||
              (g !== m && f
                ? (function (e) {
                    if (hi(e) === Qt) return [];
                    var t = Si(e);
                    return [Ei(e), t, Ei(t)];
                  })(m)
                : [Si(m)]),
            y = [m].concat(w).reduce(function (e, i) {
              return e.concat(
                hi(i) === Qt
                  ? (function (e, t) {
                      void 0 === t && (t = {});
                      var i = t,
                        n = i.placement,
                        a = i.boundary,
                        r = i.rootBoundary,
                        s = i.padding,
                        o = i.flipVariations,
                        l = i.allowedAutoPlacements,
                        c = void 0 === l ? ri : l,
                        d = fi(n),
                        u = d
                          ? o
                            ? ai
                            : ai.filter(function (e) {
                                return fi(e) === d;
                              })
                          : Zt,
                        p = u.filter(function (e) {
                          return c.indexOf(e) >= 0;
                        });
                      0 === p.length && (p = u);
                      var h = p.reduce(function (t, i) {
                        return (
                          (t[i] = Mi(e, {
                            placement: i,
                            boundary: a,
                            rootBoundary: r,
                            padding: s,
                          })[hi(i)]),
                          t
                        );
                      }, {});
                      return Object.keys(h).sort(function (e, t) {
                        return h[e] - h[t];
                      });
                    })(t, {
                      placement: i,
                      boundary: d,
                      rootBoundary: u,
                      padding: c,
                      flipVariations: f,
                      allowedAutoPlacements: v,
                    })
                  : i
              );
            }, []),
            b = t.rects.reference,
            x = t.rects.popper,
            k = new Map(),
            C = !0,
            S = y[0],
            $ = 0;
          $ < y.length;
          $++
        ) {
          var E = y[$],
            I = hi(E),
            A = fi(E) === ei,
            T = [Gt, Jt].indexOf(I) >= 0,
            O = T ? "width" : "height",
            j = Mi(t, {
              placement: E,
              boundary: d,
              rootBoundary: u,
              altBoundary: p,
              padding: c,
            }),
            M = T ? (A ? Xt : Kt) : A ? Jt : Gt;
          b[O] > x[O] && (M = Si(M));
          var N = Si(M),
            D = [];
          if (
            (r && D.push(j[I] <= 0),
            o && D.push(j[M] <= 0, j[N] <= 0),
            D.every(function (e) {
              return e;
            }))
          ) {
            (S = E), (C = !1);
            break;
          }
          k.set(E, D);
        }
        if (C)
          for (
            var z = function (e) {
                var t = y.find(function (t) {
                  var i = k.get(t);
                  if (i)
                    return i.slice(0, e).every(function (e) {
                      return e;
                    });
                });
                if (t) return (S = t), "break";
              },
              P = f ? 3 : 1;
            P > 0 && "break" !== z(P);
            P--
          );
        t.placement !== S &&
          ((t.modifiersData[n]._skip = !0), (t.placement = S), (t.reset = !0));
      }
    },
    requiresIfExists: ["offset"],
    data: { _skip: !1 },
  };
  function Di(e, t, i) {
    return wi(e, yi(t, i));
  }
  function zi(e, t, i) {
    return (
      void 0 === i && (i = { x: 0, y: 0 }),
      {
        top: e.top - t.height - i.y,
        right: e.right - t.width + i.x,
        bottom: e.bottom - t.height + i.y,
        left: e.left - t.width - i.x,
      }
    );
  }
  function Pi(e) {
    return [Gt, Xt, Jt, Kt].some(function (t) {
      return e[t] >= 0;
    });
  }
  var Bi = di({
    defaultModifiers: [
      pi,
      gi,
      {
        name: "computeStyles",
        enabled: !0,
        phase: "beforeWrite",
        fn: function (e) {
          var t = e.state,
            i = e.options,
            n = i.gpuAcceleration,
            a = void 0 === n || n,
            r = i.adaptive,
            s = void 0 === r || r,
            o = i.roundOffsets,
            l = void 0 === o || o,
            c = {
              placement: hi(t.placement),
              variation: fi(t.placement),
              popper: t.elements.popper,
              popperRect: t.rects.popper,
              gpuAcceleration: a,
            };
          null != t.modifiersData.popperOffsets &&
            (t.styles.popper = Object.assign(
              {},
              t.styles.popper,
              ki(
                Object.assign({}, c, {
                  offsets: t.modifiersData.popperOffsets,
                  position: t.options.strategy,
                  adaptive: s,
                  roundOffsets: l,
                })
              )
            )),
            null != t.modifiersData.arrow &&
              (t.styles.arrow = Object.assign(
                {},
                t.styles.arrow,
                ki(
                  Object.assign({}, c, {
                    offsets: t.modifiersData.arrow,
                    position: "absolute",
                    adaptive: !1,
                    roundOffsets: l,
                  })
                )
              )),
            (t.attributes.popper = Object.assign({}, t.attributes.popper, {
              "data-popper-placement": t.placement,
            }));
        },
        data: {},
      },
      {
        name: "applyStyles",
        enabled: !0,
        phase: "write",
        fn: function (e) {
          var t = e.state;
          Object.keys(t.elements).forEach(function (e) {
            var i = t.styles[e] || {},
              n = t.attributes[e] || {},
              a = t.elements[e];
            Ot(a) &&
              zt(a) &&
              (Object.assign(a.style, i),
              Object.keys(n).forEach(function (e) {
                var t = n[e];
                !1 === t
                  ? a.removeAttribute(e)
                  : a.setAttribute(e, !0 === t ? "" : t);
              }));
          });
        },
        effect: function (e) {
          var t = e.state,
            i = {
              popper: {
                position: t.options.strategy,
                left: "0",
                top: "0",
                margin: "0",
              },
              arrow: { position: "absolute" },
              reference: {},
            };
          return (
            Object.assign(t.elements.popper.style, i.popper),
            (t.styles = i),
            t.elements.arrow && Object.assign(t.elements.arrow.style, i.arrow),
            function () {
              Object.keys(t.elements).forEach(function (e) {
                var n = t.elements[e],
                  a = t.attributes[e] || {},
                  r = Object.keys(
                    t.styles.hasOwnProperty(e) ? t.styles[e] : i[e]
                  ).reduce(function (e, t) {
                    return (e[t] = ""), e;
                  }, {});
                Ot(n) &&
                  zt(n) &&
                  (Object.assign(n.style, r),
                  Object.keys(a).forEach(function (e) {
                    n.removeAttribute(e);
                  }));
              });
            }
          );
        },
        requires: ["computeStyles"],
      },
      {
        name: "offset",
        enabled: !0,
        phase: "main",
        requires: ["popperOffsets"],
        fn: function (e) {
          var t = e.state,
            i = e.options,
            n = e.name,
            a = i.offset,
            r = void 0 === a ? [0, 0] : a,
            s = ri.reduce(function (e, i) {
              return (
                (e[i] = (function (e, t, i) {
                  var n = hi(e),
                    a = [Kt, Gt].indexOf(n) >= 0 ? -1 : 1,
                    r =
                      "function" == typeof i
                        ? i(Object.assign({}, t, { placement: e }))
                        : i,
                    s = r[0],
                    o = r[1];
                  return (
                    (s = s || 0),
                    (o = (o || 0) * a),
                    [Kt, Xt].indexOf(n) >= 0 ? { x: o, y: s } : { x: s, y: o }
                  );
                })(i, t.rects, r)),
                e
              );
            }, {}),
            o = s[t.placement],
            l = o.x,
            c = o.y;
          null != t.modifiersData.popperOffsets &&
            ((t.modifiersData.popperOffsets.x += l),
            (t.modifiersData.popperOffsets.y += c)),
            (t.modifiersData[n] = s);
        },
      },
      Ni,
      {
        name: "preventOverflow",
        enabled: !0,
        phase: "main",
        fn: function (e) {
          var t = e.state,
            i = e.options,
            n = e.name,
            a = i.mainAxis,
            r = void 0 === a || a,
            s = i.altAxis,
            o = void 0 !== s && s,
            l = i.boundary,
            c = i.rootBoundary,
            d = i.altBoundary,
            u = i.padding,
            p = i.tether,
            h = void 0 === p || p,
            f = i.tetherOffset,
            v = void 0 === f ? 0 : f,
            m = Mi(t, {
              boundary: l,
              rootBoundary: c,
              padding: u,
              altBoundary: d,
            }),
            g = hi(t.placement),
            w = fi(t.placement),
            y = !w,
            b = vi(g),
            x = "x" === b ? "y" : "x",
            k = t.modifiersData.popperOffsets,
            C = t.rects.reference,
            S = t.rects.popper,
            $ =
              "function" == typeof v
                ? v(Object.assign({}, t.rects, { placement: t.placement }))
                : v,
            E = { x: 0, y: 0 };
          if (k) {
            if (r || o) {
              var I = "y" === b ? Gt : Kt,
                A = "y" === b ? Jt : Xt,
                T = "y" === b ? "height" : "width",
                O = k[b],
                j = k[b] + m[I],
                M = k[b] - m[A],
                N = h ? -S[T] / 2 : 0,
                D = w === ei ? C[T] : S[T],
                z = w === ei ? -S[T] : -C[T],
                P = t.elements.arrow,
                B = h && P ? Vt(P) : { width: 0, height: 0 },
                L = t.modifiersData["arrow#persistent"]
                  ? t.modifiersData["arrow#persistent"].padding
                  : { top: 0, right: 0, bottom: 0, left: 0 },
                _ = L[I],
                H = L[A],
                V = Di(0, C[T], B[T]),
                R = y ? C[T] / 2 - N - V - _ - $ : D - V - _ - $,
                q = y ? -C[T] / 2 + N + V + H + $ : z + V + H + $,
                W = t.elements.arrow && Yt(t.elements.arrow),
                U = W ? ("y" === b ? W.clientTop || 0 : W.clientLeft || 0) : 0,
                F = t.modifiersData.offset
                  ? t.modifiersData.offset[t.placement][b]
                  : 0,
                Y = k[b] + R - F - U,
                G = k[b] + q - F;
              if (r) {
                var J = Di(h ? yi(j, Y) : j, O, h ? wi(M, G) : M);
                (k[b] = J), (E[b] = J - O);
              }
              if (o) {
                var X = "x" === b ? Gt : Kt,
                  K = "x" === b ? Jt : Xt,
                  Q = k[x],
                  Z = Q + m[X],
                  ee = Q - m[K],
                  te = Di(h ? yi(Z, Y) : Z, Q, h ? wi(ee, G) : ee);
                (k[x] = te), (E[x] = te - Q);
              }
            }
            t.modifiersData[n] = E;
          }
        },
        requiresIfExists: ["offset"],
      },
      {
        name: "arrow",
        enabled: !0,
        phase: "main",
        fn: function (e) {
          var t,
            i = e.state,
            n = e.name,
            a = e.options,
            r = i.elements.arrow,
            s = i.modifiersData.popperOffsets,
            o = hi(i.placement),
            l = vi(o),
            c = [Kt, Xt].indexOf(o) >= 0 ? "height" : "width";
          if (r && s) {
            var d = (function (e, t) {
                return Oi(
                  "number" !=
                    typeof (e =
                      "function" == typeof e
                        ? e(
                            Object.assign({}, t.rects, {
                              placement: t.placement,
                            })
                          )
                        : e)
                    ? e
                    : ji(e, Zt)
                );
              })(a.padding, i),
              u = Vt(r),
              p = "y" === l ? Gt : Kt,
              h = "y" === l ? Jt : Xt,
              f =
                i.rects.reference[c] +
                i.rects.reference[l] -
                s[l] -
                i.rects.popper[c],
              v = s[l] - i.rects.reference[l],
              m = Yt(r),
              g = m
                ? "y" === l
                  ? m.clientHeight || 0
                  : m.clientWidth || 0
                : 0,
              w = f / 2 - v / 2,
              y = d[p],
              b = g - u[c] - d[h],
              x = g / 2 - u[c] / 2 + w,
              k = Di(y, x, b),
              C = l;
            i.modifiersData[n] =
              (((t = {})[C] = k), (t.centerOffset = k - x), t);
          }
        },
        effect: function (e) {
          var t = e.state,
            i = e.options.element,
            n = void 0 === i ? "[data-popper-arrow]" : i;
          null != n &&
            ("string" != typeof n ||
              (n = t.elements.popper.querySelector(n))) &&
            Ii(t.elements.popper, n) &&
            (t.elements.arrow = n);
        },
        requires: ["popperOffsets"],
        requiresIfExists: ["preventOverflow"],
      },
      {
        name: "hide",
        enabled: !0,
        phase: "main",
        requiresIfExists: ["preventOverflow"],
        fn: function (e) {
          var t = e.state,
            i = e.name,
            n = t.rects.reference,
            a = t.rects.popper,
            r = t.modifiersData.preventOverflow,
            s = Mi(t, { elementContext: "reference" }),
            o = Mi(t, { altBoundary: !0 }),
            l = zi(s, n),
            c = zi(o, a, r),
            d = Pi(l),
            u = Pi(c);
          (t.modifiersData[i] = {
            referenceClippingOffsets: l,
            popperEscapeOffsets: c,
            isReferenceHidden: d,
            hasPopperEscaped: u,
          }),
            (t.attributes.popper = Object.assign({}, t.attributes.popper, {
              "data-popper-reference-hidden": d,
              "data-popper-escaped": u,
            }));
        },
      },
    ],
  });
  class Li {
    constructor(e, t, i) {
      (this.containerEl = t),
        (this.owner = e),
        t.on("click", ".suggestion-item", this.onSuggestionClick.bind(this)),
        t.on(
          "mousemove",
          ".suggestion-item",
          this.onSuggestionMouseover.bind(this)
        ),
        i.register(
          [],
          "ArrowUp",
          () => (this.setSelectedItem(this.selectedItem - 1, !0), !1)
        ),
        i.register(
          [],
          "ArrowDown",
          () => (this.setSelectedItem(this.selectedItem + 1, !0), !1)
        ),
        i.register([], "Enter", (e) => (this.useSelectedItem(e), !1)),
        i.register([], "Tab", (e) => (this.useSelectedItem(e), !1));
    }
    chooseSuggestion(e) {
      if (!this.items || !this.items.length) return;
      const t = this.items[this.selectedItem];
      t && this.owner.selectSuggestion(t, e);
    }
    onSuggestionClick(e, t) {
      if ((e.preventDefault(), !this.suggestions || !this.suggestions.length))
        return;
      const i = this.suggestions.indexOf(t);
      this.setSelectedItem(i, !1), this.useSelectedItem(e);
    }
    onSuggestionMouseover(e, t) {
      if (!this.suggestions || !this.suggestions.length) return;
      const i = this.suggestions.indexOf(t);
      this.setSelectedItem(i, !1);
    }
    empty() {
      this.containerEl.empty();
    }
    setSuggestions(e) {
      this.containerEl.empty();
      const t = [];
      e.forEach((e) => {
        const i = this.containerEl.createDiv("suggestion-item");
        this.owner.renderSuggestion(e, i), t.push(i);
      }),
        (this.items = e),
        (this.suggestions = t),
        this.setSelectedItem(0, !1);
    }
    useSelectedItem(e) {
      if (!this.items || !this.items.length) return;
      const t = this.items[this.selectedItem];
      t && this.owner.selectSuggestion(t, e);
    }
    wrap(e, t) {
      return ((e % t) + t) % t;
    }
    setSelectedItem(e, t) {
      const i = this.wrap(e, this.suggestions.length),
        n = this.suggestions[this.selectedItem],
        a = this.suggestions[i];
      n && n.removeClass("is-selected"),
        a && a.addClass("is-selected"),
        (this.selectedItem = i),
        t && a.scrollIntoView(!1);
    }
  }
  class _i extends n.FuzzySuggestModal {
    constructor(e, t) {
      super(e),
        (this.items = []),
        (this.scope = new n.Scope()),
        (this.emptyStateText = "No match found"),
        (this.limit = 25),
        (this.inputEl = t),
        (this.suggestEl = createDiv({
          attr: { style: "min-width: 475px;" },
          cls: "suggestion-container",
        })),
        (this.contentEl = this.suggestEl.createDiv("suggestion")),
        (this.suggester = new Li(this, this.contentEl, this.scope)),
        this.scope.register([], "Escape", this.close.bind(this)),
        this.inputEl.addEventListener("input", this.onInputChanged.bind(this)),
        this.inputEl.addEventListener("blur", this.close.bind(this)),
        this.suggestEl.on("mousedown", ".suggestion-container", (e) => {
          e.preventDefault();
        });
    }
    empty() {
      this.suggester.empty();
    }
    onInputChanged() {
      const e = this.modifyInput(this.inputEl.value),
        t = this.getSuggestions(e);
      t.length > 0
        ? this.suggester.setSuggestions(t.slice(0, this.limit))
        : this.onNoSuggestion(),
        this.open();
    }
    modifyInput(e) {
      return e;
    }
    onNoSuggestion() {
      this.empty(),
        this.renderSuggestion(
          null,
          this.contentEl.createDiv("suggestion-item")
        );
    }
    open() {
      this.app.keymap.pushScope(this.scope),
        document.body.appendChild(this.suggestEl),
        (this.popper = Bi(this.inputEl, this.suggestEl, {
          placement: "auto-start",
          modifiers: [
            { name: "offset", options: { offset: [0, 10] } },
            {
              name: "flip",
              options: { allowedAutoPlacements: ["top-start", "bottom-start"] },
            },
          ],
        }));
    }
    close() {
      this.app.keymap.popScope(this.scope),
        this.suggester.setSuggestions([]),
        this.popper && this.popper.destroy(),
        this.suggestEl.detach();
    }
    createPrompt(e) {
      this.promptEl ||
        (this.promptEl = this.suggestEl.createDiv("prompt-instructions"));
      let t = this.promptEl.createDiv("prompt-instruction");
      for (let i of e) t.appendChild(i);
    }
  }
  class Hi extends _i {
    constructor(e, t) {
      super(e.app, t),
        (this.plugin = e),
        (this.items = []),
        (this.items = T),
        this.suggestEl.style.removeProperty("min-width"),
        this.onInputChanged();
    }
    getItemText(e) {
      return e.name;
    }
    getItems() {
      return this.items;
    }
    onChooseItem(e) {
      (this.inputEl.value = e.name), (this.condition = e);
    }
    onNoSuggestion() {
      this.empty(),
        this.renderSuggestion(
          null,
          this.contentEl.createDiv("suggestion-item")
        ),
        (this.condition = null);
    }
    selectSuggestion({ item: e }) {
      null !== this.condition
        ? ((this.inputEl.value = e.name), (this.condition = e))
        : (this.condition = { name: this.inputEl.value, description: [] }),
        this.onClose(),
        this.close();
    }
    renderSuggestion(e, t) {
      let { item: i, match: a } = e || {},
        r = new n.Setting(t);
      if (!i)
        return (
          r.nameEl.setText(this.emptyStateText), void (this.condition = null)
        );
      const s = a.matches.map((e) => createSpan("suggestion-highlight"));
      for (let e = 0; e < i.name.length; e++) {
        let t = a.matches.find((t) => t[0] === e);
        if (t) {
          let n = s[a.matches.indexOf(t)];
          r.nameEl.appendChild(n),
            n.appendText(i.name.substring(t[0], t[1])),
            (e += t[1] - t[0] - 1);
        } else r.nameEl.appendText(i.name[e]);
      }
    }
  }
  function Vi(e) {
    W(
      e,
      "svelte-1g6tend",
      ".obsidian-initiative-tracker.svelte-1g6tend{margin:0.5rem;min-width:180px}.add-creature-container.svelte-1g6tend{display:flex;flex-flow:column nowrap;justify-content:flex-start;margin-right:0.5rem}.context-container.svelte-1g6tend{display:flex;flex-flow:row nowrap;justify-content:space-between}.copy-button.svelte-1g6tend{width:min-content;opacity:0.25}.copy-button.svelte-1g6tend:hover{opacity:1}.add-button.svelte-1g6tend{width:min-content}.initiative-tracker-name-container.svelte-1g6tend{display:flex;justify-content:space-between;align-items:center;padding:0 0.5rem}.initiative-tracker-name.svelte-1g6tend{margin:0}"
    );
  }
  function Ri(e) {
    let t, i, n;
    return {
      c() {
        (t = G("div")),
          (i = G("h2")),
          (n = X(e[4])),
          Z(i, "class", "initiative-tracker-name svelte-1g6tend"),
          Z(t, "class", "initiative-tracker-name-container svelte-1g6tend");
      },
      m(e, a) {
        U(e, t, a), q(t, i), q(i, n);
      },
      p(e, t) {
        16 & t && te(n, e[4]);
      },
      d(e) {
        e && F(t);
      },
    };
  }
  function qi(e) {
    let t, i, n, a;
    const r = [Yi, Fi],
      s = [];
    function o(e, t) {
      return e[10] || e[2] ? 0 : 1;
    }
    return (
      (i = o(e)),
      (n = s[i] = r[i](e)),
      {
        c() {
          (t = G("div")),
            n.c(),
            Z(t, "class", "add-creature-container svelte-1g6tend");
        },
        m(e, n) {
          U(e, t, n), s[i].m(t, null), (a = !0);
        },
        p(e, a) {
          let l = i;
          (i = o(e)),
            i === l
              ? s[i].p(e, a)
              : (xe(),
                Se(s[l], 1, 1, () => {
                  s[l] = null;
                }),
                ke(),
                (n = s[i]),
                n ? n.p(e, a) : ((n = s[i] = r[i](e)), n.c()),
                Ce(n, 1),
                n.m(t, null));
        },
        i(e) {
          a || (Ce(n), (a = !0));
        },
        o(e) {
          Se(n), (a = !1);
        },
        d(e) {
          e && F(t), s[i].d();
        },
      }
    );
  }
  function Wi(e) {
    let t, i, n, a, r, s, o;
    return {
      c() {
        (t = G("div")),
          (i = G("span")),
          (i.textContent = "Apply status:"),
          (n = K()),
          (a = G("input")),
          Z(a, "type", "text"),
          Z(t, "class", "updating-hp");
      },
      m(l, c) {
        U(l, t, c),
          q(t, i),
          q(t, n),
          q(t, a),
          s ||
            ((o = [
              Q(a, "focus", e[22]),
              Q(a, "blur", e[23]),
              Q(a, "keydown", Ki),
              H((r = Ji.call(null, a))),
            ]),
            (s = !0));
      },
      p: N,
      i: N,
      o: N,
      d(e) {
        e && F(t), (s = !1), P(o);
      },
    };
  }
  function Ui(e) {
    let t, i, n, a, r, s, o;
    return {
      c() {
        (t = G("div")),
          (i = G("span")),
          (i.textContent = "Apply damage(+) or healing(-):"),
          (n = K()),
          (a = G("input")),
          Z(a, "type", "number"),
          Z(t, "class", "updating-hp");
      },
      m(l, c) {
        U(l, t, c),
          q(t, i),
          q(t, n),
          q(t, a),
          s ||
            ((o = [
              Q(a, "blur", e[21]),
              Q(a, "keydown", Xi),
              H((r = Ji.call(null, a))),
            ]),
            (s = !0));
      },
      p: N,
      i: N,
      o: N,
      d(e) {
        e && F(t), (s = !1), P(o);
      },
    };
  }
  function Fi(e) {
    let t, i, n, a, r, s, o, l;
    return {
      c() {
        (t = G("div")),
          (i = G("div")),
          (a = K()),
          (r = G("div")),
          Z(i, "class", "copy-button svelte-1g6tend"),
          Z(r, "class", "add-button svelte-1g6tend"),
          Z(t, "class", "context-container svelte-1g6tend");
      },
      m(c, d) {
        U(c, t, d),
          q(t, i),
          q(t, a),
          q(t, r),
          o ||
            ((l = [H((n = e[16].call(null, i))), H((s = e[15].call(null, r)))]),
            (o = !0));
      },
      p: N,
      i: N,
      o: N,
      d(e) {
        e && F(t), (o = !1), P(l);
      },
    };
  }
  function Yi(e) {
    let t, i;
    return (
      (t = new It({})),
      t.$on("cancel", e[24]),
      t.$on("save", e[25]),
      {
        c() {
          $e(t.$$.fragment);
        },
        m(e, n) {
          Ee(t, e, n), (i = !0);
        },
        p: N,
        i(e) {
          i || (Ce(t.$$.fragment, e), (i = !0));
        },
        o(e) {
          Se(t.$$.fragment, e), (i = !1);
        },
        d(e) {
          Ie(t, e);
        },
      }
    );
  }
  function Gi(e) {
    let t, i, n, a, r, s, o, l, c;
    i = new Xe({ props: { state: e[5], map: e[7] } });
    let d = e[4] && e[4].length && Ri(e);
    (r = new Ct({
      props: { creatures: e[18](e[3]), show: e[8], state: e[5], current: e[6] },
    })),
      r.$on("update-hp", e[19]),
      r.$on("update-tags", e[20]);
    const u = [Ui, Wi, qi],
      p = [];
    function h(e, t) {
      return e[0] ? 0 : e[1] ? 1 : 2;
    }
    return (
      (o = h(e)),
      (l = p[o] = u[o](e)),
      {
        c() {
          (t = G("div")),
            $e(i.$$.fragment),
            (n = K()),
            d && d.c(),
            (a = K()),
            $e(r.$$.fragment),
            (s = K()),
            l.c(),
            Z(t, "class", "obsidian-initiative-tracker svelte-1g6tend");
        },
        m(e, l) {
          U(e, t, l),
            Ee(i, t, null),
            q(t, n),
            d && d.m(t, null),
            q(t, a),
            Ee(r, t, null),
            q(t, s),
            p[o].m(t, null),
            (c = !0);
        },
        p(e, [n]) {
          const s = {};
          32 & n && (s.state = e[5]),
            128 & n && (s.map = e[7]),
            i.$set(s),
            e[4] && e[4].length
              ? d
                ? d.p(e, n)
                : ((d = Ri(e)), d.c(), d.m(t, a))
              : d && (d.d(1), (d = null));
          const c = {};
          8 & n && (c.creatures = e[18](e[3])),
            256 & n && (c.show = e[8]),
            32 & n && (c.state = e[5]),
            64 & n && (c.current = e[6]),
            r.$set(c);
          let f = o;
          (o = h(e)),
            o === f
              ? p[o].p(e, n)
              : (xe(),
                Se(p[f], 1, 1, () => {
                  p[f] = null;
                }),
                ke(),
                (l = p[o]),
                l ? l.p(e, n) : ((l = p[o] = u[o](e)), l.c()),
                Ce(l, 1),
                l.m(t, null));
        },
        i(e) {
          c || (Ce(i.$$.fragment, e), Ce(r.$$.fragment, e), Ce(l), (c = !0));
        },
        o(e) {
          Se(i.$$.fragment, e), Se(r.$$.fragment, e), Se(l), (c = !1);
        },
        d(e) {
          e && F(t), Ie(i), d && d.d(), Ie(r), p[o].d();
        },
      }
    );
  }
  function Ji(e) {
    e.focus();
  }
  const Xi = function (e) {
      return "Enter" === e.key || "Tab" === e.key
        ? (e.preventDefault(), void this.blur())
        : "Escape" === e.key
        ? ((this.value = ""), void this.blur())
        : /^(-?\d*\.?\d*|Backspace|Delete|Arrow\w+)$/.test(e.key)
        ? void 0
        : (e.preventDefault(), !1);
    },
    Ki = function (e) {
      return "Escape" === e.key
        ? ((this.value = ""), void this.blur())
        : "Enter" === e.key || "Tab" === e.key
        ? (e.preventDefault(), void this.blur())
        : "Escape" === e.key
        ? ((this.value = ""), void this.blur())
        : void 0;
    };
  function Qi(e, t, a) {
    const r = se();
    let s,
      { creatures: o = [] } = t,
      { name: l = null } = t,
      { state: c } = t,
      { current: d } = t,
      { map: p } = t;
    qe.view.subscribe((e) => a(9, (s = e)));
    let { show: h } = t,
      { updatingHP: f = null } = t;
    const v = (e) => {
      s.updateCreature(f, { hp: -1 * e }), a(0, (f = null));
    };
    let { updatingStatus: m = null } = t;
    const g = (e) => {
      s.addStatus(m, e), a(1, (m = null));
    };
    let w,
      y = !1,
      { addNewAsync: b = !1 } = t;
    const x = (e) => {
      a(11, (w = new Hi(s.plugin, e))),
        a(
          11,
          (w.onClose = () => {
            e.blur();
          }),
          w
        ),
        w.open();
    };
    return (
      (e.$$set = (e) => {
        "creatures" in e && a(3, (o = e.creatures)),
          "name" in e && a(4, (l = e.name)),
          "state" in e && a(5, (c = e.state)),
          "current" in e && a(6, (d = e.current)),
          "map" in e && a(7, (p = e.map)),
          "show" in e && a(8, (h = e.show)),
          "updatingHP" in e && a(0, (f = e.updatingHP)),
          "updatingStatus" in e && a(1, (m = e.updatingStatus)),
          "addNewAsync" in e && a(2, (b = e.addNewAsync));
      }),
      [
        f,
        m,
        b,
        o,
        l,
        c,
        d,
        p,
        h,
        s,
        y,
        w,
        r,
        v,
        g,
        (e) => {
          new n.ExtraButtonComponent(e)
            .setTooltip("Add Creature")
            .setIcon(u)
            .onClick(() => {
              a(10, (y = !0));
            });
        },
        (e) => {
          new n.ExtraButtonComponent(e)
            .setTooltip("Copy Initiative Order")
            .setIcon(A)
            .onClick(() =>
              i(void 0, void 0, void 0, function* () {
                yield s.copyInitiativeOrder();
              })
            );
        },
        x,
        (e) => {
          const t = e.reduce((e, t) => {
            const i = e[t.name] || [];
            return (e[t.name] = [...i, t]), e;
          }, {});
          console.log(t);
          for (let [e, i] of Object.entries(t))
            if (i.length > 1)
              for (let t = 0; t <= i.length - 1; t++)
                i[t].name = e + "#" + (t + 1);
          return console.log(t), e;
        },
        (e) => {
          a(0, (f = e.detail));
        },
        (e) => {
          a(1, (m = e.detail));
        },
        function (e) {
          v(Number(this.value));
        },
        function (e) {
          x(this);
        },
        function (e) {
          this.value.length ? g(w.condition) : a(1, (m = null));
        },
        () => {
          a(10, (y = !1)), a(2, (b = !1)), r("cancel-add-new-async");
        },
        (e) => {
          const t = e.detail,
            i = new M(
              {
                name: t.name,
                hp: t.hp,
                ac: t.ac,
                modifier: t.modifier,
                marker: s.plugin.data.monsterMarker,
                player: t.player,
              },
              t.initiative
            );
          b ? r("add-new-async", i) : s.addCreatures(i),
            a(10, (y = !1)),
            a(2, (b = !1));
        },
      ]
    );
  }
  const Zi = class extends Te {
    constructor(e) {
      super(),
        Ae(
          this,
          e,
          Qi,
          Gi,
          L,
          {
            creatures: 3,
            name: 4,
            state: 5,
            current: 6,
            map: 7,
            show: 8,
            updatingHP: 0,
            updatingStatus: 1,
            addNewAsync: 2,
          },
          Vi
        );
    }
    get creatures() {
      return this.$$.ctx[3];
    }
    set creatures(e) {
      this.$$set({ creatures: e }), me();
    }
    get name() {
      return this.$$.ctx[4];
    }
    set name(e) {
      this.$$set({ name: e }), me();
    }
    get state() {
      return this.$$.ctx[5];
    }
    set state(e) {
      this.$$set({ state: e }), me();
    }
    get current() {
      return this.$$.ctx[6];
    }
    set current(e) {
      this.$$set({ current: e }), me();
    }
    get map() {
      return this.$$.ctx[7];
    }
    set map(e) {
      this.$$set({ map: e }), me();
    }
    get show() {
      return this.$$.ctx[8];
    }
    set show(e) {
      this.$$set({ show: e }), me();
    }
    get updatingHP() {
      return this.$$.ctx[0];
    }
    set updatingHP(e) {
      this.$$set({ updatingHP: e }), me();
    }
    get updatingStatus() {
      return this.$$.ctx[1];
    }
    set updatingStatus(e) {
      this.$$set({ updatingStatus: e }), me();
    }
    get addNewAsync() {
      return this.$$.ctx[2];
    }
    set addNewAsync(e) {
      this.$$set({ addNewAsync: e }), me();
    }
  };
  class en extends n.ItemView {
    constructor(e, t) {
      var n, a;
      super(e),
        (this.leaf = e),
        (this.plugin = t),
        (this.creatures = []),
        (this.current = 0),
        (this.state = !1),
        (this._rendered = !1),
        (
          null ===
            (a =
              null === (n = this.plugin.data.state) || void 0 === n
                ? void 0
                : n.creatures) || void 0 === a
            ? void 0
            : a.length
        )
          ? this.newEncounterFromState(this.plugin.data.state)
          : this.newEncounter(),
        this.registerEvent(
          this.app.workspace.on("initiative-tracker:add-creature-here", (e) =>
            i(this, void 0, void 0, function* () {
              this.app.workspace.revealLeaf(this.leaf);
              let t = this._app.$on("add-new-async", (n) => {
                  const a = n.detail;
                  this._addCreature(a),
                    this.trigger(
                      "initiative-tracker:creature-added-at-location",
                      a,
                      e
                    ),
                    t(),
                    i();
                }),
                i = this._app.$on("cancel-add-new-async", () => {
                  t(), i();
                });
              this._app.$set({ addNewAsync: !0 });
            })
          )
        ),
        this.registerEvent(
          this.app.workspace.on(
            "initiative-tracker:creature-updated-in-settings",
            (e) => {
              const t = this.creatures.find((t) => t == e);
              t && this.updateCreature(t, e);
            }
          )
        ),
        this.registerEvent(
          this.app.workspace.on("initiative-tracker:remove", (e) => {
            const t = this.creatures.find((t) => t.id == e.id);
            t && this.removeCreature(t);
          })
        ),
        this.registerEvent(
          this.app.workspace.on("initiative-tracker:enable-disable", (e, t) => {
            const i = this.creatures.find((t) => t.id == e.id);
            i && this.setCreatureState(i, t);
          })
        ),
        this.registerEvent(
          this.app.workspace.on("initiative-tracker:apply-damage", (e) => {
            const t = this.creatures.find((t) => t.id == e.id);
            t && this.setAppState({ updatingHP: t });
          })
        ),
        this.registerEvent(
          this.app.workspace.on("initiative-tracker:add-status", (e) => {
            const t = this.creatures.find((t) => t.id == e.id);
            t && this.setAppState({ updatingStatus: t });
          })
        );
    }
    get pcs() {
      return this.players;
    }
    get npcs() {
      return this.creatures.filter((e) => !e.player);
    }
    get players() {
      return Array.from(this.plugin.playerCreatures.values());
    }
    updatePlayers() {
      this.trigger("initiative-tracker:players-updated", this.pcs),
        this.setAppState({ creatures: this.ordered });
    }
    updateState() {
      this.setAppState(this.appState);
    }
    newEncounterFromState(e) {
      (e && (null == e ? void 0 : e.creatures.length)) || this.newEncounter();
      const { creatures: t, state: i, name: n, current: a } = e;
      (this.creatures = [...t.map((e) => M.fromJSON(e))]),
        n && ((this.name = n), this.setAppState({ name: this.name })),
        (this.state = i),
        (this.current = a),
        this.trigger("initiative-tracker:new-encounter", this.appState),
        this.setAppState({ creatures: this.ordered });
    }
    _addCreature(e) {
      this.creatures.push(e), this.setAppState({ creatures: this.ordered });
    }
    onResize() {
      this.leaf.getRoot() &&
        this.leaf.getRoot().containerEl &&
        (n.Platform.isMobile ||
          this.setAppState({
            show: this.leaf.getRoot().containerEl.clientWidth < 300,
          }));
    }
    get ordered() {
      return (
        this.creatures.sort((e, t) => t.initiative - e.initiative),
        this.creatures
      );
    }
    get enabled() {
      return this.ordered
        .map((e, t) => e.enabled && t)
        .filter((e) => "number" == typeof e);
    }
    addCreatures(...e) {
      for (let t of e) this.creatures.push(t);
      this.trigger("initiative-tracker:creatures-added", e),
        this.setAppState({ creatures: this.ordered });
    }
    removeCreature(...e) {
      for (let t of e) this.creatures = this.creatures.filter((e) => e != t);
      this.trigger("initiative-tracker:creatures-removed", e),
        this.setAppState({ creatures: this.ordered });
    }
    newEncounter({
      name: e,
      players: t = !0,
      creatures: n = [],
      roll: a = !0,
    } = {}) {
      return i(this, void 0, void 0, function* () {
        t instanceof Array && t.length
          ? (this.creatures = [
              ...this.players.filter((e) => t.includes(e.name)),
            ])
          : (this.creatures = !0 === t ? [...this.players] : []),
          n && (this.creatures = [...this.creatures, ...n]),
          e && ((this.name = e), this.setAppState({ name: this.name }));
        for (let e of this.creatures) e.enabled = !0;
        this.trigger("initiative-tracker:new-encounter", this.appState),
          a
            ? yield this.rollInitiatives()
            : this.setAppState({ creatures: this.ordered });
      });
    }
    resetEncounter() {
      for (let e of this.creatures)
        (e.hp = e.max),
          this.setCreatureState(e, !0),
          Array.from(e.status).forEach((t) => {
            this.removeStatus(e, t);
          });
      (this.current = this.enabled[0]),
        this.setAppState({ creatures: this.ordered });
    }
    setMapState(e) {
      this.setAppState({ map: e });
    }
    getInitiativeValue(e = 0) {
      return i(this, void 0, void 0, function* () {
        let t = Math.floor(19 * Math.random() + 1) + e;
        return (
          this.plugin.canUseDiceRoller &&
            (t = (yield this.plugin.app.plugins.plugins[
              "obsidian-dice-roller"
            ].parseDice(
              this.plugin.data.initiative.replace(/%mod%/g, `(${e})`)
            )).result),
          t
        );
      });
    }
    rollInitiatives() {
      return i(this, void 0, void 0, function* () {
        for (let e of this.creatures)
          e.initiative = yield this.getInitiativeValue(e.modifier);
        this.setAppState({ creatures: this.ordered });
      });
    }
    get appState() {
      return {
        state: this.state,
        current: this.current,
        pcs: this.pcs,
        npcs: this.npcs,
        creatures: this.ordered,
      };
    }
    goToNext() {
      const e =
        (((this.enabled.indexOf(this.current) + 1) % this.enabled.length) +
          this.enabled.length) %
        this.enabled.length;
      (this.current = this.enabled[e]),
        this.trigger(
          "initiative-tracker:active-change",
          this.ordered[this.current]
        ),
        this.setAppState({ state: this.state, current: this.current });
    }
    goToPrevious() {
      const e =
        (((this.enabled.indexOf(this.current) - 1) % this.enabled.length) +
          this.enabled.length) %
        this.enabled.length;
      (this.current = this.enabled[e]),
        this.trigger(
          "initiative-tracker:active-change",
          this.ordered[this.current]
        ),
        this.setAppState({ state: this.state, current: this.current });
    }
    toggleState() {
      (this.state = !this.state),
        this.state
          ? ((this.current = this.enabled[0]),
            this.trigger(
              "initiative-tracker:active-change",
              this.ordered[this.current]
            ))
          : this.trigger("initiative-tracker:active-change", null),
        this.setAppState({ state: this.state, current: this.current });
    }
    addStatus(e, t) {
      e.status.add(t),
        this.trigger("initiative-tracker:creature-updated", e),
        this.setAppState({ creatures: this.ordered });
    }
    removeStatus(e, t) {
      e.status.delete(t),
        this.trigger("initiative-tracker:creature-updated", e),
        this.setAppState({ creatures: this.ordered });
    }
    updateCreature(e, { hp: t, ac: i, initiative: n, name: a, marker: r }) {
      n && (e.initiative = Number(n)),
        a && (e.name = a),
        t && (e.hp += Number(t)),
        i && (e.ac = i),
        r && (e.marker = r),
        this.trigger("initiative-tracker:creature-updated", e),
        this.setAppState({ creatures: this.ordered });
    }
    copyInitiativeOrder() {
      return i(this, void 0, void 0, function* () {
        const e = this.ordered
          .map((e) => `${e.initiative} ${e.name}`)
          .join("\n");
        yield navigator.clipboard.writeText(e);
      });
    }
    setCreatureState(e, t) {
      t ? this._enableCreature(e) : this._disableCreature(e),
        this.enabled.length || (this.current = null),
        this.trigger("initiative-tracker:creature-updated", e),
        this.setAppState({ creatures: this.ordered, current: this.current });
    }
    _enableCreature(e) {
      (e.enabled = !0),
        1 == this.enabled.length && (this.current = this.enabled[0]);
    }
    _disableCreature(e) {
      this.ordered[this.current] == e && this.goToNext(), (e.enabled = !1);
    }
    setAppState(e) {
      this._app &&
        this._rendered &&
        (this.plugin.app.workspace.trigger(
          "initiative-tracker:state-change",
          this.appState
        ),
        this._app.$set(e)),
        (this.plugin.data.state = this.toState()),
        this.trigger("initiative-tracker:should-save");
    }
    onOpen() {
      var e, t, a, r;
      return i(this, void 0, void 0, function* () {
        let i =
          !!n.Platform.isMobile ||
          null ===
            (r =
              (null ===
                (a =
                  null === (t = (e = this.leaf).getRoot) || void 0 === t
                    ? void 0
                    : t.call(e).containerEl) || void 0 === a
                ? void 0
                : a.clientWidth) < 300) ||
          void 0 === r ||
          r;
        qe.view.set(this),
          (this._app = new Zi({
            target: this.contentEl,
            props: {
              creatures: this.ordered,
              show: i,
              state: this.state,
              current: this.current,
            },
          })),
          (this._rendered = !0);
      });
    }
    onClose() {
      return i(this, void 0, void 0, function* () {
        this._app.$destroy(),
          (this._rendered = !1),
          this.trigger("initiative-tracker:closed");
      });
    }
    getViewType() {
      return a;
    }
    getDisplayText() {
      return "Initiative Tracker";
    }
    getIcon() {
      return o;
    }
    trigger(...e) {
      const [t, ...i] = e;
      this.app.workspace.trigger(t, ...i);
    }
    toState() {
      return this.state
        ? {
            creatures: [...this.ordered.map((e) => e.toJSON())],
            state: this.state,
            current: this.current,
            name: this.name,
          }
        : null;
    }
    onunload() {
      return i(this, void 0, void 0, function* () {
        (this.plugin.data.state = this.toState()),
          yield this.plugin.saveSettings();
      });
    }
  }
  class tn extends n.Plugin {
    constructor() {
      super(...arguments),
        (this.playerCreatures = new Map()),
        (this.homebrewCreatures = new Map());
    }
    get canUseDiceRoller() {
      return "obsidian-dice-roller" in this.app.plugins.plugins;
    }
    get view() {
      const e = this.app.workspace.getLeavesOfType(a),
        t = e.length ? e[0] : null;
      if (t && t.view && t.view instanceof en) return t.view;
    }
    onload() {
      return i(this, void 0, void 0, function* () {
        (0, n.addIcon)(
          o,
          '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="dice-d20" class="svg-inline--fa fa-dice-d20 fa-w-15" role="img" viewBox="0 0 480 512"><path fill="currentColor" d="M106.75 215.06L1.2 370.95c-3.08 5 .1 11.5 5.93 12.14l208.26 22.07-108.64-190.1zM7.41 315.43L82.7 193.08 6.06 147.1c-2.67-1.6-6.06.32-6.06 3.43v162.81c0 4.03 5.29 5.53 7.41 2.09zM18.25 423.6l194.4 87.66c5.3 2.45 11.35-1.43 11.35-7.26v-65.67l-203.55-22.3c-4.45-.5-6.23 5.59-2.2 7.57zm81.22-257.78L179.4 22.88c4.34-7.06-3.59-15.25-10.78-11.14L17.81 110.35c-2.47 1.62-2.39 5.26.13 6.78l81.53 48.69zM240 176h109.21L253.63 7.62C250.5 2.54 245.25 0 240 0s-10.5 2.54-13.63 7.62L130.79 176H240zm233.94-28.9l-76.64 45.99 75.29 122.35c2.11 3.44 7.41 1.94 7.41-2.1V150.53c0-3.11-3.39-5.03-6.06-3.43zm-93.41 18.72l81.53-48.7c2.53-1.52 2.6-5.16.13-6.78l-150.81-98.6c-7.19-4.11-15.12 4.08-10.78 11.14l79.93 142.94zm79.02 250.21L256 438.32v65.67c0 5.84 6.05 9.71 11.35 7.26l194.4-87.66c4.03-1.97 2.25-8.06-2.2-7.56zm-86.3-200.97l-108.63 190.1 208.26-22.07c5.83-.65 9.01-7.14 5.93-12.14L373.25 215.06zM240 208H139.57L240 383.75 340.43 208H240z"/></svg>'
        ),
          (0, n.addIcon)(
            d,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="save" class="svg-inline--fa fa-save fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"/></svg>'
          ),
          (0, n.addIcon)(
            u,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-plus" class="svg-inline--fa fa-user-plus fa-w-20" role="img" viewBox="0 0 640 512"><path fill="currentColor" d="M624 208h-64v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-64h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/></svg>'
          ),
          (0, n.addIcon)(
            "initiative-tracker-restart",
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo" class="svg-inline--fa fa-redo fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M500.33 0h-47.41a12 12 0 0 0-12 12.57l4 82.76A247.42 247.42 0 0 0 256 8C119.34 8 7.9 119.53 8 256.19 8.1 393.07 119.1 504 256 504a247.1 247.1 0 0 0 166.18-63.91 12 12 0 0 0 .48-17.43l-34-34a12 12 0 0 0-16.38-.55A176 176 0 1 1 402.1 157.8l-101.53-4.87a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12h200.33a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12z"/></svg>'
          ),
          (0, n.addIcon)(
            h,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" class="svg-inline--fa fa-play fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/></svg>'
          ),
          (0, n.addIcon)(
            f,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="step-forward" class="svg-inline--fa fa-step-forward fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z"/></svg>'
          ),
          (0, n.addIcon)(
            v,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="step-backward" class="svg-inline--fa fa-step-backward fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M64 468V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v176.4l195.5-181C352.1 22.3 384 36.6 384 64v384c0 27.4-31.9 41.7-52.5 24.6L136 292.7V468c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12z"/></svg>'
          ),
          (0, n.addIcon)(
            m,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="stop" class="svg-inline--fa fa-stop fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"/></svg>'
          ),
          (0, n.addIcon)(
            "initiative-tracker-grip",
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="grip-vertical" class="svg-inline--fa fa-grip-vertical fa-w-10" role="img" viewBox="0 0 320 512"><path fill="currentColor" d="M96 32H32C14.33 32 0 46.33 0 64v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32V64c0-17.67-14.33-32-32-32zm0 160H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zm0 160H32c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zM288 32h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32V64c0-17.67-14.33-32-32-32zm0 160h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32zm0 160h-64c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-64c0-17.67-14.33-32-32-32z"/></svg>'
          ),
          (0, n.addIcon)(
            g,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="far" data-icon="heart" class="svg-inline--fa fa-heart fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"/></svg>'
          ),
          (0, n.addIcon)(
            w,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="shield-alt" class="svg-inline--fa fa-shield-alt fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256.1 446.3l-.1-381 175.9 73.3c-3.3 151.4-82.1 261.1-175.8 307.7z"/></svg>'
          ),
          (0, n.addIcon)(
            y,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" class="svg-inline--fa fa-bars fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"/></svg>'
          ),
          (0, n.addIcon)(
            x,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-check" class="svg-inline--fa fa-user-check fa-w-20" role="img" viewBox="0 0 640 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4zm323-128.4l-27.8-28.1c-4.6-4.7-12.1-4.7-16.8-.1l-104.8 104-45.5-45.8c-4.6-4.7-12.1-4.7-16.8-.1l-28.1 27.9c-4.7 4.6-4.7 12.1-.1 16.8l81.7 82.3c4.6 4.7 12.1 4.7 16.8.1l141.3-140.2c4.6-4.7 4.7-12.2.1-16.8z"/></svg>'
          ),
          (0, n.addIcon)(
            b,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-slash" class="svg-inline--fa fa-user-slash fa-w-20" role="img" viewBox="0 0 640 512"><path fill="currentColor" d="M633.8 458.1L362.3 248.3C412.1 230.7 448 183.8 448 128 448 57.3 390.7 0 320 0c-67.1 0-121.5 51.8-126.9 117.4L45.5 3.4C38.5-2 28.5-.8 23 6.2L3.4 31.4c-5.4 7-4.2 17 2.8 22.4l588.4 454.7c7 5.4 17 4.2 22.5-2.8l19.6-25.3c5.4-6.8 4.1-16.9-2.9-22.3zM96 422.4V464c0 26.5 21.5 48 48 48h350.2L207.4 290.3C144.2 301.3 96 356 96 422.4z"/></svg>'
          ),
          (0, n.addIcon)(
            C,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="tag" class="svg-inline--fa fa-tag fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M0 252.118V48C0 21.49 21.49 0 48 0h204.118a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882L293.823 497.941c-18.745 18.745-49.137 18.745-67.882 0L14.059 286.059A48 48 0 0 1 0 252.118zM112 64c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z"/></svg>'
          ),
          (0, n.addIcon)(
            k,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="far" data-icon="edit" class="svg-inline--fa fa-edit fa-w-18" role="img" viewBox="0 0 576 512"><path fill="currentColor" d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"/></svg>'
          ),
          (0, n.addIcon)(
            S,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="running" class="svg-inline--fa fa-running fa-w-13" role="img" viewBox="0 0 416 512"><path fill="currentColor" d="M272 96c26.51 0 48-21.49 48-48S298.51 0 272 0s-48 21.49-48 48 21.49 48 48 48zM113.69 317.47l-14.8 34.52H32c-17.67 0-32 14.33-32 32s14.33 32 32 32h77.45c19.25 0 36.58-11.44 44.11-29.09l8.79-20.52-10.67-6.3c-17.32-10.23-30.06-25.37-37.99-42.61zM384 223.99h-44.03l-26.06-53.25c-12.5-25.55-35.45-44.23-61.78-50.94l-71.08-21.14c-28.3-6.8-57.77-.55-80.84 17.14l-39.67 30.41c-14.03 10.75-16.69 30.83-5.92 44.86s30.84 16.66 44.86 5.92l39.69-30.41c7.67-5.89 17.44-8 25.27-6.14l14.7 4.37-37.46 87.39c-12.62 29.48-1.31 64.01 26.3 80.31l84.98 50.17-27.47 87.73c-5.28 16.86 4.11 34.81 20.97 40.09 3.19 1 6.41 1.48 9.58 1.48 13.61 0 26.23-8.77 30.52-22.45l31.64-101.06c5.91-20.77-2.89-43.08-21.64-54.39l-61.24-36.14 31.31-78.28 20.27 41.43c8 16.34 24.92 26.89 43.11 26.89H384c17.67 0 32-14.33 32-32s-14.33-31.99-32-31.99z"/></svg>'
          ),
          (0, n.addIcon)(
            $,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="redo" class="svg-inline--fa fa-redo fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M500.33 0h-47.41a12 12 0 0 0-12 12.57l4 82.76A247.42 247.42 0 0 0 256 8C119.34 8 7.9 119.53 8 256.19 8.1 393.07 119.1 504 256 504a247.1 247.1 0 0 0 166.18-63.91 12 12 0 0 0 .48-17.43l-34-34a12 12 0 0 0-16.38-.55A176 176 0 1 1 402.1 157.8l-101.53-4.87a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12h200.33a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12z"/></svg>'
          ),
          (0, n.addIcon)(
            E,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="far" data-icon="plus-square" class="svg-inline--fa fa-plus-square fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M352 240v32c0 6.6-5.4 12-12 12h-88v88c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-88h-88c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h88v-88c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v88h88c6.6 0 12 5.4 12 12zm96-160v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-48 346V86c0-3.3-2.7-6-6-6H54c-3.3 0-6 2.7-6 6v340c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"/></svg>'
          ),
          (0, n.addIcon)(
            I,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="dice" class="svg-inline--fa fa-dice fa-w-20" role="img" viewBox="0 0 640 512"><path fill="currentColor" d="M592 192H473.26c12.69 29.59 7.12 65.2-17 89.32L320 417.58V464c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48V240c0-26.51-21.49-48-48-48zM480 376c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm-46.37-186.7L258.7 14.37c-19.16-19.16-50.23-19.16-69.39 0L14.37 189.3c-19.16 19.16-19.16 50.23 0 69.39L189.3 433.63c19.16 19.16 50.23 19.16 69.39 0L433.63 258.7c19.16-19.17 19.16-50.24 0-69.4zM96 248c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm128 128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm0-128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm0-128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm128 128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"/></svg>'
          ),
          (0, n.addIcon)(
            c,
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M27.43 918.8l30.374-30.374 80.793 80.793-30.374 30.374L27.43 918.8zm422.393-253.815c0-48.521-39.36-87.882-87.882-87.882s-87.88 39.36-87.88 87.88c0 48.521 39.338 87.859 87.882 87.882s87.902-39.338 87.88-87.88zm-175.351 8.401l-.807-.807-166.337 166.336 80.794 80.794 166.337-166.337-.92-.92c-41.832-3.986-75.099-37.253-79.067-79.065zm-.411-8.402c0-45.507 34.621-82.952 78.95-87.431-46.731-53.121-88.214-110.883-123.852-172.613L117.593 516.506 274.47 673.383a88.927 88.927 0 0 1-.409-8.399zm175.315 8.962c-4.472 44.334-41.914 78.942-87.433 78.92a89.137 89.137 0 0 1-8.406-.413l157.058 157.058 111.566-111.566c-62.063-35.842-119.841-77.405-172.785-123.999zM815.497 74.632L392.493 497.636c6.535 9.622 10.729 21.41 10.729 33.817 0 19.234-9.188 36.441-23.375 47.483 34.711 7.191 61.918 34.869 68.453 69.814 11.013-14.625 28.5-24.14 48.078-24.14 12.407 0 23.51 3.51 32.978 9.891l423.002-423.002 29.691-166.555-166.553 29.688zM41.964 872.58l112.539 112.539 49.514-49.514L91.478 823.066 41.964 872.58z"/></svg>'
          ),
          (0, n.addIcon)(
            l,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marked-alt" class="svg-inline--fa fa-map-marked-alt fa-w-18" role="img" viewBox="0 0 576 512"><path fill="currentColor" d="M288 0c-69.59 0-126 56.41-126 126 0 56.26 82.35 158.8 113.9 196.02 6.39 7.54 17.82 7.54 24.2 0C331.65 284.8 414 182.26 414 126 414 56.41 357.59 0 288 0zm0 168c-23.2 0-42-18.8-42-42s18.8-42 42-42 42 18.8 42 42-18.8 42-42 42zM20.12 215.95A32.006 32.006 0 0 0 0 245.66v250.32c0 11.32 11.43 19.06 21.94 14.86L160 448V214.92c-8.84-15.98-16.07-31.54-21.25-46.42L20.12 215.95zM288 359.67c-14.07 0-27.38-6.18-36.51-16.96-19.66-23.2-40.57-49.62-59.49-76.72v182l192 64V266c-18.92 27.09-39.82 53.52-59.49 76.72-9.13 10.77-22.44 16.95-36.51 16.95zm266.06-198.51L416 224v288l139.88-55.95A31.996 31.996 0 0 0 576 426.34V176.02c0-11.32-11.43-19.06-21.94-14.86z"/></svg>'
          ),
          (0, n.addIcon)(
            A,
            '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="far" data-icon="copy" class="svg-inline--fa fa-copy fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"/></svg>'
          ),
          yield this.loadSettings(),
          this.addSettingTab(new O(this)),
          this.registerView(a, (e) => new en(e, this)),
          this.addCommands(),
          this.registerEvent(
            this.app.workspace.on("initiative-tracker:should-save", () =>
              i(this, void 0, void 0, function* () {
                return yield this.saveSettings();
              })
            )
          ),
          this.registerEvent(
            this.app.workspace.on("initiative-tracker:start-encounter", (e) =>
              i(this, void 0, void 0, function* () {
                var t;
                try {
                  const i = e.map((e) => M.from(e));
                  this.view || (yield this.addTrackerView()),
                    this.view
                      ? (null === (t = this.view) ||
                          void 0 === t ||
                          t.newEncounter({ creatures: i }),
                        this.app.workspace.revealLeaf(this.view.leaf))
                      : new n.Notice(
                          "Could not find the Initiative Tracker. Try reloading the note!"
                        );
                } catch (e) {
                  return (
                    new n.Notice(
                      "There was an issue launching the encounter.\n\n" +
                        e.message
                    ),
                    void console.error(e)
                  );
                }
              })
            )
          ),
          this.registerMarkdownCodeBlockProcessor(
            "encounter",
            this.encounterProcessor.bind(this)
          ),
          (this.playerCreatures = new Map(
            this.data.players.map((e) => [e, M.from(e)])
          )),
          this.app.workspace.onLayoutReady(() => this.addTrackerView()),
          console.log(
            "Initiative Tracker v" + this.manifest.version + " loaded"
          );
      });
    }
    encounterProcessor(e, t, a) {
      var r, s;
      const o = null !== (r = e.split("---")) && void 0 !== r ? r : [],
        l = t.createDiv("encounter-container"),
        c = l.createSpan({
          text: "No encounters created. Please check your syntax and try again.",
        });
      for (let e of o)
        try {
          const t = (0, n.parseYaml)(e),
            a = null !== (s = t.creatures) && void 0 !== s ? s : [];
          let r;
          a &&
            a instanceof Array &&
            (r = a
              .map((e) => {
                try {
                  let t = e,
                    i = 1;
                  if ("object" != typeof e || e instanceof Array) {
                    if ("string" == typeof e)
                      try {
                        let [a, r] = e.split(/:\s?/).reverse();
                        r && !isNaN(Number(r)) && (i = Number(r)),
                          console.log(a),
                          (t = (0, n.parseYaml)(a));
                      } catch (e) {
                        return void console.error(e);
                      }
                  } else
                    (i = Number(Object.keys(e).shift())),
                      (t = Object.values(e).shift());
                  if (!t.length) return;
                  "string" == typeof t && (t = [t.split(",")].flat());
                  let a = new M({
                    name: t[0],
                    hp: t[1] && !isNaN(Number(t[1])) ? Number(t[1]) : null,
                    ac: t[2] && !isNaN(Number(t[2])) ? Number(t[2]) : null,
                    modifier:
                      t[3] && !isNaN(Number(t[3])) ? Number(t[3]) : null,
                    marker: this.data.monsterMarker,
                  });
                  return [...[...Array(i).keys()].map((e) => M.from(a))];
                } catch (t) {
                  new n.Notice(
                    "Initiative Tracker: could not parse line: \n\n" + e
                  );
                }
              })
              .filter((e) => e)
              .flat());
          const o = l.createDiv("encounter");
          let d = !0;
          t.players && (d = "none" !== t.players && t.players),
            new Ve({
              target: o,
              props: Object.assign(
                Object.assign({}, t.name ? { name: t.name } : {}),
                { players: d, creatures: r }
              ),
            }).$on("begin-encounter", () =>
              i(this, void 0, void 0, function* () {
                var e;
                this.view || (yield this.addTrackerView()),
                  this.view
                    ? (null === (e = this.view) ||
                        void 0 === e ||
                        e.newEncounter(
                          Object.assign(Object.assign({}, t), { creatures: r })
                        ),
                      this.app.workspace.revealLeaf(this.view.leaf))
                    : new n.Notice(
                        "Could not find the Initiative Tracker. Try reloading the note!"
                      );
              })
            ),
            c.detach();
        } catch (t) {
          console.error(t),
            new n.Notice(
              "Initiative Tracker: here was an issue parsing: \n\n" + e
            );
        }
    }
    addCommands() {
      this.addCommand({
        id: "open-tracker",
        name: "Open Initiative Tracker",
        checkCallback: (e) => {
          if (!this.view) return e || this.addTrackerView(), !0;
        },
      }),
        this.addCommand({
          id: "toggle-encounter",
          name: "Toggle Encounter",
          checkCallback: (e) => {
            if (this.view) return e || this.view.toggleState(), !0;
          },
        }),
        this.addCommand({
          id: "next-combatant",
          name: "Next Combatant",
          checkCallback: (e) => {
            if (this.view && this.view.state)
              return e || this.view.goToNext(), !0;
          },
        }),
        this.addCommand({
          id: "prev-combatant",
          name: "Previous Combatant",
          checkCallback: (e) => {
            if (this.view && this.view.state)
              return e || this.view.goToPrevious(), !0;
          },
        });
    }
    onunload() {
      return i(this, void 0, void 0, function* () {
        yield this.saveSettings(),
          this.app.workspace.trigger("initiative-tracker:unload"),
          this.app.workspace.getLeavesOfType(a).forEach((e) => e.detach()),
          console.log("Initiative Tracker unloaded");
      });
    }
    addTrackerView() {
      return i(this, void 0, void 0, function* () {
        this.app.workspace.getLeavesOfType(a).length ||
          (yield this.app.workspace.getRightLeaf(!1).setViewState({ type: a }));
      });
    }
    updatePlayer(e, t) {
      return i(this, void 0, void 0, function* () {
        if (!this.playerCreatures.has(e))
          return void (yield this.savePlayer(t));
        const i = this.playerCreatures.get(e);
        i.update(t),
          this.data.players.splice(this.data.players.indexOf(e), 1, t),
          this.playerCreatures.set(t, i),
          this.playerCreatures.delete(e),
          this.view && this.view.updateState(),
          yield this.saveSettings();
      });
    }
    savePlayer(e) {
      return i(this, void 0, void 0, function* () {
        this.data.players.push(e),
          this.playerCreatures.set(e, M.from(e)),
          yield this.saveSettings();
      });
    }
    savePlayers(...e) {
      return i(this, void 0, void 0, function* () {
        for (let t of e)
          this.data.players.push(t), this.playerCreatures.set(t, M.from(t));
        yield this.saveSettings();
      });
    }
    deletePlayer(e) {
      return i(this, void 0, void 0, function* () {
        (this.data.players = this.data.players.filter((t) => t != e)),
          this.playerCreatures.delete(e),
          yield this.saveSettings();
      });
    }
    loadSettings() {
      return i(this, void 0, void 0, function* () {
        const e = Object.assign(
          {},
          Object.assign({}, s),
          yield this.loadData()
        );
        (this.data = e),
          this.data.leafletIntegration &&
            !this.data.players.every((e) => e.marker) &&
            (this.data.players = this.data.players.map((e) => {
              var t;
              return (
                (e.marker =
                  null !== (t = e.marker) && void 0 !== t
                    ? t
                    : this.data.playerMarker),
                e
              );
            }));
      });
    }
    saveSettings() {
      return i(this, void 0, void 0, function* () {
        this.data.players.every((e) => e.marker) ||
          (this.data.players = this.data.players.map((e) => {
            var t;
            return (
              (e.marker =
                null !== (t = e.marker) && void 0 !== t
                  ? t
                  : this.data.playerMarker),
              e
            );
          })),
          yield this.saveData(this.data);
      });
    }
  }
  var nn = exports;
  for (var an in t) nn[an] = t[an];
  t.__esModule && Object.defineProperty(nn, "__esModule", { value: !0 });
})();