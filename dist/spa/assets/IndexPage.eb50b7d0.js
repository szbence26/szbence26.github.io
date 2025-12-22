import { h, c as createComponent, a as computed, g as getCurrentInstance, i as inject, e as emptyRenderFn, F as timelineKey, p as provide, l as layoutKey, d as pageContainerKey, _ as _export_sfc, r as ref, v as openBlock, x as createBlock, y as withCtx, z as createVNode, G as createBaseVNode, C as toDisplayString, B as createTextVNode, H as createElementBlock, I as renderList, J as Fragment } from "./index.4401bd22.js";
import { Q as QBtn } from "./QBtn.2567d2ea.js";
import { h as hSlot, d as hUniqueSlot, Q as QIcon } from "./use-router-link.3a37b2d6.js";
import { u as useDarkProps, a as useDark } from "./use-dark.8ca0577b.js";
const space = h("div", { class: "q-space" });
var QSpace = createComponent({
  name: "QSpace",
  setup() {
    return () => space;
  }
});
var QToolbar = createComponent({
  name: "QToolbar",
  props: {
    inset: Boolean
  },
  setup(props, { slots }) {
    const classes = computed(
      () => "q-toolbar row no-wrap items-center" + (props.inset === true ? " q-toolbar--inset" : "")
    );
    return () => h("div", { class: classes.value, role: "toolbar" }, hSlot(slots.default));
  }
});
const insetMap = {
  true: "inset",
  item: "item-inset",
  "item-thumbnail": "item-thumbnail-inset"
};
const margins = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24
};
var QSeparator = createComponent({
  name: "QSeparator",
  props: {
    ...useDarkProps,
    spaced: [Boolean, String],
    inset: [Boolean, String],
    vertical: Boolean,
    color: String,
    size: String
  },
  setup(props) {
    const vm = getCurrentInstance();
    const isDark = useDark(props, vm.proxy.$q);
    const orientation = computed(() => props.vertical === true ? "vertical" : "horizontal");
    const orientClass = computed(() => ` q-separator--${orientation.value}`);
    const insetClass = computed(() => props.inset !== false ? `${orientClass.value}-${insetMap[props.inset]}` : "");
    const classes = computed(
      () => `q-separator${orientClass.value}${insetClass.value}` + (props.color !== void 0 ? ` bg-${props.color}` : "") + (isDark.value === true ? " q-separator--dark" : "")
    );
    const style = computed(() => {
      const acc = {};
      if (props.size !== void 0) {
        acc[props.vertical === true ? "width" : "height"] = props.size;
      }
      if (props.spaced !== false) {
        const size = props.spaced === true ? `${margins.md}px` : props.spaced in margins ? `${margins[props.spaced]}px` : props.spaced;
        const dir = props.vertical === true ? ["Left", "Right"] : ["Top", "Bottom"];
        acc[`margin${dir[0]}`] = acc[`margin${dir[1]}`] = size;
      }
      return acc;
    });
    return () => h("hr", {
      class: classes.value,
      style: style.value,
      "aria-orientation": orientation.value
    });
  }
});
var QTimelineEntry = createComponent({
  name: "QTimelineEntry",
  props: {
    heading: Boolean,
    tag: {
      type: String,
      default: "h3"
    },
    side: {
      type: String,
      default: "right",
      validator: (v) => ["left", "right"].includes(v)
    },
    icon: String,
    avatar: String,
    color: String,
    title: String,
    subtitle: String,
    body: String
  },
  setup(props, { slots }) {
    const $timeline = inject(timelineKey, emptyRenderFn);
    if ($timeline === emptyRenderFn) {
      console.error("QTimelineEntry needs to be child of QTimeline");
      return emptyRenderFn;
    }
    const classes = computed(
      () => `q-timeline__entry q-timeline__entry--${props.side}` + (props.icon !== void 0 || props.avatar !== void 0 ? " q-timeline__entry--icon" : "")
    );
    const dotClass = computed(
      () => `q-timeline__dot text-${props.color || $timeline.color}`
    );
    const reverse = computed(
      () => $timeline.layout === "comfortable" && $timeline.side === "left"
    );
    return () => {
      const child = hUniqueSlot(slots.default, []);
      if (props.body !== void 0) {
        child.unshift(props.body);
      }
      if (props.heading === true) {
        const content2 = [
          h("div"),
          h("div"),
          h(
            props.tag,
            { class: "q-timeline__heading-title" },
            child
          )
        ];
        return h("div", {
          class: "q-timeline__heading"
        }, reverse.value === true ? content2.reverse() : content2);
      }
      let dot;
      if (props.icon !== void 0) {
        dot = [
          h(QIcon, {
            class: "row items-center justify-center",
            name: props.icon
          })
        ];
      } else if (props.avatar !== void 0) {
        dot = [
          h("img", {
            class: "q-timeline__dot-img",
            src: props.avatar
          })
        ];
      }
      const content = [
        h("div", { class: "q-timeline__subtitle" }, [
          h("span", {}, hSlot(slots.subtitle, [props.subtitle]))
        ]),
        h("div", { class: dotClass.value }, dot),
        h("div", { class: "q-timeline__content" }, [
          h("h6", { class: "q-timeline__title" }, hSlot(slots.title, [props.title]))
        ].concat(child))
      ];
      return h("li", {
        class: classes.value
      }, reverse.value === true ? content.reverse() : content);
    };
  }
});
var QTimeline = createComponent({
  name: "QTimeline",
  props: {
    ...useDarkProps,
    color: {
      type: String,
      default: "primary"
    },
    side: {
      type: String,
      default: "right",
      validator: (v) => ["left", "right"].includes(v)
    },
    layout: {
      type: String,
      default: "dense",
      validator: (v) => ["dense", "comfortable", "loose"].includes(v)
    }
  },
  setup(props, { slots }) {
    const vm = getCurrentInstance();
    const isDark = useDark(props, vm.proxy.$q);
    provide(timelineKey, props);
    const classes = computed(
      () => `q-timeline q-timeline--${props.layout} q-timeline--${props.layout}--${props.side}` + (isDark.value === true ? " q-timeline--dark" : "")
    );
    return () => h("ul", { class: classes.value }, hSlot(slots.default));
  }
});
var QCardSection = createComponent({
  name: "QCardSection",
  props: {
    tag: {
      type: String,
      default: "div"
    },
    horizontal: Boolean
  },
  setup(props, { slots }) {
    const classes = computed(
      () => `q-card__section q-card__section--${props.horizontal === true ? "horiz row no-wrap" : "vert"}`
    );
    return () => h(props.tag, { class: classes.value }, hSlot(slots.default));
  }
});
var QCard = createComponent({
  name: "QCard",
  props: {
    ...useDarkProps,
    tag: {
      type: String,
      default: "div"
    },
    square: Boolean,
    flat: Boolean,
    bordered: Boolean
  },
  setup(props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance();
    const isDark = useDark(props, $q);
    const classes = computed(
      () => "q-card" + (isDark.value === true ? " q-card--dark q-dark" : "") + (props.bordered === true ? " q-card--bordered" : "") + (props.square === true ? " q-card--square no-border-radius" : "") + (props.flat === true ? " q-card--flat no-shadow" : "")
    );
    return () => h(props.tag, { class: classes.value }, hSlot(slots.default));
  }
});
var QPage = createComponent({
  name: "QPage",
  props: {
    padding: Boolean,
    styleFn: Function
  },
  setup(props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance();
    const $layout = inject(layoutKey, emptyRenderFn);
    if ($layout === emptyRenderFn) {
      console.error("QPage needs to be a deep child of QLayout");
      return emptyRenderFn;
    }
    const $pageContainer = inject(pageContainerKey, emptyRenderFn);
    if ($pageContainer === emptyRenderFn) {
      console.error("QPage needs to be child of QPageContainer");
      return emptyRenderFn;
    }
    const style = computed(() => {
      const offset = ($layout.header.space === true ? $layout.header.size : 0) + ($layout.footer.space === true ? $layout.footer.size : 0);
      if (typeof props.styleFn === "function") {
        const height = $layout.isContainer.value === true ? $layout.containerHeight.value : $q.screen.height;
        return props.styleFn(offset, height);
      }
      return {
        minHeight: $layout.isContainer.value === true ? $layout.containerHeight.value - offset + "px" : $q.screen.height === 0 ? offset !== 0 ? `calc(100vh - ${offset}px)` : "100vh" : $q.screen.height - offset + "px"
      };
    });
    const classes = computed(
      () => `q-page${props.padding === true ? " q-layout-padding" : ""}`
    );
    return () => h("main", {
      class: classes.value,
      style: style.value
    }, hSlot(slots.default));
  }
});
var messages = {
  hu: {
    title: "Dorka & Feli",
    date: "D\xE1tum: 2025.05.16.",
    location: "Helysz\xEDn: Forster Vad\xE1szkast\xE9ly",
    address: "2347 Bugyi, Rad\xE1nyi utca 14.",
    map: "Mutasd a t\xE9rk\xE9pen",
    programLabel: "Program",
    program: "Hamarosan",
    menuLabel: "Men\xFC:",
    menu: "Hamarosan",
    accommodationLabel: "B\u0151vebb inform\xE1ci\xF3 a sz\xE1ll\xE1sr\xF3l:",
    accommodation: "Hamarosan",
    timeline: [
      { time: "15:00", event: "Vend\xE9gv\xE1r\xE1s" },
      { time: "16:00", event: "Szertart\xE1s" },
      { time: "18:30", event: "Vacsora" },
      { time: "23:00", event: "Menyecsket\xE1nc" }
    ]
  },
  en: {
    title: "Dorka & Feli",
    date: "Date: 2025-05-16",
    location: "Location: Forster Hunting Castle",
    address: "2347 Bugyi, Rad\xE1nyi street 14.",
    map: "Show on map",
    programLabel: "Program",
    program: "Coming soon",
    menuLabel: "Menu:",
    menu: "Coming soon",
    accommodationLabel: "More info about accommodation:",
    accommodation: "Coming soon",
    timeline: [
      { time: "15:00", event: "Guest arrival" },
      { time: "16:00", event: "Ceremony" },
      { time: "18:30", event: "Dinner" },
      { time: "23:00", event: "Bride's dance" }
    ]
  }
};
var IndexPage_vue_vue_type_style_index_0_scoped_true_lang = "";
const _hoisted_1 = { class: "flag" };
const _hoisted_2 = { class: "content-wrap" };
const _hoisted_3 = { class: "title" };
const _hoisted_4 = { class: "meta" };
const _hoisted_5 = { class: "meta" };
const _hoisted_6 = { class: "meta" };
const _hoisted_7 = { class: "links q-mt-md" };
const _hoisted_8 = { class: "program-section" };
const _hoisted_9 = { class: "info" };
const _sfc_main = {
  __name: "IndexPage",
  setup(__props) {
    const locale = ref(localStorage.getItem("locale") || "hu");
    const setLocale = (l) => {
      locale.value = l;
      localStorage.setItem("locale", l);
    };
    const toggleLocale = () => {
      setLocale(locale.value === "hu" ? "en" : "hu");
    };
    const msg = computed(() => messages[locale.value] || messages.hu);
    const currentFlag = computed(() => locale.value === "hu" ? "\u{1F1ED}\u{1F1FA}" : "\u{1F1EC}\u{1F1E7}");
    const openMap = () => {
      window.open(
        "https://www.google.com/maps/search/Forster+Vad\xE1szkast\xE9ly,+2347+Bugyi,+Rad\xE1nyi+utca+14",
        "_blank"
      );
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(QPage, { class: "page-root" }, {
        default: withCtx(() => [
          createVNode(QToolbar, { class: "q-pa-sm bg-transparent" }, {
            default: withCtx(() => [
              createVNode(QSpace),
              createVNode(QBtn, {
                dense: "",
                flat: "",
                round: "",
                class: "lang-btn",
                onClick: toggleLocale,
                "aria-label": "Language"
              }, {
                default: withCtx(() => [
                  createBaseVNode("span", _hoisted_1, toDisplayString(currentFlag.value), 1)
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createBaseVNode("div", _hoisted_2, [
            createVNode(QCard, {
              flat: "",
              class: "card"
            }, {
              default: withCtx(() => [
                createVNode(QCardSection, { class: "text-center" }, {
                  default: withCtx(() => [
                    createBaseVNode("div", _hoisted_3, toDisplayString(msg.value.title), 1),
                    createBaseVNode("div", _hoisted_4, toDisplayString(msg.value.date), 1),
                    createBaseVNode("div", _hoisted_5, toDisplayString(msg.value.location), 1),
                    createBaseVNode("div", _hoisted_6, toDisplayString(msg.value.address), 1),
                    createBaseVNode("div", _hoisted_7, [
                      createVNode(QBtn, {
                        flat: "",
                        color: "primary",
                        onClick: openMap
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(msg.value.map), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(QSeparator, { spaced: "" }),
                    createBaseVNode("div", _hoisted_8, [
                      createBaseVNode("h3", null, toDisplayString(msg.value.programLabel), 1),
                      createVNode(QTimeline, {
                        color: "timeline-accent",
                        layout: "dense"
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createElementBlock(Fragment, null, renderList(msg.value.timeline, (item, index) => {
                            return openBlock(), createBlock(QTimelineEntry, {
                              key: index,
                              title: item.time,
                              subtitle: item.event,
                              icon: "bedtime"
                            }, null, 8, ["title", "subtitle"]);
                          }), 128))
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(QSeparator, { spaced: "" }),
                    createBaseVNode("div", _hoisted_9, [
                      createBaseVNode("div", null, [
                        createBaseVNode("strong", null, toDisplayString(msg.value.menuLabel), 1),
                        createTextVNode(" " + toDisplayString(msg.value.menu), 1)
                      ]),
                      createBaseVNode("div", null, [
                        createBaseVNode("strong", null, toDisplayString(msg.value.accommodationLabel), 1),
                        createTextVNode(" " + toDisplayString(msg.value.accommodation), 1)
                      ])
                    ])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ])
        ]),
        _: 1
      });
    };
  }
};
var IndexPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c204668a"], ["__file", "IndexPage.vue"]]);
export { IndexPage as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5kZXhQYWdlLmViNTBiN2QwLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcXVhc2FyL3NyYy9jb21wb25lbnRzL3NwYWNlL1FTcGFjZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9xdWFzYXIvc3JjL2NvbXBvbmVudHMvdG9vbGJhci9RVG9vbGJhci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9xdWFzYXIvc3JjL2NvbXBvbmVudHMvc2VwYXJhdG9yL1FTZXBhcmF0b3IuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcXVhc2FyL3NyYy9jb21wb25lbnRzL3RpbWVsaW5lL1FUaW1lbGluZUVudHJ5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3F1YXNhci9zcmMvY29tcG9uZW50cy90aW1lbGluZS9RVGltZWxpbmUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcXVhc2FyL3NyYy9jb21wb25lbnRzL2NhcmQvUUNhcmRTZWN0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3F1YXNhci9zcmMvY29tcG9uZW50cy9jYXJkL1FDYXJkLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3F1YXNhci9zcmMvY29tcG9uZW50cy9wYWdlL1FQYWdlLmpzIiwiLi4vLi4vLi4vc3JjL2kxOG4vbWVzc2FnZXMuanMiLCIuLi8uLi8uLi9zcmMvcGFnZXMvSW5kZXhQYWdlLnZ1ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoIH0gZnJvbSAndnVlJ1xuXG5pbXBvcnQgeyBjcmVhdGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi91dGlscy9wcml2YXRlLmNyZWF0ZS9jcmVhdGUuanMnXG5cbmNvbnN0IHNwYWNlID0gaCgnZGl2JywgeyBjbGFzczogJ3Etc3BhY2UnIH0pXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNvbXBvbmVudCh7XG4gIG5hbWU6ICdRU3BhY2UnLFxuXG4gIHNldHVwICgpIHtcbiAgICByZXR1cm4gKCkgPT4gc3BhY2VcbiAgfVxufSlcbiIsImltcG9ydCB7IGgsIGNvbXB1dGVkIH0gZnJvbSAndnVlJ1xuXG5pbXBvcnQgeyBjcmVhdGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi91dGlscy9wcml2YXRlLmNyZWF0ZS9jcmVhdGUuanMnXG5pbXBvcnQgeyBoU2xvdCB9IGZyb20gJy4uLy4uL3V0aWxzL3ByaXZhdGUucmVuZGVyL3JlbmRlci5qcydcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQ29tcG9uZW50KHtcbiAgbmFtZTogJ1FUb29sYmFyJyxcblxuICBwcm9wczoge1xuICAgIGluc2V0OiBCb29sZWFuXG4gIH0sXG5cbiAgc2V0dXAgKHByb3BzLCB7IHNsb3RzIH0pIHtcbiAgICBjb25zdCBjbGFzc2VzID0gY29tcHV0ZWQoKCkgPT5cbiAgICAgICdxLXRvb2xiYXIgcm93IG5vLXdyYXAgaXRlbXMtY2VudGVyJ1xuICAgICAgKyAocHJvcHMuaW5zZXQgPT09IHRydWUgPyAnIHEtdG9vbGJhci0taW5zZXQnIDogJycpXG4gICAgKVxuXG4gICAgcmV0dXJuICgpID0+IGgoJ2RpdicsIHsgY2xhc3M6IGNsYXNzZXMudmFsdWUsIHJvbGU6ICd0b29sYmFyJyB9LCBoU2xvdChzbG90cy5kZWZhdWx0KSlcbiAgfVxufSlcbiIsImltcG9ydCB7IGgsIGNvbXB1dGVkLCBnZXRDdXJyZW50SW5zdGFuY2UgfSBmcm9tICd2dWUnXG5cbmltcG9ydCB1c2VEYXJrLCB7IHVzZURhcmtQcm9wcyB9IGZyb20gJy4uLy4uL2NvbXBvc2FibGVzL3ByaXZhdGUudXNlLWRhcmsvdXNlLWRhcmsuanMnXG5cbmltcG9ydCB7IGNyZWF0ZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL3V0aWxzL3ByaXZhdGUuY3JlYXRlL2NyZWF0ZS5qcydcblxuY29uc3QgaW5zZXRNYXAgPSB7XG4gIHRydWU6ICdpbnNldCcsXG4gIGl0ZW06ICdpdGVtLWluc2V0JyxcbiAgJ2l0ZW0tdGh1bWJuYWlsJzogJ2l0ZW0tdGh1bWJuYWlsLWluc2V0J1xufVxuXG5leHBvcnQgY29uc3QgbWFyZ2lucyA9IHtcbiAgeHM6IDIsXG4gIHNtOiA0LFxuICBtZDogOCxcbiAgbGc6IDE2LFxuICB4bDogMjRcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQ29tcG9uZW50KHtcbiAgbmFtZTogJ1FTZXBhcmF0b3InLFxuXG4gIHByb3BzOiB7XG4gICAgLi4udXNlRGFya1Byb3BzLFxuXG4gICAgc3BhY2VkOiBbIEJvb2xlYW4sIFN0cmluZyBdLFxuICAgIGluc2V0OiBbIEJvb2xlYW4sIFN0cmluZyBdLFxuICAgIHZlcnRpY2FsOiBCb29sZWFuLFxuICAgIGNvbG9yOiBTdHJpbmcsXG4gICAgc2l6ZTogU3RyaW5nXG4gIH0sXG5cbiAgc2V0dXAgKHByb3BzKSB7XG4gICAgY29uc3Qgdm0gPSBnZXRDdXJyZW50SW5zdGFuY2UoKVxuICAgIGNvbnN0IGlzRGFyayA9IHVzZURhcmsocHJvcHMsIHZtLnByb3h5LiRxKVxuXG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBjb21wdXRlZCgoKSA9PiAoXG4gICAgICBwcm9wcy52ZXJ0aWNhbCA9PT0gdHJ1ZVxuICAgICAgICA/ICd2ZXJ0aWNhbCdcbiAgICAgICAgOiAnaG9yaXpvbnRhbCdcbiAgICApKVxuXG4gICAgY29uc3Qgb3JpZW50Q2xhc3MgPSBjb21wdXRlZCgoKSA9PiBgIHEtc2VwYXJhdG9yLS0keyBvcmllbnRhdGlvbi52YWx1ZSB9YClcblxuICAgIGNvbnN0IGluc2V0Q2xhc3MgPSBjb21wdXRlZCgoKSA9PiAoXG4gICAgICBwcm9wcy5pbnNldCAhPT0gZmFsc2VcbiAgICAgICAgPyBgJHsgb3JpZW50Q2xhc3MudmFsdWUgfS0keyBpbnNldE1hcFsgcHJvcHMuaW5zZXQgXSB9YFxuICAgICAgICA6ICcnXG4gICAgKSlcblxuICAgIGNvbnN0IGNsYXNzZXMgPSBjb21wdXRlZCgoKSA9PlxuICAgICAgYHEtc2VwYXJhdG9yJHsgb3JpZW50Q2xhc3MudmFsdWUgfSR7IGluc2V0Q2xhc3MudmFsdWUgfWBcbiAgICAgICsgKHByb3BzLmNvbG9yICE9PSB2b2lkIDAgPyBgIGJnLSR7IHByb3BzLmNvbG9yIH1gIDogJycpXG4gICAgICArIChpc0RhcmsudmFsdWUgPT09IHRydWUgPyAnIHEtc2VwYXJhdG9yLS1kYXJrJyA6ICcnKVxuICAgIClcblxuICAgIGNvbnN0IHN0eWxlID0gY29tcHV0ZWQoKCkgPT4ge1xuICAgICAgY29uc3QgYWNjID0ge31cblxuICAgICAgaWYgKHByb3BzLnNpemUgIT09IHZvaWQgMCkge1xuICAgICAgICBhY2NbIHByb3BzLnZlcnRpY2FsID09PSB0cnVlID8gJ3dpZHRoJyA6ICdoZWlnaHQnIF0gPSBwcm9wcy5zaXplXG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wcy5zcGFjZWQgIT09IGZhbHNlKSB7XG4gICAgICAgIGNvbnN0IHNpemUgPSBwcm9wcy5zcGFjZWQgPT09IHRydWVcbiAgICAgICAgICA/IGAkeyBtYXJnaW5zLm1kIH1weGBcbiAgICAgICAgICA6IHByb3BzLnNwYWNlZCBpbiBtYXJnaW5zID8gYCR7IG1hcmdpbnNbIHByb3BzLnNwYWNlZCBdIH1weGAgOiBwcm9wcy5zcGFjZWRcblxuICAgICAgICBjb25zdCBkaXIgPSBwcm9wcy52ZXJ0aWNhbCA9PT0gdHJ1ZVxuICAgICAgICAgID8gWyAnTGVmdCcsICdSaWdodCcgXVxuICAgICAgICAgIDogWyAnVG9wJywgJ0JvdHRvbScgXVxuXG4gICAgICAgIGFjY1sgYG1hcmdpbiR7IGRpclsgMCBdIH1gIF0gPSBhY2NbIGBtYXJnaW4keyBkaXJbIDEgXSB9YCBdID0gc2l6ZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWNjXG4gICAgfSlcblxuICAgIHJldHVybiAoKSA9PiBoKCdocicsIHtcbiAgICAgIGNsYXNzOiBjbGFzc2VzLnZhbHVlLFxuICAgICAgc3R5bGU6IHN0eWxlLnZhbHVlLFxuICAgICAgJ2FyaWEtb3JpZW50YXRpb24nOiBvcmllbnRhdGlvbi52YWx1ZVxuICAgIH0pXG4gIH1cbn0pXG4iLCJpbXBvcnQgeyBoLCBjb21wdXRlZCwgaW5qZWN0IH0gZnJvbSAndnVlJ1xuXG5pbXBvcnQgUUljb24gZnJvbSAnLi4vaWNvbi9RSWNvbi5qcydcblxuaW1wb3J0IHsgY3JlYXRlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS5jcmVhdGUvY3JlYXRlLmpzJ1xuaW1wb3J0IHsgaFNsb3QsIGhVbmlxdWVTbG90IH0gZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS5yZW5kZXIvcmVuZGVyLmpzJ1xuaW1wb3J0IHsgdGltZWxpbmVLZXksIGVtcHR5UmVuZGVyRm4gfSBmcm9tICcuLi8uLi91dGlscy9wcml2YXRlLnN5bWJvbHMvc3ltYm9scy5qcydcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQ29tcG9uZW50KHtcbiAgbmFtZTogJ1FUaW1lbGluZUVudHJ5JyxcblxuICBwcm9wczoge1xuICAgIGhlYWRpbmc6IEJvb2xlYW4sXG4gICAgdGFnOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnaDMnXG4gICAgfSxcbiAgICBzaWRlOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAncmlnaHQnLFxuICAgICAgdmFsaWRhdG9yOiB2ID0+IFsgJ2xlZnQnLCAncmlnaHQnIF0uaW5jbHVkZXModilcbiAgICB9LFxuXG4gICAgaWNvbjogU3RyaW5nLFxuICAgIGF2YXRhcjogU3RyaW5nLFxuXG4gICAgY29sb3I6IFN0cmluZyxcblxuICAgIHRpdGxlOiBTdHJpbmcsXG4gICAgc3VidGl0bGU6IFN0cmluZyxcbiAgICBib2R5OiBTdHJpbmdcbiAgfSxcblxuICBzZXR1cCAocHJvcHMsIHsgc2xvdHMgfSkge1xuICAgIGNvbnN0ICR0aW1lbGluZSA9IGluamVjdCh0aW1lbGluZUtleSwgZW1wdHlSZW5kZXJGbilcbiAgICBpZiAoJHRpbWVsaW5lID09PSBlbXB0eVJlbmRlckZuKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdRVGltZWxpbmVFbnRyeSBuZWVkcyB0byBiZSBjaGlsZCBvZiBRVGltZWxpbmUnKVxuICAgICAgcmV0dXJuIGVtcHR5UmVuZGVyRm5cbiAgICB9XG5cbiAgICBjb25zdCBjbGFzc2VzID0gY29tcHV0ZWQoKCkgPT5cbiAgICAgIGBxLXRpbWVsaW5lX19lbnRyeSBxLXRpbWVsaW5lX19lbnRyeS0tJHsgcHJvcHMuc2lkZSB9YFxuICAgICAgKyAocHJvcHMuaWNvbiAhPT0gdm9pZCAwIHx8IHByb3BzLmF2YXRhciAhPT0gdm9pZCAwID8gJyBxLXRpbWVsaW5lX19lbnRyeS0taWNvbicgOiAnJylcbiAgICApXG5cbiAgICBjb25zdCBkb3RDbGFzcyA9IGNvbXB1dGVkKCgpID0+XG4gICAgICBgcS10aW1lbGluZV9fZG90IHRleHQtJHsgcHJvcHMuY29sb3IgfHwgJHRpbWVsaW5lLmNvbG9yIH1gXG4gICAgKVxuXG4gICAgY29uc3QgcmV2ZXJzZSA9IGNvbXB1dGVkKCgpID0+XG4gICAgICAkdGltZWxpbmUubGF5b3V0ID09PSAnY29tZm9ydGFibGUnICYmICR0aW1lbGluZS5zaWRlID09PSAnbGVmdCdcbiAgICApXG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29uc3QgY2hpbGQgPSBoVW5pcXVlU2xvdChzbG90cy5kZWZhdWx0LCBbXSlcblxuICAgICAgaWYgKHByb3BzLmJvZHkgIT09IHZvaWQgMCkge1xuICAgICAgICBjaGlsZC51bnNoaWZ0KHByb3BzLmJvZHkpXG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wcy5oZWFkaW5nID09PSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBbXG4gICAgICAgICAgaCgnZGl2JyksXG4gICAgICAgICAgaCgnZGl2JyksXG4gICAgICAgICAgaChcbiAgICAgICAgICAgIHByb3BzLnRhZyxcbiAgICAgICAgICAgIHsgY2xhc3M6ICdxLXRpbWVsaW5lX19oZWFkaW5nLXRpdGxlJyB9LFxuICAgICAgICAgICAgY2hpbGRcbiAgICAgICAgICApXG4gICAgICAgIF1cblxuICAgICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICAgIGNsYXNzOiAncS10aW1lbGluZV9faGVhZGluZydcbiAgICAgICAgfSwgcmV2ZXJzZS52YWx1ZSA9PT0gdHJ1ZSA/IGNvbnRlbnQucmV2ZXJzZSgpIDogY29udGVudClcbiAgICAgIH1cblxuICAgICAgbGV0IGRvdFxuXG4gICAgICBpZiAocHJvcHMuaWNvbiAhPT0gdm9pZCAwKSB7XG4gICAgICAgIGRvdCA9IFtcbiAgICAgICAgICBoKFFJY29uLCB7XG4gICAgICAgICAgICBjbGFzczogJ3JvdyBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXInLFxuICAgICAgICAgICAgbmFtZTogcHJvcHMuaWNvblxuICAgICAgICAgIH0pXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHByb3BzLmF2YXRhciAhPT0gdm9pZCAwKSB7XG4gICAgICAgIGRvdCA9IFtcbiAgICAgICAgICBoKCdpbWcnLCB7XG4gICAgICAgICAgICBjbGFzczogJ3EtdGltZWxpbmVfX2RvdC1pbWcnLFxuICAgICAgICAgICAgc3JjOiBwcm9wcy5hdmF0YXJcbiAgICAgICAgICB9KVxuICAgICAgICBdXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBbXG4gICAgICAgIGgoJ2RpdicsIHsgY2xhc3M6ICdxLXRpbWVsaW5lX19zdWJ0aXRsZScgfSwgW1xuICAgICAgICAgIGgoJ3NwYW4nLCB7fSwgaFNsb3Qoc2xvdHMuc3VidGl0bGUsIFsgcHJvcHMuc3VidGl0bGUgXSkpXG4gICAgICAgIF0pLFxuXG4gICAgICAgIGgoJ2RpdicsIHsgY2xhc3M6IGRvdENsYXNzLnZhbHVlIH0sIGRvdCksXG5cbiAgICAgICAgaCgnZGl2JywgeyBjbGFzczogJ3EtdGltZWxpbmVfX2NvbnRlbnQnIH0sIFtcbiAgICAgICAgICBoKCdoNicsIHsgY2xhc3M6ICdxLXRpbWVsaW5lX190aXRsZScgfSwgaFNsb3Qoc2xvdHMudGl0bGUsIFsgcHJvcHMudGl0bGUgXSkpXG4gICAgICAgIF0uY29uY2F0KGNoaWxkKSlcbiAgICAgIF1cblxuICAgICAgcmV0dXJuIGgoJ2xpJywge1xuICAgICAgICBjbGFzczogY2xhc3Nlcy52YWx1ZVxuICAgICAgfSwgcmV2ZXJzZS52YWx1ZSA9PT0gdHJ1ZSA/IGNvbnRlbnQucmV2ZXJzZSgpIDogY29udGVudClcbiAgICB9XG4gIH1cbn0pXG4iLCJpbXBvcnQgeyBoLCBjb21wdXRlZCwgcHJvdmlkZSwgZ2V0Q3VycmVudEluc3RhbmNlIH0gZnJvbSAndnVlJ1xuXG5pbXBvcnQgdXNlRGFyaywgeyB1c2VEYXJrUHJvcHMgfSBmcm9tICcuLi8uLi9jb21wb3NhYmxlcy9wcml2YXRlLnVzZS1kYXJrL3VzZS1kYXJrLmpzJ1xuXG5pbXBvcnQgeyBjcmVhdGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi91dGlscy9wcml2YXRlLmNyZWF0ZS9jcmVhdGUuanMnXG5pbXBvcnQgeyBoU2xvdCB9IGZyb20gJy4uLy4uL3V0aWxzL3ByaXZhdGUucmVuZGVyL3JlbmRlci5qcydcbmltcG9ydCB7IHRpbWVsaW5lS2V5IH0gZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS5zeW1ib2xzL3N5bWJvbHMuanMnXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNvbXBvbmVudCh7XG4gIG5hbWU6ICdRVGltZWxpbmUnLFxuXG4gIHByb3BzOiB7XG4gICAgLi4udXNlRGFya1Byb3BzLFxuXG4gICAgY29sb3I6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdwcmltYXJ5J1xuICAgIH0sXG4gICAgc2lkZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ3JpZ2h0JyxcbiAgICAgIHZhbGlkYXRvcjogdiA9PiBbICdsZWZ0JywgJ3JpZ2h0JyBdLmluY2x1ZGVzKHYpXG4gICAgfSxcbiAgICBsYXlvdXQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIGRlZmF1bHQ6ICdkZW5zZScsXG4gICAgICB2YWxpZGF0b3I6IHYgPT4gWyAnZGVuc2UnLCAnY29tZm9ydGFibGUnLCAnbG9vc2UnIF0uaW5jbHVkZXModilcbiAgICB9XG4gIH0sXG5cbiAgc2V0dXAgKHByb3BzLCB7IHNsb3RzIH0pIHtcbiAgICBjb25zdCB2bSA9IGdldEN1cnJlbnRJbnN0YW5jZSgpXG4gICAgY29uc3QgaXNEYXJrID0gdXNlRGFyayhwcm9wcywgdm0ucHJveHkuJHEpXG5cbiAgICBwcm92aWRlKHRpbWVsaW5lS2V5LCBwcm9wcylcblxuICAgIGNvbnN0IGNsYXNzZXMgPSBjb21wdXRlZCgoKSA9PlxuICAgICAgYHEtdGltZWxpbmUgcS10aW1lbGluZS0tJHsgcHJvcHMubGF5b3V0IH0gcS10aW1lbGluZS0tJHsgcHJvcHMubGF5b3V0IH0tLSR7IHByb3BzLnNpZGUgfWBcbiAgICAgICsgKGlzRGFyay52YWx1ZSA9PT0gdHJ1ZSA/ICcgcS10aW1lbGluZS0tZGFyaycgOiAnJylcbiAgICApXG5cbiAgICByZXR1cm4gKCkgPT4gaCgndWwnLCB7IGNsYXNzOiBjbGFzc2VzLnZhbHVlIH0sIGhTbG90KHNsb3RzLmRlZmF1bHQpKVxuICB9XG59KVxuIiwiaW1wb3J0IHsgaCwgY29tcHV0ZWQgfSBmcm9tICd2dWUnXG5cbmltcG9ydCB7IGNyZWF0ZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL3V0aWxzL3ByaXZhdGUuY3JlYXRlL2NyZWF0ZS5qcydcbmltcG9ydCB7IGhTbG90IH0gZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS5yZW5kZXIvcmVuZGVyLmpzJ1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVDb21wb25lbnQoe1xuICBuYW1lOiAnUUNhcmRTZWN0aW9uJyxcblxuICBwcm9wczoge1xuICAgIHRhZzoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2RpdidcbiAgICB9LFxuXG4gICAgaG9yaXpvbnRhbDogQm9vbGVhblxuICB9LFxuXG4gIHNldHVwIChwcm9wcywgeyBzbG90cyB9KSB7XG4gICAgY29uc3QgY2xhc3NlcyA9IGNvbXB1dGVkKCgpID0+XG4gICAgICAncS1jYXJkX19zZWN0aW9uJ1xuICAgICAgKyBgIHEtY2FyZF9fc2VjdGlvbi0tJHsgcHJvcHMuaG9yaXpvbnRhbCA9PT0gdHJ1ZSA/ICdob3JpeiByb3cgbm8td3JhcCcgOiAndmVydCcgfWBcbiAgICApXG5cbiAgICByZXR1cm4gKCkgPT4gaChwcm9wcy50YWcsIHsgY2xhc3M6IGNsYXNzZXMudmFsdWUgfSwgaFNsb3Qoc2xvdHMuZGVmYXVsdCkpXG4gIH1cbn0pXG4iLCJpbXBvcnQgeyBoLCBjb21wdXRlZCwgZ2V0Q3VycmVudEluc3RhbmNlIH0gZnJvbSAndnVlJ1xuXG5pbXBvcnQgdXNlRGFyaywgeyB1c2VEYXJrUHJvcHMgfSBmcm9tICcuLi8uLi9jb21wb3NhYmxlcy9wcml2YXRlLnVzZS1kYXJrL3VzZS1kYXJrLmpzJ1xuXG5pbXBvcnQgeyBjcmVhdGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi91dGlscy9wcml2YXRlLmNyZWF0ZS9jcmVhdGUuanMnXG5pbXBvcnQgeyBoU2xvdCB9IGZyb20gJy4uLy4uL3V0aWxzL3ByaXZhdGUucmVuZGVyL3JlbmRlci5qcydcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQ29tcG9uZW50KHtcbiAgbmFtZTogJ1FDYXJkJyxcblxuICBwcm9wczoge1xuICAgIC4uLnVzZURhcmtQcm9wcyxcblxuICAgIHRhZzoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJ2RpdidcbiAgICB9LFxuXG4gICAgc3F1YXJlOiBCb29sZWFuLFxuICAgIGZsYXQ6IEJvb2xlYW4sXG4gICAgYm9yZGVyZWQ6IEJvb2xlYW5cbiAgfSxcblxuICBzZXR1cCAocHJvcHMsIHsgc2xvdHMgfSkge1xuICAgIGNvbnN0IHsgcHJveHk6IHsgJHEgfSB9ID0gZ2V0Q3VycmVudEluc3RhbmNlKClcbiAgICBjb25zdCBpc0RhcmsgPSB1c2VEYXJrKHByb3BzLCAkcSlcblxuICAgIGNvbnN0IGNsYXNzZXMgPSBjb21wdXRlZCgoKSA9PlxuICAgICAgJ3EtY2FyZCdcbiAgICAgICsgKGlzRGFyay52YWx1ZSA9PT0gdHJ1ZSA/ICcgcS1jYXJkLS1kYXJrIHEtZGFyaycgOiAnJylcbiAgICAgICsgKHByb3BzLmJvcmRlcmVkID09PSB0cnVlID8gJyBxLWNhcmQtLWJvcmRlcmVkJyA6ICcnKVxuICAgICAgKyAocHJvcHMuc3F1YXJlID09PSB0cnVlID8gJyBxLWNhcmQtLXNxdWFyZSBuby1ib3JkZXItcmFkaXVzJyA6ICcnKVxuICAgICAgKyAocHJvcHMuZmxhdCA9PT0gdHJ1ZSA/ICcgcS1jYXJkLS1mbGF0IG5vLXNoYWRvdycgOiAnJylcbiAgICApXG5cbiAgICByZXR1cm4gKCkgPT4gaChwcm9wcy50YWcsIHsgY2xhc3M6IGNsYXNzZXMudmFsdWUgfSwgaFNsb3Qoc2xvdHMuZGVmYXVsdCkpXG4gIH1cbn0pXG4iLCJpbXBvcnQgeyBoLCBjb21wdXRlZCwgaW5qZWN0LCBnZXRDdXJyZW50SW5zdGFuY2UgfSBmcm9tICd2dWUnXG5cbmltcG9ydCB7IGNyZWF0ZUNvbXBvbmVudCB9IGZyb20gJy4uLy4uL3V0aWxzL3ByaXZhdGUuY3JlYXRlL2NyZWF0ZS5qcydcbmltcG9ydCB7IGhTbG90IH0gZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS5yZW5kZXIvcmVuZGVyLmpzJ1xuaW1wb3J0IHsgcGFnZUNvbnRhaW5lcktleSwgbGF5b3V0S2V5LCBlbXB0eVJlbmRlckZuIH0gZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS5zeW1ib2xzL3N5bWJvbHMuanMnXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNvbXBvbmVudCh7XG4gIG5hbWU6ICdRUGFnZScsXG5cbiAgcHJvcHM6IHtcbiAgICBwYWRkaW5nOiBCb29sZWFuLFxuICAgIHN0eWxlRm46IEZ1bmN0aW9uXG4gIH0sXG5cbiAgc2V0dXAgKHByb3BzLCB7IHNsb3RzIH0pIHtcbiAgICBjb25zdCB7IHByb3h5OiB7ICRxIH0gfSA9IGdldEN1cnJlbnRJbnN0YW5jZSgpXG5cbiAgICBjb25zdCAkbGF5b3V0ID0gaW5qZWN0KGxheW91dEtleSwgZW1wdHlSZW5kZXJGbilcbiAgICBpZiAoJGxheW91dCA9PT0gZW1wdHlSZW5kZXJGbikge1xuICAgICAgY29uc29sZS5lcnJvcignUVBhZ2UgbmVlZHMgdG8gYmUgYSBkZWVwIGNoaWxkIG9mIFFMYXlvdXQnKVxuICAgICAgcmV0dXJuIGVtcHR5UmVuZGVyRm5cbiAgICB9XG5cbiAgICBjb25zdCAkcGFnZUNvbnRhaW5lciA9IGluamVjdChwYWdlQ29udGFpbmVyS2V5LCBlbXB0eVJlbmRlckZuKVxuICAgIGlmICgkcGFnZUNvbnRhaW5lciA9PT0gZW1wdHlSZW5kZXJGbikge1xuICAgICAgY29uc29sZS5lcnJvcignUVBhZ2UgbmVlZHMgdG8gYmUgY2hpbGQgb2YgUVBhZ2VDb250YWluZXInKVxuICAgICAgcmV0dXJuIGVtcHR5UmVuZGVyRm5cbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZSA9IGNvbXB1dGVkKCgpID0+IHtcbiAgICAgIGNvbnN0IG9mZnNldFxuICAgICAgICA9ICgkbGF5b3V0LmhlYWRlci5zcGFjZSA9PT0gdHJ1ZSA/ICRsYXlvdXQuaGVhZGVyLnNpemUgOiAwKVxuICAgICAgICArICgkbGF5b3V0LmZvb3Rlci5zcGFjZSA9PT0gdHJ1ZSA/ICRsYXlvdXQuZm9vdGVyLnNpemUgOiAwKVxuXG4gICAgICBpZiAodHlwZW9mIHByb3BzLnN0eWxlRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gJGxheW91dC5pc0NvbnRhaW5lci52YWx1ZSA9PT0gdHJ1ZVxuICAgICAgICAgID8gJGxheW91dC5jb250YWluZXJIZWlnaHQudmFsdWVcbiAgICAgICAgICA6ICRxLnNjcmVlbi5oZWlnaHRcblxuICAgICAgICByZXR1cm4gcHJvcHMuc3R5bGVGbihvZmZzZXQsIGhlaWdodClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbWluSGVpZ2h0OiAkbGF5b3V0LmlzQ29udGFpbmVyLnZhbHVlID09PSB0cnVlXG4gICAgICAgICAgPyAoJGxheW91dC5jb250YWluZXJIZWlnaHQudmFsdWUgLSBvZmZzZXQpICsgJ3B4J1xuICAgICAgICAgIDogKFxuICAgICAgICAgICAgICAkcS5zY3JlZW4uaGVpZ2h0ID09PSAwXG4gICAgICAgICAgICAgICAgPyAob2Zmc2V0ICE9PSAwID8gYGNhbGMoMTAwdmggLSAkeyBvZmZzZXQgfXB4KWAgOiAnMTAwdmgnKVxuICAgICAgICAgICAgICAgIDogKCRxLnNjcmVlbi5oZWlnaHQgLSBvZmZzZXQpICsgJ3B4J1xuICAgICAgICAgICAgKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjb25zdCBjbGFzc2VzID0gY29tcHV0ZWQoKCkgPT5cbiAgICAgIGBxLXBhZ2UkeyBwcm9wcy5wYWRkaW5nID09PSB0cnVlID8gJyBxLWxheW91dC1wYWRkaW5nJyA6ICcnIH1gXG4gICAgKVxuXG4gICAgcmV0dXJuICgpID0+IGgoJ21haW4nLCB7XG4gICAgICBjbGFzczogY2xhc3Nlcy52YWx1ZSxcbiAgICAgIHN0eWxlOiBzdHlsZS52YWx1ZVxuICAgIH0sIGhTbG90KHNsb3RzLmRlZmF1bHQpKVxuICB9XG59KVxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIGh1OiB7XHJcbiAgICB0aXRsZTogXCJEb3JrYSAmIEZlbGlcIixcclxuICAgIGRhdGU6IFwiRMOhdHVtOiAyMDI1LjA1LjE2LlwiLFxyXG4gICAgbG9jYXRpb246IFwiSGVseXN6w61uOiBGb3JzdGVyIFZhZMOhc3prYXN0w6lseVwiLFxyXG4gICAgYWRkcmVzczogXCIyMzQ3IEJ1Z3lpLCBSYWTDoW55aSB1dGNhIDE0LlwiLFxyXG4gICAgbWFwOiBcIk11dGFzZCBhIHTDqXJrw6lwZW5cIixcclxuICAgIHByb2dyYW1MYWJlbDogXCJQcm9ncmFtXCIsXHJcbiAgICBwcm9ncmFtOiBcIkhhbWFyb3NhblwiLFxyXG4gICAgbWVudUxhYmVsOiBcIk1lbsO8OlwiLFxyXG4gICAgbWVudTogXCJIYW1hcm9zYW5cIixcclxuICAgIGFjY29tbW9kYXRpb25MYWJlbDogXCJCxZF2ZWJiIGluZm9ybcOhY2nDsyBhIHN6w6FsbMOhc3LDs2w6XCIsXHJcbiAgICBhY2NvbW1vZGF0aW9uOiBcIkhhbWFyb3NhblwiLFxyXG4gICAgdGltZWxpbmU6IFtcclxuICAgICAgeyB0aW1lOiBcIjE1OjAwXCIsIGV2ZW50OiBcIlZlbmTDqWd2w6Fyw6FzXCIgfSxcclxuICAgICAgeyB0aW1lOiBcIjE2OjAwXCIsIGV2ZW50OiBcIlN6ZXJ0YXJ0w6FzXCIgfSxcclxuICAgICAgeyB0aW1lOiBcIjE4OjMwXCIsIGV2ZW50OiBcIlZhY3NvcmFcIiB9LFxyXG4gICAgICB7IHRpbWU6IFwiMjM6MDBcIiwgZXZlbnQ6IFwiTWVueWVjc2tldMOhbmNcIiB9LFxyXG4gICAgXSxcclxuICB9LFxyXG4gIGVuOiB7XHJcbiAgICB0aXRsZTogXCJEb3JrYSAmIEZlbGlcIixcclxuICAgIGRhdGU6IFwiRGF0ZTogMjAyNS0wNS0xNlwiLFxyXG4gICAgbG9jYXRpb246IFwiTG9jYXRpb246IEZvcnN0ZXIgSHVudGluZyBDYXN0bGVcIixcclxuICAgIGFkZHJlc3M6IFwiMjM0NyBCdWd5aSwgUmFkw6FueWkgc3RyZWV0IDE0LlwiLFxyXG4gICAgbWFwOiBcIlNob3cgb24gbWFwXCIsXHJcbiAgICBwcm9ncmFtTGFiZWw6IFwiUHJvZ3JhbVwiLFxyXG4gICAgcHJvZ3JhbTogXCJDb21pbmcgc29vblwiLFxyXG4gICAgbWVudUxhYmVsOiBcIk1lbnU6XCIsXHJcbiAgICBtZW51OiBcIkNvbWluZyBzb29uXCIsXHJcbiAgICBhY2NvbW1vZGF0aW9uTGFiZWw6IFwiTW9yZSBpbmZvIGFib3V0IGFjY29tbW9kYXRpb246XCIsXHJcbiAgICBhY2NvbW1vZGF0aW9uOiBcIkNvbWluZyBzb29uXCIsXHJcbiAgICB0aW1lbGluZTogW1xyXG4gICAgICB7IHRpbWU6IFwiMTU6MDBcIiwgZXZlbnQ6IFwiR3Vlc3QgYXJyaXZhbFwiIH0sXHJcbiAgICAgIHsgdGltZTogXCIxNjowMFwiLCBldmVudDogXCJDZXJlbW9ueVwiIH0sXHJcbiAgICAgIHsgdGltZTogXCIxODozMFwiLCBldmVudDogXCJEaW5uZXJcIiB9LFxyXG4gICAgICB7IHRpbWU6IFwiMjM6MDBcIiwgZXZlbnQ6IFwiQnJpZGUncyBkYW5jZVwiIH0sXHJcbiAgICBdLFxyXG4gIH0sXHJcbn07XHJcbiIsIjx0ZW1wbGF0ZT5cbiAgPHEtcGFnZSBjbGFzcz1cInBhZ2Utcm9vdFwiPlxuICAgIDxxLXRvb2xiYXIgY2xhc3M9XCJxLXBhLXNtIGJnLXRyYW5zcGFyZW50XCI+XG4gICAgICA8cS1zcGFjZSAvPlxuICAgICAgPHEtYnRuXG4gICAgICAgIGRlbnNlXG4gICAgICAgIGZsYXRcbiAgICAgICAgcm91bmRcbiAgICAgICAgY2xhc3M9XCJsYW5nLWJ0blwiXG4gICAgICAgIEBjbGljaz1cInRvZ2dsZUxvY2FsZVwiXG4gICAgICAgIGFyaWEtbGFiZWw9XCJMYW5ndWFnZVwiXG4gICAgICA+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiZmxhZ1wiPnt7IGN1cnJlbnRGbGFnIH19PC9zcGFuPlxuICAgICAgPC9xLWJ0bj5cbiAgICA8L3EtdG9vbGJhcj5cblxuICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LXdyYXBcIj5cbiAgICAgIDxxLWNhcmQgZmxhdCBjbGFzcz1cImNhcmRcIj5cbiAgICAgICAgPHEtY2FyZC1zZWN0aW9uIGNsYXNzPVwidGV4dC1jZW50ZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj57eyBtc2cudGl0bGUgfX08L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibWV0YVwiPnt7IG1zZy5kYXRlIH19PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1ldGFcIj57eyBtc2cubG9jYXRpb24gfX08L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibWV0YVwiPnt7IG1zZy5hZGRyZXNzIH19PC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlua3MgcS1tdC1tZFwiPlxuICAgICAgICAgICAgPHEtYnRuIGZsYXQgY29sb3I9XCJwcmltYXJ5XCIgQGNsaWNrPVwib3Blbk1hcFwiPlxuICAgICAgICAgICAgICB7eyBtc2cubWFwIH19XG4gICAgICAgICAgICA8L3EtYnRuPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPHEtc2VwYXJhdG9yIHNwYWNlZCAvPlxuXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyYW0tc2VjdGlvblwiPlxuICAgICAgICAgICAgPGgzPnt7IG1zZy5wcm9ncmFtTGFiZWwgfX08L2gzPlxuICAgICAgICAgICAgPHEtdGltZWxpbmUgY29sb3I9XCJ0aW1lbGluZS1hY2NlbnRcIiBsYXlvdXQ9XCJkZW5zZVwiPlxuICAgICAgICAgICAgICA8cS10aW1lbGluZS1lbnRyeVxuICAgICAgICAgICAgICAgIHYtZm9yPVwiKGl0ZW0sIGluZGV4KSBpbiBtc2cudGltZWxpbmVcIlxuICAgICAgICAgICAgICAgIDprZXk9XCJpbmRleFwiXG4gICAgICAgICAgICAgICAgOnRpdGxlPVwiaXRlbS50aW1lXCJcbiAgICAgICAgICAgICAgICA6c3VidGl0bGU9XCJpdGVtLmV2ZW50XCJcbiAgICAgICAgICAgICAgICBpY29uPVwiYmVkdGltZVwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L3EtdGltZWxpbmU+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8cS1zZXBhcmF0b3Igc3BhY2VkIC8+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5mb1wiPlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPHN0cm9uZz57eyBtc2cubWVudUxhYmVsIH19PC9zdHJvbmc+IHt7IG1zZy5tZW51IH19XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxzdHJvbmc+e3sgbXNnLmFjY29tbW9kYXRpb25MYWJlbCB9fTwvc3Ryb25nPlxuICAgICAgICAgICAgICB7eyBtc2cuYWNjb21tb2RhdGlvbiB9fVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvcS1jYXJkLXNlY3Rpb24+XG4gICAgICA8L3EtY2FyZD5cbiAgICA8L2Rpdj5cbiAgPC9xLXBhZ2U+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0IHNldHVwPlxuaW1wb3J0IHsgcmVmLCBjb21wdXRlZCB9IGZyb20gXCJ2dWVcIjtcbmltcG9ydCBtZXNzYWdlcyBmcm9tIFwic3JjL2kxOG4vbWVzc2FnZXNcIjtcblxuY29uc3QgbG9jYWxlID0gcmVmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibG9jYWxlXCIpIHx8IFwiaHVcIik7XG5cbmNvbnN0IHNldExvY2FsZSA9IChsKSA9PiB7XG4gIGxvY2FsZS52YWx1ZSA9IGw7XG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibG9jYWxlXCIsIGwpO1xufTtcblxuY29uc3QgdG9nZ2xlTG9jYWxlID0gKCkgPT4ge1xuICBzZXRMb2NhbGUobG9jYWxlLnZhbHVlID09PSBcImh1XCIgPyBcImVuXCIgOiBcImh1XCIpO1xufTtcblxuY29uc3QgbXNnID0gY29tcHV0ZWQoKCkgPT4gbWVzc2FnZXNbbG9jYWxlLnZhbHVlXSB8fCBtZXNzYWdlcy5odSk7XG5jb25zdCBjdXJyZW50RmxhZyA9IGNvbXB1dGVkKCgpID0+IChsb2NhbGUudmFsdWUgPT09IFwiaHVcIiA/IFwi8J+HrfCfh7pcIiA6IFwi8J+HrPCfh6dcIikpO1xuXG5jb25zdCBvcGVuTWFwID0gKCkgPT4ge1xuICB3aW5kb3cub3BlbihcbiAgICBcImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9zZWFyY2gvRm9yc3RlcitWYWTDoXN6a2FzdMOpbHksKzIzNDcrQnVneWksK1JhZMOhbnlpK3V0Y2ErMTRcIixcbiAgICBcIl9ibGFua1wiXG4gICk7XG59O1xuPC9zY3JpcHQ+XG5cbjxzdHlsZSBzY29wZWQ+XG46cm9vdCB7XG4gIC0tYy1iZzogI2YwZDNkMzsgLyogbGlnaHQgbmV1dHJhbCAqL1xuICAtLWMtYWNjZW50OiAjYzU5YjZlOyAvKiB3YXJtIGFjY2VudCAqL1xuICAtLWMtY2FyZDogI2RkYmVhOTsgLyogY2FyZCBiZyAqL1xuICAtLWMtdGV4dDogIzY4NzA1YzsgLyogdGV4dCAqL1xuICAtLWMtbXV0ZWQ6ICM4YjdhNzM7IC8qIG11dGVkICovXG4gIC0tdGltZWxpbmUtYWNjZW50OiAjYTg0ZDc5OyAvKiBwdXJwbGUvbWFnZW50YSAqL1xufVxuXG4ucGFnZS1yb290IHtcbiAgbWluLWhlaWdodDogMTAwdmg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGJhY2tncm91bmQ6IHZhcigtLWMtYmcpO1xuICBjb2xvcjogdmFyKC0tYy10ZXh0KTtcbn1cblxuLmNvbnRlbnQtd3JhcCB7XG4gIGZsZXg6IDE7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwYWRkaW5nOiAzMnB4O1xufVxuXG4uY2FyZCB7XG4gIG1heC13aWR0aDogNzIwcHg7XG4gIHdpZHRoOiAxMDAlO1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1jLWNhcmQpO1xuICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICBib3gtc2hhZG93OiAwIDhweCAzMHB4IHJnYmEoMCwgMCwgMCwgMC4wOCk7XG4gIHBhZGRpbmc6IDI0cHg7XG59XG5cbi50aXRsZSB7XG4gIGZvbnQtc2l6ZTogMi4ycmVtO1xuICBmb250LXdlaWdodDogNzAwO1xuICBjb2xvcjogdmFyKC0tYy10ZXh0KTtcbn1cblxuLm1ldGEge1xuICBjb2xvcjogdmFyKC0tYy10ZXh0KTtcbiAgbWFyZ2luLXRvcDogNnB4O1xufVxuXG4ubGlua3MgcS1idG4ge1xuICBtYXJnaW4tdG9wOiAxMHB4O1xufVxuXG4ucHJvZ3JhbS1zZWN0aW9uIHtcbiAgbWFyZ2luLXRvcDogMTJweDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbn1cblxuLnByb2dyYW0tc2VjdGlvbiBoMyB7XG4gIGNvbG9yOiB2YXIoLS1jLXRleHQpO1xuICBtYXJnaW46IDAgMCAxNnB4IDA7XG4gIGZvbnQtc2l6ZTogMS41cmVtO1xufVxuXG46ZGVlcCgucS10aW1lbGluZV9fZW50cnktZG90KSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRpbWVsaW5lLWFjY2VudCkgIWltcG9ydGFudDtcbn1cblxuOmRlZXAoLnEtdGltZWxpbmVfX2VudHJ5LWRvdCBzdmcpIHtcbiAgY29sb3I6IHdoaXRlICFpbXBvcnRhbnQ7XG59XG5cbjpkZWVwKC5xLXRpbWVsaW5lX19kb3Qtc2VwYXJhdG9yKSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRpbWVsaW5lLWFjY2VudCkgIWltcG9ydGFudDtcbn1cblxuOmRlZXAoLnEtdGltZWxpbmVfX2VudHJ5LXRpdGxlKSB7XG4gIGNvbG9yOiB2YXIoLS1jLXRleHQpICFpbXBvcnRhbnQ7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGZvbnQtc2l6ZTogMXJlbTtcbn1cblxuOmRlZXAoLnEtdGltZWxpbmVfX2VudHJ5LXN1YnRpdGxlKSB7XG4gIGNvbG9yOiB2YXIoLS1jLW11dGVkKSAhaW1wb3J0YW50O1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBmb250LXNpemU6IDAuNzVyZW07XG4gIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbn1cblxuLmluZm8ge1xuICBtYXJnaW4tdG9wOiAxMnB4O1xuICBjb2xvcjogdmFyKC0tYy10ZXh0KTtcbiAgbGluZS1oZWlnaHQ6IDEuNjtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbn1cblxuLyogbGFuZ3VhZ2UgYnV0dG9uICovXG4ubGFuZy1idG4ge1xuICBtaW4td2lkdGg6IDQwcHg7XG4gIG1pbi1oZWlnaHQ6IDQwcHg7XG4gIHBhZGRpbmc6IDA7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuLmxhbmctYnRuIC5mbGFnIHtcbiAgZm9udC1zaXplOiAyMHB4O1xuICBsaW5lLWhlaWdodDogMTtcbn1cbjwvc3R5bGU+XG4iXSwibmFtZXMiOlsiY29udGVudCJdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLE1BQU0sUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLFVBQVMsQ0FBRTtBQUUzQyxJQUFBLFNBQWUsZ0JBQWdCO0FBQUEsRUFDN0IsTUFBTTtBQUFBLEVBRU4sUUFBUztBQUNQLFdBQU8sTUFBTTtBQUFBLEVBQ2Q7QUFDSCxDQUFDO0FDUEQsSUFBQSxXQUFlLGdCQUFnQjtBQUFBLEVBQzdCLE1BQU07QUFBQSxFQUVOLE9BQU87QUFBQSxJQUNMLE9BQU87QUFBQSxFQUNSO0FBQUEsRUFFRCxNQUFPLE9BQU8sRUFBRSxTQUFTO0FBQ3ZCLFVBQU0sVUFBVTtBQUFBLE1BQVMsTUFDdkIsd0NBQ0csTUFBTSxVQUFVLE9BQU8sc0JBQXNCO0FBQUEsSUFDakQ7QUFFRCxXQUFPLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxRQUFRLE9BQU8sTUFBTSxVQUFTLEdBQUksTUFBTSxNQUFNLE9BQU8sQ0FBQztBQUFBLEVBQ3RGO0FBQ0gsQ0FBQztBQ2RELE1BQU0sV0FBVztBQUFBLEVBQ2YsTUFBTTtBQUFBLEVBQ04sTUFBTTtBQUFBLEVBQ04sa0JBQWtCO0FBQ3BCO0FBRU8sTUFBTSxVQUFVO0FBQUEsRUFDckIsSUFBSTtBQUFBLEVBQ0osSUFBSTtBQUFBLEVBQ0osSUFBSTtBQUFBLEVBQ0osSUFBSTtBQUFBLEVBQ0osSUFBSTtBQUNOO0FBRUEsSUFBQSxhQUFlLGdCQUFnQjtBQUFBLEVBQzdCLE1BQU07QUFBQSxFQUVOLE9BQU87QUFBQSxJQUNMLEdBQUc7QUFBQSxJQUVILFFBQVEsQ0FBRSxTQUFTLE1BQVE7QUFBQSxJQUMzQixPQUFPLENBQUUsU0FBUyxNQUFRO0FBQUEsSUFDMUIsVUFBVTtBQUFBLElBQ1YsT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLEVBQ1A7QUFBQSxFQUVELE1BQU8sT0FBTztBQUNaLFVBQU0sS0FB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
