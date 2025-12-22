import { a as computed, c as createComponent, h, K as createDirective, t as isKeyCode, L as addEvt, M as cleanEvt, N as stop, O as position, r as ref, u as stopAndPrevent, P as prevent, f as onBeforeUnmount, T as Transition, Q as withDirectives, j as listenOpts, g as getCurrentInstance } from "./index.4401bd22.js";
import { e as useSizeDefaults, c as css, f as useSizeProps, u as useRouterLinkProps, i as useSize, b as useRouterLink, Q as QIcon, a as hMergeSlot } from "./use-router-link.3a37b2d6.js";
const useSpinnerProps = {
  size: {
    type: [Number, String],
    default: "1em"
  },
  color: String
};
function useSpinner(props) {
  return {
    cSize: computed(() => props.size in useSizeDefaults ? `${useSizeDefaults[props.size]}px` : props.size),
    classes: computed(
      () => "q-spinner" + (props.color ? ` text-${props.color}` : "")
    )
  };
}
var QSpinner = createComponent({
  name: "QSpinner",
  props: {
    ...useSpinnerProps,
    thickness: {
      type: Number,
      default: 5
    }
  },
  setup(props) {
    const { cSize, classes } = useSpinner(props);
    return () => h("svg", {
      class: classes.value + " q-spinner-mat",
      width: cSize.value,
      height: cSize.value,
      viewBox: "25 25 50 50"
    }, [
      h("circle", {
        class: "path",
        cx: "50",
        cy: "50",
        r: "20",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": props.thickness,
        "stroke-miterlimit": "10"
      })
    ]);
  }
});
function throttle(fn, limit = 250) {
  let wait = false, result;
  return function() {
    if (wait === false) {
      wait = true;
      setTimeout(() => {
        wait = false;
      }, limit);
      result = fn.apply(this, arguments);
    }
    return result;
  };
}
function showRipple(evt, el, ctx, forceCenter) {
  ctx.modifiers.stop === true && stop(evt);
  const color = ctx.modifiers.color;
  let center = ctx.modifiers.center;
  center = center === true || forceCenter === true;
  const node = document.createElement("span"), innerNode = document.createElement("span"), pos = position(evt), { left, top, width, height } = el.getBoundingClientRect(), diameter = Math.sqrt(width * width + height * height), radius = diameter / 2, centerX = `${(width - diameter) / 2}px`, x = center ? centerX : `${pos.left - left - radius}px`, centerY = `${(height - diameter) / 2}px`, y = center ? centerY : `${pos.top - top - radius}px`;
  innerNode.className = "q-ripple__inner";
  css(innerNode, {
    height: `${diameter}px`,
    width: `${diameter}px`,
    transform: `translate3d(${x},${y},0) scale3d(.2,.2,1)`,
    opacity: 0
  });
  node.className = `q-ripple${color ? " text-" + color : ""}`;
  node.setAttribute("dir", "ltr");
  node.appendChild(innerNode);
  el.appendChild(node);
  const abort = () => {
    node.remove();
    clearTimeout(timer);
  };
  ctx.abort.push(abort);
  let timer = setTimeout(() => {
    innerNode.classList.add("q-ripple__inner--enter");
    innerNode.style.transform = `translate3d(${centerX},${centerY},0) scale3d(1,1,1)`;
    innerNode.style.opacity = 0.2;
    timer = setTimeout(() => {
      innerNode.classList.remove("q-ripple__inner--enter");
      innerNode.classList.add("q-ripple__inner--leave");
      innerNode.style.opacity = 0;
      timer = setTimeout(() => {
        node.remove();
        ctx.abort.splice(ctx.abort.indexOf(abort), 1);
      }, 275);
    }, 250);
  }, 50);
}
function updateModifiers(ctx, { modifiers, value, arg }) {
  const cfg = Object.assign({}, ctx.cfg.ripple, modifiers, value);
  ctx.modifiers = {
    early: cfg.early === true,
    stop: cfg.stop === true,
    center: cfg.center === true,
    color: cfg.color || arg,
    keyCodes: [].concat(cfg.keyCodes || 13)
  };
}
var Ripple = createDirective(
  {
    name: "ripple",
    beforeMount(el, binding) {
      const cfg = binding.instance.$.appContext.config.globalProperties.$q.config || {};
      if (cfg.ripple === false) {
        return;
      }
      const ctx = {
        cfg,
        enabled: binding.value !== false,
        modifiers: {},
        abort: [],
        start(evt) {
          if (ctx.enabled === true && evt.qSkipRipple !== true && evt.type === (ctx.modifiers.early === true ? "pointerdown" : "click")) {
            showRipple(evt, el, ctx, evt.qKeyEvent === true);
          }
        },
        keystart: throttle((evt) => {
          if (ctx.enabled === true && evt.qSkipRipple !== true && isKeyCode(evt, ctx.modifiers.keyCodes) === true && evt.type === `key${ctx.modifiers.early === true ? "down" : "up"}`) {
            showRipple(evt, el, ctx, true);
          }
        }, 300)
      };
      updateModifiers(ctx, binding);
      el.__qripple = ctx;
      addEvt(ctx, "main", [
        [el, "pointerdown", "start", "passive"],
        [el, "click", "start", "passive"],
        [el, "keydown", "keystart", "passive"],
        [el, "keyup", "keystart", "passive"]
      ]);
    },
    updated(el, binding) {
      if (binding.oldValue !== binding.value) {
        const ctx = el.__qripple;
        if (ctx !== void 0) {
          ctx.enabled = binding.value !== false;
          if (ctx.enabled === true && Object(binding.value) === binding.value) {
            updateModifiers(ctx, binding);
          }
        }
      }
    },
    beforeUnmount(el) {
      const ctx = el.__qripple;
      if (ctx !== void 0) {
        ctx.abort.forEach((fn) => {
          fn();
        });
        cleanEvt(ctx, "main");
        delete el._qripple;
      }
    }
  }
);
const alignMap = {
  left: "start",
  center: "center",
  right: "end",
  between: "between",
  around: "around",
  evenly: "evenly",
  stretch: "stretch"
};
const alignValues = Object.keys(alignMap);
const useAlignProps = {
  align: {
    type: String,
    validator: (v) => alignValues.includes(v)
  }
};
function useAlign(props) {
  return computed(() => {
    const align = props.align === void 0 ? props.vertical === true ? "stretch" : "left" : props.align;
    return `${props.vertical === true ? "items" : "justify"}-${alignMap[align]}`;
  });
}
const btnPadding = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};
const defaultSizes = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24
};
const formTypes = ["button", "submit", "reset"];
const mediaTypeRE = /[^\s]\/[^\s]/;
const btnDesignOptions = ["flat", "outline", "push", "unelevated"];
function getBtnDesign(props, defaultValue) {
  if (props.flat === true)
    return "flat";
  if (props.outline === true)
    return "outline";
  if (props.push === true)
    return "push";
  if (props.unelevated === true)
    return "unelevated";
  return defaultValue;
}
const useBtnProps = {
  ...useSizeProps,
  ...useRouterLinkProps,
  type: {
    type: String,
    default: "button"
  },
  label: [Number, String],
  icon: String,
  iconRight: String,
  ...btnDesignOptions.reduce(
    (acc, val) => (acc[val] = Boolean) && acc,
    {}
  ),
  square: Boolean,
  round: Boolean,
  rounded: Boolean,
  glossy: Boolean,
  size: String,
  fab: Boolean,
  fabMini: Boolean,
  padding: String,
  color: String,
  textColor: String,
  noCaps: Boolean,
  noWrap: Boolean,
  dense: Boolean,
  tabindex: [Number, String],
  ripple: {
    type: [Boolean, Object],
    default: true
  },
  align: {
    ...useAlignProps.align,
    default: "center"
  },
  stack: Boolean,
  stretch: Boolean,
  loading: {
    type: Boolean,
    default: null
  },
  disable: Boolean
};
function useBtn(props) {
  const sizeStyle = useSize(props, defaultSizes);
  const alignClass = useAlign(props);
  const { hasRouterLink, hasLink, linkTag, linkAttrs, navigateOnClick } = useRouterLink({
    fallbackTag: "button"
  });
  const style = computed(() => {
    const obj = props.fab === false && props.fabMini === false ? sizeStyle.value : {};
    return props.padding !== void 0 ? Object.assign({}, obj, {
      padding: props.padding.split(/\s+/).map((v) => v in btnPadding ? btnPadding[v] + "px" : v).join(" "),
      minWidth: "0",
      minHeight: "0"
    }) : obj;
  });
  const isRounded = computed(
    () => props.rounded === true || props.fab === true || props.fabMini === true
  );
  const isActionable = computed(
    () => props.disable !== true && props.loading !== true
  );
  const tabIndex = computed(() => isActionable.value === true ? props.tabindex || 0 : -1);
  const design = computed(() => getBtnDesign(props, "standard"));
  const attributes = computed(() => {
    const acc = { tabindex: tabIndex.value };
    if (hasLink.value === true) {
      Object.assign(acc, linkAttrs.value);
    } else if (formTypes.includes(props.type) === true) {
      acc.type = props.type;
    }
    if (linkTag.value === "a") {
      if (props.disable === true) {
        acc["aria-disabled"] = "true";
      } else if (acc.href === void 0) {
        acc.role = "button";
      }
      if (hasRouterLink.value !== true && mediaTypeRE.test(props.type) === true) {
        acc.type = props.type;
      }
    } else if (props.disable === true) {
      acc.disabled = "";
      acc["aria-disabled"] = "true";
    }
    if (props.loading === true && props.percentage !== void 0) {
      Object.assign(acc, {
        role: "progressbar",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": props.percentage
      });
    }
    return acc;
  });
  const classes = computed(() => {
    let colors;
    if (props.color !== void 0) {
      if (props.flat === true || props.outline === true) {
        colors = `text-${props.textColor || props.color}`;
      } else {
        colors = `bg-${props.color} text-${props.textColor || "white"}`;
      }
    } else if (props.textColor) {
      colors = `text-${props.textColor}`;
    }
    const shape = props.round === true ? "round" : `rectangle${isRounded.value === true ? " q-btn--rounded" : props.square === true ? " q-btn--square" : ""}`;
    return `q-btn--${design.value} q-btn--${shape}` + (colors !== void 0 ? " " + colors : "") + (isActionable.value === true ? " q-btn--actionable q-focusable q-hoverable" : props.disable === true ? " disabled" : "") + (props.fab === true ? " q-btn--fab" : props.fabMini === true ? " q-btn--fab-mini" : "") + (props.noCaps === true ? " q-btn--no-uppercase" : "") + (props.dense === true ? " q-btn--dense" : "") + (props.stretch === true ? " no-border-radius self-stretch" : "") + (props.glossy === true ? " glossy" : "") + (props.square ? " q-btn--square" : "");
  });
  const innerClasses = computed(
    () => alignClass.value + (props.stack === true ? " column" : " row") + (props.noWrap === true ? " no-wrap text-no-wrap" : "") + (props.loading === true ? " q-btn__content--hidden" : "")
  );
  return {
    classes,
    style,
    innerClasses,
    attributes,
    hasLink,
    linkTag,
    navigateOnClick,
    isActionable
  };
}
const { passiveCapture } = listenOpts;
let touchTarget = null, keyboardTarget = null, mouseTarget = null;
var QBtn = createComponent({
  name: "QBtn",
  props: {
    ...useBtnProps,
    percentage: Number,
    darkPercentage: Boolean,
    onTouchstart: [Function, Array]
  },
  emits: ["click", "keydown", "mousedown", "keyup"],
  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance();
    const {
      classes,
      style,
      innerClasses,
      attributes,
      hasLink,
      linkTag,
      navigateOnClick,
      isActionable
    } = useBtn(props);
    const rootRef = ref(null);
    const blurTargetRef = ref(null);
    let localTouchTargetEl = null, avoidMouseRipple, mouseTimer = null;
    const hasLabel = computed(
      () => props.label !== void 0 && props.label !== null && props.label !== ""
    );
    const ripple = computed(() => props.disable === true || props.ripple === false ? false : {
      keyCodes: hasLink.value === true ? [13, 32] : [13],
      ...props.ripple === true ? {} : props.ripple
    });
    const rippleProps = computed(() => ({ center: props.round }));
    const percentageStyle = computed(() => {
      const val = Math.max(0, Math.min(100, props.percentage));
      return val > 0 ? { transition: "transform 0.6s", transform: `translateX(${val - 100}%)` } : {};
    });
    const onEvents = computed(() => {
      if (props.loading === true) {
        return {
          onMousedown: onLoadingEvt,
          onTouchstart: onLoadingEvt,
          onClick: onLoadingEvt,
          onKeydown: onLoadingEvt,
          onKeyup: onLoadingEvt
        };
      }
      if (isActionable.value === true) {
        const acc = {
          onClick,
          onKeydown,
          onMousedown
        };
        if (proxy.$q.platform.has.touch === true) {
          const suffix = props.onTouchstart !== void 0 ? "" : "Passive";
          acc[`onTouchstart${suffix}`] = onTouchstart;
        }
        return acc;
      }
      return {
        onClick: stopAndPrevent
      };
    });
    const nodeProps = computed(() => ({
      ref: rootRef,
      class: "q-btn q-btn-item non-selectable no-outline " + classes.value,
      style: style.value,
      ...attributes.value,
      ...onEvents.value
    }));
    function onClick(e) {
      if (rootRef.value === null)
        return;
      if (e !== void 0) {
        if (e.defaultPrevented === true) {
          return;
        }
        const el = document.activeElement;
        if (props.type === "submit" && el !== document.body && rootRef.value.contains(el) === false && el.contains(rootRef.value) === false) {
          rootRef.value.focus();
          const onClickCleanup = () => {
            document.removeEventListener("keydown", stopAndPrevent, true);
            document.removeEventListener("keyup", onClickCleanup, passiveCapture);
            rootRef.value !== null && rootRef.value.removeEventListener("blur", onClickCleanup, passiveCapture);
          };
          document.addEventListener("keydown", stopAndPrevent, true);
          document.addEventListener("keyup", onClickCleanup, passiveCapture);
          rootRef.value.addEventListener("blur", onClickCleanup, passiveCapture);
        }
      }
      navigateOnClick(e);
    }
    function onKeydown(e) {
      if (rootRef.value === null)
        return;
      emit("keydown", e);
      if (isKeyCode(e, [13, 32]) === true && keyboardTarget !== rootRef.value) {
        keyboardTarget !== null && cleanup();
        if (e.defaultPrevented !== true) {
          rootRef.value.focus();
          keyboardTarget = rootRef.value;
          rootRef.value.classList.add("q-btn--active");
          document.addEventListener("keyup", onPressEnd, true);
          rootRef.value.addEventListener("blur", onPressEnd, passiveCapture);
        }
        stopAndPrevent(e);
      }
    }
    function onTouchstart(e) {
      if (rootRef.value === null)
        return;
      emit("touchstart", e);
      if (e.defaultPrevented === true)
        return;
      if (touchTarget !== rootRef.value) {
        touchTarget !== null && cleanup();
        touchTarget = rootRef.value;
        localTouchTargetEl = e.target;
        localTouchTargetEl.addEventListener("touchcancel", onPressEnd, passiveCapture);
        localTouchTargetEl.addEventListener("touchend", onPressEnd, passiveCapture);
      }
      avoidMouseRipple = true;
      mouseTimer !== null && clearTimeout(mouseTimer);
      mouseTimer = setTimeout(() => {
        mouseTimer = null;
        avoidMouseRipple = false;
      }, 200);
    }
    function onMousedown(e) {
      if (rootRef.value === null)
        return;
      e.qSkipRipple = avoidMouseRipple === true;
      emit("mousedown", e);
      if (e.defaultPrevented !== true && mouseTarget !== rootRef.value) {
        mouseTarget !== null && cleanup();
        mouseTarget = rootRef.value;
        rootRef.value.classList.add("q-btn--active");
        document.addEventListener("mouseup", onPressEnd, passiveCapture);
      }
    }
    function onPressEnd(e) {
      if (rootRef.value === null)
        return;
      if (e !== void 0 && e.type === "blur" && document.activeElement === rootRef.value) {
        return;
      }
      if (e !== void 0 && e.type === "keyup") {
        if (keyboardTarget === rootRef.value && isKeyCode(e, [13, 32]) === true) {
          const evt = new MouseEvent("click", e);
          evt.qKeyEvent = true;
          e.defaultPrevented === true && prevent(evt);
          e.cancelBubble === true && stop(evt);
          rootRef.value.dispatchEvent(evt);
          stopAndPrevent(e);
          e.qKeyEvent = true;
        }
        emit("keyup", e);
      }
      cleanup();
    }
    function cleanup(destroying) {
      const blurTarget = blurTargetRef.value;
      if (destroying !== true && (touchTarget === rootRef.value || mouseTarget === rootRef.value) && blurTarget !== null && blurTarget !== document.activeElement) {
        blurTarget.setAttribute("tabindex", -1);
        blurTarget.focus();
      }
      if (touchTarget === rootRef.value) {
        if (localTouchTargetEl !== null) {
          localTouchTargetEl.removeEventListener("touchcancel", onPressEnd, passiveCapture);
          localTouchTargetEl.removeEventListener("touchend", onPressEnd, passiveCapture);
        }
        touchTarget = localTouchTargetEl = null;
      }
      if (mouseTarget === rootRef.value) {
        document.removeEventListener("mouseup", onPressEnd, passiveCapture);
        mouseTarget = null;
      }
      if (keyboardTarget === rootRef.value) {
        document.removeEventListener("keyup", onPressEnd, true);
        rootRef.value !== null && rootRef.value.removeEventListener("blur", onPressEnd, passiveCapture);
        keyboardTarget = null;
      }
      rootRef.value !== null && rootRef.value.classList.remove("q-btn--active");
    }
    function onLoadingEvt(evt) {
      stopAndPrevent(evt);
      evt.qSkipRipple = true;
    }
    onBeforeUnmount(() => {
      cleanup(true);
    });
    Object.assign(proxy, {
      click: (e) => {
        if (isActionable.value === true) {
          onClick(e);
        }
      }
    });
    return () => {
      let inner = [];
      props.icon !== void 0 && inner.push(
        h(QIcon, {
          name: props.icon,
          left: props.stack !== true && hasLabel.value === true,
          role: "img",
          "aria-hidden": "true"
        })
      );
      hasLabel.value === true && inner.push(
        h("span", { class: "block" }, [props.label])
      );
      inner = hMergeSlot(slots.default, inner);
      if (props.iconRight !== void 0 && props.round === false) {
        inner.push(
          h(QIcon, {
            name: props.iconRight,
            right: props.stack !== true && hasLabel.value === true,
            role: "img",
            "aria-hidden": "true"
          })
        );
      }
      const child = [
        h("span", {
          class: "q-focus-helper",
          ref: blurTargetRef
        })
      ];
      if (props.loading === true && props.percentage !== void 0) {
        child.push(
          h("span", {
            class: "q-btn__progress absolute-full overflow-hidden" + (props.darkPercentage === true ? " q-btn__progress--dark" : "")
          }, [
            h("span", {
              class: "q-btn__progress-indicator fit block",
              style: percentageStyle.value
            })
          ])
        );
      }
      child.push(
        h("span", {
          class: "q-btn__content text-center col items-center q-anchor--skip " + innerClasses.value
        }, inner)
      );
      props.loading !== null && child.push(
        h(Transition, {
          name: "q-transition--fade"
        }, () => props.loading === true ? [
          h("span", {
            key: "loading",
            class: "absolute-full flex flex-center"
          }, slots.loading !== void 0 ? slots.loading() : [h(QSpinner)])
        ] : null)
      );
      return withDirectives(
        h(
          linkTag.value,
          nodeProps.value,
          child
        ),
        [[
          Ripple,
          ripple.value,
          void 0,
          rippleProps.value
        ]]
      );
    };
  }
});
export { QBtn as Q };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUUJ0bi4yNTY3ZDJlYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3F1YXNhci9zcmMvY29tcG9uZW50cy9zcGlubmVyL3VzZS1zcGlubmVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3F1YXNhci9zcmMvY29tcG9uZW50cy9zcGlubmVyL1FTcGlubmVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3F1YXNhci9zcmMvdXRpbHMvdGhyb3R0bGUvdGhyb3R0bGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcXVhc2FyL3NyYy9kaXJlY3RpdmVzL3JpcHBsZS9SaXBwbGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcXVhc2FyL3NyYy9jb21wb3NhYmxlcy9wcml2YXRlLnVzZS1hbGlnbi91c2UtYWxpZ24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcXVhc2FyL3NyYy9jb21wb25lbnRzL2J0bi91c2UtYnRuLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3F1YXNhci9zcmMvY29tcG9uZW50cy9idG4vUUJ0bi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJ3Z1ZSdcbmltcG9ydCB7IHVzZVNpemVEZWZhdWx0cyB9IGZyb20gJy4uLy4uL2NvbXBvc2FibGVzL3ByaXZhdGUudXNlLXNpemUvdXNlLXNpemUuanMnXG5cbmV4cG9ydCBjb25zdCB1c2VTcGlubmVyUHJvcHMgPSB7XG4gIHNpemU6IHtcbiAgICB0eXBlOiBbIE51bWJlciwgU3RyaW5nIF0sXG4gICAgZGVmYXVsdDogJzFlbSdcbiAgfSxcbiAgY29sb3I6IFN0cmluZ1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VTcGlubmVyIChwcm9wcykge1xuICByZXR1cm4ge1xuICAgIGNTaXplOiBjb21wdXRlZCgoKSA9PiAoXG4gICAgICBwcm9wcy5zaXplIGluIHVzZVNpemVEZWZhdWx0c1xuICAgICAgICA/IGAkeyB1c2VTaXplRGVmYXVsdHNbIHByb3BzLnNpemUgXSB9cHhgXG4gICAgICAgIDogcHJvcHMuc2l6ZVxuICAgICkpLFxuXG4gICAgY2xhc3NlczogY29tcHV0ZWQoKCkgPT5cbiAgICAgICdxLXNwaW5uZXInICsgKHByb3BzLmNvbG9yID8gYCB0ZXh0LSR7IHByb3BzLmNvbG9yIH1gIDogJycpXG4gICAgKVxuICB9XG59XG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAndnVlJ1xuXG5pbXBvcnQgdXNlU3Bpbm5lciwgeyB1c2VTcGlubmVyUHJvcHMgfSBmcm9tICcuL3VzZS1zcGlubmVyLmpzJ1xuXG5pbXBvcnQgeyBjcmVhdGVDb21wb25lbnQgfSBmcm9tICcuLi8uLi91dGlscy9wcml2YXRlLmNyZWF0ZS9jcmVhdGUuanMnXG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUNvbXBvbmVudCh7XG4gIG5hbWU6ICdRU3Bpbm5lcicsXG5cbiAgcHJvcHM6IHtcbiAgICAuLi51c2VTcGlubmVyUHJvcHMsXG5cbiAgICB0aGlja25lc3M6IHtcbiAgICAgIHR5cGU6IE51bWJlcixcbiAgICAgIGRlZmF1bHQ6IDVcbiAgICB9XG4gIH0sXG5cbiAgc2V0dXAgKHByb3BzKSB7XG4gICAgY29uc3QgeyBjU2l6ZSwgY2xhc3NlcyB9ID0gdXNlU3Bpbm5lcihwcm9wcylcblxuICAgIHJldHVybiAoKSA9PiBoKCdzdmcnLCB7XG4gICAgICBjbGFzczogY2xhc3Nlcy52YWx1ZSArICcgcS1zcGlubmVyLW1hdCcsXG4gICAgICB3aWR0aDogY1NpemUudmFsdWUsXG4gICAgICBoZWlnaHQ6IGNTaXplLnZhbHVlLFxuICAgICAgdmlld0JveDogJzI1IDI1IDUwIDUwJ1xuICAgIH0sIFtcbiAgICAgIGgoJ2NpcmNsZScsIHtcbiAgICAgICAgY2xhc3M6ICdwYXRoJyxcbiAgICAgICAgY3g6ICc1MCcsXG4gICAgICAgIGN5OiAnNTAnLFxuICAgICAgICByOiAnMjAnLFxuICAgICAgICBmaWxsOiAnbm9uZScsXG4gICAgICAgIHN0cm9rZTogJ2N1cnJlbnRDb2xvcicsXG4gICAgICAgICdzdHJva2Utd2lkdGgnOiBwcm9wcy50aGlja25lc3MsXG4gICAgICAgICdzdHJva2UtbWl0ZXJsaW1pdCc6ICcxMCdcbiAgICAgIH0pXG4gICAgXSlcbiAgfVxufSlcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChmbiwgbGltaXQgPSAyNTApIHtcbiAgbGV0IHdhaXQgPSBmYWxzZSwgcmVzdWx0XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgaWYgKHdhaXQgPT09IGZhbHNlKSB7XG4gICAgICB3YWl0ID0gdHJ1ZVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHdhaXQgPSBmYWxzZSB9LCBsaW1pdClcbiAgICAgIHJlc3VsdCA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cbiIsImltcG9ydCB7IGNyZWF0ZURpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL3V0aWxzL3ByaXZhdGUuY3JlYXRlL2NyZWF0ZS5qcydcbmltcG9ydCB7IGNzcyB9IGZyb20gJy4uLy4uL3V0aWxzL2RvbS9kb20uanMnXG5pbXBvcnQgeyBwb3NpdGlvbiwgc3RvcCwgYWRkRXZ0LCBjbGVhbkV2dCB9IGZyb20gJy4uLy4uL3V0aWxzL2V2ZW50L2V2ZW50LmpzJ1xuaW1wb3J0IHsgaXNLZXlDb2RlIH0gZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS5rZXlib2FyZC9rZXktY29tcG9zaXRpb24uanMnXG5pbXBvcnQgdGhyb3R0bGUgZnJvbSAnLi4vLi4vdXRpbHMvdGhyb3R0bGUvdGhyb3R0bGUuanMnXG5pbXBvcnQgZ2V0U1NSUHJvcHMgZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS5ub29wLXNzci1kaXJlY3RpdmUtdHJhbnNmb3JtL25vb3Atc3NyLWRpcmVjdGl2ZS10cmFuc2Zvcm0uanMnXG5cbmZ1bmN0aW9uIHNob3dSaXBwbGUgKGV2dCwgZWwsIGN0eCwgZm9yY2VDZW50ZXIpIHtcbiAgY3R4Lm1vZGlmaWVycy5zdG9wID09PSB0cnVlICYmIHN0b3AoZXZ0KVxuXG4gIGNvbnN0IGNvbG9yID0gY3R4Lm1vZGlmaWVycy5jb2xvclxuICBsZXQgY2VudGVyID0gY3R4Lm1vZGlmaWVycy5jZW50ZXJcbiAgY2VudGVyID0gY2VudGVyID09PSB0cnVlIHx8IGZvcmNlQ2VudGVyID09PSB0cnVlXG5cbiAgY29uc3RcbiAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpLFxuICAgIGlubmVyTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSxcbiAgICBwb3MgPSBwb3NpdGlvbihldnQpLFxuICAgIHsgbGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0IH0gPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSxcbiAgICBkaWFtZXRlciA9IE1hdGguc3FydCh3aWR0aCAqIHdpZHRoICsgaGVpZ2h0ICogaGVpZ2h0KSxcbiAgICByYWRpdXMgPSBkaWFtZXRlciAvIDIsXG4gICAgY2VudGVyWCA9IGAkeyAod2lkdGggLSBkaWFtZXRlcikgLyAyIH1weGAsXG4gICAgeCA9IGNlbnRlciA/IGNlbnRlclggOiBgJHsgcG9zLmxlZnQgLSBsZWZ0IC0gcmFkaXVzIH1weGAsXG4gICAgY2VudGVyWSA9IGAkeyAoaGVpZ2h0IC0gZGlhbWV0ZXIpIC8gMiB9cHhgLFxuICAgIHkgPSBjZW50ZXIgPyBjZW50ZXJZIDogYCR7IHBvcy50b3AgLSB0b3AgLSByYWRpdXMgfXB4YFxuXG4gIGlubmVyTm9kZS5jbGFzc05hbWUgPSAncS1yaXBwbGVfX2lubmVyJ1xuICBjc3MoaW5uZXJOb2RlLCB7XG4gICAgaGVpZ2h0OiBgJHsgZGlhbWV0ZXIgfXB4YCxcbiAgICB3aWR0aDogYCR7IGRpYW1ldGVyIH1weGAsXG4gICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlM2QoJHsgeCB9LCR7IHkgfSwwKSBzY2FsZTNkKC4yLC4yLDEpYCxcbiAgICBvcGFjaXR5OiAwXG4gIH0pXG5cbiAgbm9kZS5jbGFzc05hbWUgPSBgcS1yaXBwbGUkeyBjb2xvciA/ICcgdGV4dC0nICsgY29sb3IgOiAnJyB9YFxuICBub2RlLnNldEF0dHJpYnV0ZSgnZGlyJywgJ2x0cicpXG4gIG5vZGUuYXBwZW5kQ2hpbGQoaW5uZXJOb2RlKVxuICBlbC5hcHBlbmRDaGlsZChub2RlKVxuXG4gIGNvbnN0IGFib3J0ID0gKCkgPT4ge1xuICAgIG5vZGUucmVtb3ZlKClcbiAgICBjbGVhclRpbWVvdXQodGltZXIpXG4gIH1cbiAgY3R4LmFib3J0LnB1c2goYWJvcnQpXG5cbiAgbGV0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgaW5uZXJOb2RlLmNsYXNzTGlzdC5hZGQoJ3EtcmlwcGxlX19pbm5lci0tZW50ZXInKVxuICAgIGlubmVyTm9kZS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHsgY2VudGVyWCB9LCR7IGNlbnRlclkgfSwwKSBzY2FsZTNkKDEsMSwxKWBcbiAgICBpbm5lck5vZGUuc3R5bGUub3BhY2l0eSA9IDAuMlxuXG4gICAgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlubmVyTm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdxLXJpcHBsZV9faW5uZXItLWVudGVyJylcbiAgICAgIGlubmVyTm9kZS5jbGFzc0xpc3QuYWRkKCdxLXJpcHBsZV9faW5uZXItLWxlYXZlJylcbiAgICAgIGlubmVyTm9kZS5zdHlsZS5vcGFjaXR5ID0gMFxuXG4gICAgICB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBub2RlLnJlbW92ZSgpXG4gICAgICAgIGN0eC5hYm9ydC5zcGxpY2UoY3R4LmFib3J0LmluZGV4T2YoYWJvcnQpLCAxKVxuICAgICAgfSwgMjc1KVxuICAgIH0sIDI1MClcbiAgfSwgNTApXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZU1vZGlmaWVycyAoY3R4LCB7IG1vZGlmaWVycywgdmFsdWUsIGFyZyB9KSB7XG4gIGNvbnN0IGNmZyA9IE9iamVjdC5hc3NpZ24oe30sIGN0eC5jZmcucmlwcGxlLCBtb2RpZmllcnMsIHZhbHVlKVxuICBjdHgubW9kaWZpZXJzID0ge1xuICAgIGVhcmx5OiBjZmcuZWFybHkgPT09IHRydWUsXG4gICAgc3RvcDogY2ZnLnN0b3AgPT09IHRydWUsXG4gICAgY2VudGVyOiBjZmcuY2VudGVyID09PSB0cnVlLFxuICAgIGNvbG9yOiBjZmcuY29sb3IgfHwgYXJnLFxuICAgIGtleUNvZGVzOiBbXS5jb25jYXQoY2ZnLmtleUNvZGVzIHx8IDEzKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZURpcmVjdGl2ZShfX1FVQVNBUl9TU1JfU0VSVkVSX19cbiAgPyB7IG5hbWU6ICdyaXBwbGUnLCBnZXRTU1JQcm9wcyB9XG4gIDoge1xuICAgICAgbmFtZTogJ3JpcHBsZScsXG5cbiAgICAgIGJlZm9yZU1vdW50IChlbCwgYmluZGluZykge1xuICAgICAgICBjb25zdCBjZmcgPSBiaW5kaW5nLmluc3RhbmNlLiQuYXBwQ29udGV4dC5jb25maWcuZ2xvYmFsUHJvcGVydGllcy4kcS5jb25maWcgfHwge31cblxuICAgICAgICBpZiAoY2ZnLnJpcHBsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGN0eCA9IHtcbiAgICAgICAgICBjZmcsXG4gICAgICAgICAgZW5hYmxlZDogYmluZGluZy52YWx1ZSAhPT0gZmFsc2UsXG4gICAgICAgICAgbW9kaWZpZXJzOiB7fSxcbiAgICAgICAgICBhYm9ydDogW10sXG5cbiAgICAgICAgICBzdGFydCAoZXZ0KSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGN0eC5lbmFibGVkID09PSB0cnVlXG4gICAgICAgICAgICAgICYmIGV2dC5xU2tpcFJpcHBsZSAhPT0gdHJ1ZVxuICAgICAgICAgICAgICAmJiBldnQudHlwZSA9PT0gKGN0eC5tb2RpZmllcnMuZWFybHkgPT09IHRydWUgPyAncG9pbnRlcmRvd24nIDogJ2NsaWNrJylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBzaG93UmlwcGxlKGV2dCwgZWwsIGN0eCwgZXZ0LnFLZXlFdmVudCA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuXG4gICAgICAgICAga2V5c3RhcnQ6IHRocm90dGxlKGV2dCA9PiB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIGN0eC5lbmFibGVkID09PSB0cnVlXG4gICAgICAgICAgICAgICYmIGV2dC5xU2tpcFJpcHBsZSAhPT0gdHJ1ZVxuICAgICAgICAgICAgICAmJiBpc0tleUNvZGUoZXZ0LCBjdHgubW9kaWZpZXJzLmtleUNvZGVzKSA9PT0gdHJ1ZVxuICAgICAgICAgICAgICAmJiBldnQudHlwZSA9PT0gYGtleSR7IGN0eC5tb2RpZmllcnMuZWFybHkgPT09IHRydWUgPyAnZG93bicgOiAndXAnIH1gXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgc2hvd1JpcHBsZShldnQsIGVsLCBjdHgsIHRydWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgMzAwKVxuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlTW9kaWZpZXJzKGN0eCwgYmluZGluZylcblxuICAgICAgICBlbC5fX3FyaXBwbGUgPSBjdHhcblxuICAgICAgICBhZGRFdnQoY3R4LCAnbWFpbicsIFtcbiAgICAgICAgICBbIGVsLCAncG9pbnRlcmRvd24nLCAnc3RhcnQnLCAncGFzc2l2ZScgXSxcbiAgICAgICAgICBbIGVsLCAnY2xpY2snLCAnc3RhcnQnLCAncGFzc2l2ZScgXSxcbiAgICAgICAgICBbIGVsLCAna2V5ZG93bicsICdrZXlzdGFydCcsICdwYXNzaXZlJyBdLFxuICAgICAgICAgIFsgZWwsICdrZXl1cCcsICdrZXlzdGFydCcsICdwYXNzaXZlJyBdXG4gICAgICAgIF0pXG4gICAgICB9LFxuXG4gICAgICB1cGRhdGVkIChlbCwgYmluZGluZykge1xuICAgICAgICBpZiAoYmluZGluZy5vbGRWYWx1ZSAhPT0gYmluZGluZy52YWx1ZSkge1xuICAgICAgICAgIGNvbnN0IGN0eCA9IGVsLl9fcXJpcHBsZVxuICAgICAgICAgIGlmIChjdHggIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgY3R4LmVuYWJsZWQgPSBiaW5kaW5nLnZhbHVlICE9PSBmYWxzZVxuXG4gICAgICAgICAgICBpZiAoY3R4LmVuYWJsZWQgPT09IHRydWUgJiYgT2JqZWN0KGJpbmRpbmcudmFsdWUpID09PSBiaW5kaW5nLnZhbHVlKSB7XG4gICAgICAgICAgICAgIHVwZGF0ZU1vZGlmaWVycyhjdHgsIGJpbmRpbmcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBiZWZvcmVVbm1vdW50IChlbCkge1xuICAgICAgICBjb25zdCBjdHggPSBlbC5fX3FyaXBwbGVcbiAgICAgICAgaWYgKGN0eCAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgY3R4LmFib3J0LmZvckVhY2goZm4gPT4geyBmbigpIH0pXG4gICAgICAgICAgY2xlYW5FdnQoY3R4LCAnbWFpbicpXG4gICAgICAgICAgZGVsZXRlIGVsLl9xcmlwcGxlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4pXG4iLCJpbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGNvbnN0IGFsaWduTWFwID0ge1xuICBsZWZ0OiAnc3RhcnQnLFxuICBjZW50ZXI6ICdjZW50ZXInLFxuICByaWdodDogJ2VuZCcsXG4gIGJldHdlZW46ICdiZXR3ZWVuJyxcbiAgYXJvdW5kOiAnYXJvdW5kJyxcbiAgZXZlbmx5OiAnZXZlbmx5JyxcbiAgc3RyZXRjaDogJ3N0cmV0Y2gnXG59XG5cbmV4cG9ydCBjb25zdCBhbGlnblZhbHVlcyA9IE9iamVjdC5rZXlzKGFsaWduTWFwKVxuXG5leHBvcnQgY29uc3QgdXNlQWxpZ25Qcm9wcyA9IHtcbiAgYWxpZ246IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgdmFsaWRhdG9yOiB2ID0+IGFsaWduVmFsdWVzLmluY2x1ZGVzKHYpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHByb3BzKSB7XG4gIC8vIHJldHVybiBhbGlnbkNsYXNzXG4gIHJldHVybiBjb21wdXRlZCgoKSA9PiB7XG4gICAgY29uc3QgYWxpZ24gPSBwcm9wcy5hbGlnbiA9PT0gdm9pZCAwXG4gICAgICA/IHByb3BzLnZlcnRpY2FsID09PSB0cnVlID8gJ3N0cmV0Y2gnIDogJ2xlZnQnXG4gICAgICA6IHByb3BzLmFsaWduXG5cbiAgICByZXR1cm4gYCR7IHByb3BzLnZlcnRpY2FsID09PSB0cnVlID8gJ2l0ZW1zJyA6ICdqdXN0aWZ5JyB9LSR7IGFsaWduTWFwWyBhbGlnbiBdIH1gXG4gIH0pXG59XG4iLCJpbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJ3Z1ZSdcblxuaW1wb3J0IHVzZUFsaWduLCB7IHVzZUFsaWduUHJvcHMgfSBmcm9tICcuLi8uLi9jb21wb3NhYmxlcy9wcml2YXRlLnVzZS1hbGlnbi91c2UtYWxpZ24uanMnXG5pbXBvcnQgdXNlU2l6ZSwgeyB1c2VTaXplUHJvcHMgfSBmcm9tICcuLi8uLi9jb21wb3NhYmxlcy9wcml2YXRlLnVzZS1zaXplL3VzZS1zaXplLmpzJ1xuaW1wb3J0IHVzZVJvdXRlckxpbmssIHsgdXNlUm91dGVyTGlua1Byb3BzIH0gZnJvbSAnLi4vLi4vY29tcG9zYWJsZXMvcHJpdmF0ZS51c2Utcm91dGVyLWxpbmsvdXNlLXJvdXRlci1saW5rLmpzJ1xuXG5leHBvcnQgY29uc3QgYnRuUGFkZGluZyA9IHtcbiAgbm9uZTogMCxcbiAgeHM6IDQsXG4gIHNtOiA4LFxuICBtZDogMTYsXG4gIGxnOiAyNCxcbiAgeGw6IDMyXG59XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0U2l6ZXMgPSB7XG4gIHhzOiA4LFxuICBzbTogMTAsXG4gIG1kOiAxNCxcbiAgbGc6IDIwLFxuICB4bDogMjRcbn1cblxuY29uc3QgZm9ybVR5cGVzID0gWyAnYnV0dG9uJywgJ3N1Ym1pdCcsICdyZXNldCcgXVxuY29uc3QgbWVkaWFUeXBlUkUgPSAvW15cXHNdXFwvW15cXHNdL1xuXG5leHBvcnQgY29uc3QgYnRuRGVzaWduT3B0aW9ucyA9IFsgJ2ZsYXQnLCAnb3V0bGluZScsICdwdXNoJywgJ3VuZWxldmF0ZWQnIF1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJ0bkRlc2lnbiAocHJvcHMsIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAocHJvcHMuZmxhdCA9PT0gdHJ1ZSkgcmV0dXJuICdmbGF0J1xuICBpZiAocHJvcHMub3V0bGluZSA9PT0gdHJ1ZSkgcmV0dXJuICdvdXRsaW5lJ1xuICBpZiAocHJvcHMucHVzaCA9PT0gdHJ1ZSkgcmV0dXJuICdwdXNoJ1xuICBpZiAocHJvcHMudW5lbGV2YXRlZCA9PT0gdHJ1ZSkgcmV0dXJuICd1bmVsZXZhdGVkJ1xuICByZXR1cm4gZGVmYXVsdFZhbHVlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCdG5EZXNpZ25BdHRyIChwcm9wcykge1xuICBjb25zdCBkZXNpZ24gPSBnZXRCdG5EZXNpZ24ocHJvcHMpXG4gIHJldHVybiBkZXNpZ24gIT09IHZvaWQgMFxuICAgID8geyBbIGRlc2lnbiBdOiB0cnVlIH1cbiAgICA6IHt9XG59XG5cbmV4cG9ydCBjb25zdCB1c2VCdG5Qcm9wcyA9IHtcbiAgLi4udXNlU2l6ZVByb3BzLFxuICAuLi51c2VSb3V0ZXJMaW5rUHJvcHMsXG5cbiAgdHlwZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAnYnV0dG9uJ1xuICB9LFxuXG4gIGxhYmVsOiBbIE51bWJlciwgU3RyaW5nIF0sXG4gIGljb246IFN0cmluZyxcbiAgaWNvblJpZ2h0OiBTdHJpbmcsXG5cbiAgLi4uYnRuRGVzaWduT3B0aW9ucy5yZWR1Y2UoXG4gICAgKGFjYywgdmFsKSA9PiAoYWNjWyB2YWwgXSA9IEJvb2xlYW4pICYmIGFjYyxcbiAgICB7fVxuICApLFxuXG4gIHNxdWFyZTogQm9vbGVhbixcbiAgcm91bmQ6IEJvb2xlYW4sXG4gIHJvdW5kZWQ6IEJvb2xlYW4sXG4gIGdsb3NzeTogQm9vbGVhbixcblxuICBzaXplOiBTdHJpbmcsXG4gIGZhYjogQm9vbGVhbixcbiAgZmFiTWluaTogQm9vbGVhbixcbiAgcGFkZGluZzogU3RyaW5nLFxuXG4gIGNvbG9yOiBTdHJpbmcsXG4gIHRleHRDb2xvcjogU3RyaW5nLFxuICBub0NhcHM6IEJvb2xlYW4sXG4gIG5vV3JhcDogQm9vbGVhbixcbiAgZGVuc2U6IEJvb2xlYW4sXG5cbiAgdGFiaW5kZXg6IFsgTnVtYmVyLCBTdHJpbmcgXSxcblxuICByaXBwbGU6IHtcbiAgICB0eXBlOiBbIEJvb2xlYW4sIE9iamVjdCBdLFxuICAgIGRlZmF1bHQ6IHRydWVcbiAgfSxcblxuICBhbGlnbjoge1xuICAgIC4uLnVzZUFsaWduUHJvcHMuYWxpZ24sXG4gICAgZGVmYXVsdDogJ2NlbnRlcidcbiAgfSxcbiAgc3RhY2s6IEJvb2xlYW4sXG4gIHN0cmV0Y2g6IEJvb2xlYW4sXG4gIGxvYWRpbmc6IHtcbiAgICB0eXBlOiBCb29sZWFuLFxuICAgIGRlZmF1bHQ6IG51bGxcbiAgfSxcbiAgZGlzYWJsZTogQm9vbGVhblxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocHJvcHMpIHtcbiAgY29uc3Qgc2l6ZVN0eWxlID0gdXNlU2l6ZShwcm9wcywgZGVmYXVsdFNpemVzKVxuICBjb25zdCBhbGlnbkNsYXNzID0gdXNlQWxpZ24ocHJvcHMpXG4gIGNvbnN0IHsgaGFzUm91dGVyTGluaywgaGFzTGluaywgbGlua1RhZywgbGlua0F0dHJzLCBuYXZpZ2F0ZU9uQ2xpY2sgfSA9IHVzZVJvdXRlckxpbmsoe1xuICAgIGZhbGxiYWNrVGFnOiAnYnV0dG9uJ1xuICB9KVxuXG4gIGNvbnN0IHN0eWxlID0gY29tcHV0ZWQoKCkgPT4ge1xuICAgIGNvbnN0IG9iaiA9IHByb3BzLmZhYiA9PT0gZmFsc2UgJiYgcHJvcHMuZmFiTWluaSA9PT0gZmFsc2VcbiAgICAgID8gc2l6ZVN0eWxlLnZhbHVlXG4gICAgICA6IHt9XG5cbiAgICByZXR1cm4gcHJvcHMucGFkZGluZyAhPT0gdm9pZCAwXG4gICAgICA/IE9iamVjdC5hc3NpZ24oe30sIG9iaiwge1xuICAgICAgICBwYWRkaW5nOiBwcm9wcy5wYWRkaW5nXG4gICAgICAgICAgLnNwbGl0KC9cXHMrLylcbiAgICAgICAgICAubWFwKHYgPT4gKHYgaW4gYnRuUGFkZGluZyA/IGJ0blBhZGRpbmdbIHYgXSArICdweCcgOiB2KSlcbiAgICAgICAgICAuam9pbignICcpLFxuICAgICAgICBtaW5XaWR0aDogJzAnLFxuICAgICAgICBtaW5IZWlnaHQ6ICcwJ1xuICAgICAgfSlcbiAgICAgIDogb2JqXG4gIH0pXG5cbiAgY29uc3QgaXNSb3VuZGVkID0gY29tcHV0ZWQoKCkgPT5cbiAgICBwcm9wcy5yb3VuZGVkID09PSB0cnVlIHx8IHByb3BzLmZhYiA9PT0gdHJ1ZSB8fCBwcm9wcy5mYWJNaW5pID09PSB0cnVlXG4gIClcblxuICBjb25zdCBpc0FjdGlvbmFibGUgPSBjb21wdXRlZCgoKSA9PlxuICAgIHByb3BzLmRpc2FibGUgIT09IHRydWUgJiYgcHJvcHMubG9hZGluZyAhPT0gdHJ1ZVxuICApXG5cbiAgY29uc3QgdGFiSW5kZXggPSBjb21wdXRlZCgoKSA9PiAoXG4gICAgaXNBY3Rpb25hYmxlLnZhbHVlID09PSB0cnVlID8gcHJvcHMudGFiaW5kZXggfHwgMCA6IC0xXG4gICkpXG5cbiAgY29uc3QgZGVzaWduID0gY29tcHV0ZWQoKCkgPT4gZ2V0QnRuRGVzaWduKHByb3BzLCAnc3RhbmRhcmQnKSlcblxuICBjb25zdCBhdHRyaWJ1dGVzID0gY29tcHV0ZWQoKCkgPT4ge1xuICAgIGNvbnN0IGFjYyA9IHsgdGFiaW5kZXg6IHRhYkluZGV4LnZhbHVlIH1cblxuICAgIGlmIChoYXNMaW5rLnZhbHVlID09PSB0cnVlKSB7XG4gICAgICBPYmplY3QuYXNzaWduKGFjYywgbGlua0F0dHJzLnZhbHVlKVxuICAgIH1cbiAgICBlbHNlIGlmIChmb3JtVHlwZXMuaW5jbHVkZXMocHJvcHMudHlwZSkgPT09IHRydWUpIHtcbiAgICAgIGFjYy50eXBlID0gcHJvcHMudHlwZVxuICAgIH1cblxuICAgIGlmIChsaW5rVGFnLnZhbHVlID09PSAnYScpIHtcbiAgICAgIGlmIChwcm9wcy5kaXNhYmxlID09PSB0cnVlKSB7XG4gICAgICAgIGFjY1sgJ2FyaWEtZGlzYWJsZWQnIF0gPSAndHJ1ZSdcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGFjYy5ocmVmID09PSB2b2lkIDApIHtcbiAgICAgICAgYWNjLnJvbGUgPSAnYnV0dG9uJ1xuICAgICAgfVxuXG4gICAgICBpZiAoaGFzUm91dGVyTGluay52YWx1ZSAhPT0gdHJ1ZSAmJiBtZWRpYVR5cGVSRS50ZXN0KHByb3BzLnR5cGUpID09PSB0cnVlKSB7XG4gICAgICAgIGFjYy50eXBlID0gcHJvcHMudHlwZVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChwcm9wcy5kaXNhYmxlID09PSB0cnVlKSB7XG4gICAgICBhY2MuZGlzYWJsZWQgPSAnJ1xuICAgICAgYWNjWyAnYXJpYS1kaXNhYmxlZCcgXSA9ICd0cnVlJ1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5sb2FkaW5nID09PSB0cnVlICYmIHByb3BzLnBlcmNlbnRhZ2UgIT09IHZvaWQgMCkge1xuICAgICAgT2JqZWN0LmFzc2lnbihhY2MsIHtcbiAgICAgICAgcm9sZTogJ3Byb2dyZXNzYmFyJyxcbiAgICAgICAgJ2FyaWEtdmFsdWVtaW4nOiAwLFxuICAgICAgICAnYXJpYS12YWx1ZW1heCc6IDEwMCxcbiAgICAgICAgJ2FyaWEtdmFsdWVub3cnOiBwcm9wcy5wZXJjZW50YWdlXG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiBhY2NcbiAgfSlcblxuICBjb25zdCBjbGFzc2VzID0gY29tcHV0ZWQoKCkgPT4ge1xuICAgIGxldCBjb2xvcnNcblxuICAgIGlmIChwcm9wcy5jb2xvciAhPT0gdm9pZCAwKSB7XG4gICAgICBpZiAocHJvcHMuZmxhdCA9PT0gdHJ1ZSB8fCBwcm9wcy5vdXRsaW5lID09PSB0cnVlKSB7XG4gICAgICAgIGNvbG9ycyA9IGB0ZXh0LSR7IHByb3BzLnRleHRDb2xvciB8fCBwcm9wcy5jb2xvciB9YFxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbG9ycyA9IGBiZy0keyBwcm9wcy5jb2xvciB9IHRleHQtJHsgcHJvcHMudGV4dENvbG9yIHx8ICd3aGl0ZScgfWBcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAocHJvcHMudGV4dENvbG9yKSB7XG4gICAgICBjb2xvcnMgPSBgdGV4dC0keyBwcm9wcy50ZXh0Q29sb3IgfWBcbiAgICB9XG5cbiAgICBjb25zdCBzaGFwZSA9IHByb3BzLnJvdW5kID09PSB0cnVlXG4gICAgICA/ICdyb3VuZCdcbiAgICAgIDogYHJlY3RhbmdsZSR7IGlzUm91bmRlZC52YWx1ZSA9PT0gdHJ1ZSA/ICcgcS1idG4tLXJvdW5kZWQnIDogKHByb3BzLnNxdWFyZSA9PT0gdHJ1ZSA/ICcgcS1idG4tLXNxdWFyZScgOiAnJykgfWBcblxuICAgIHJldHVybiBgcS1idG4tLSR7IGRlc2lnbi52YWx1ZSB9IHEtYnRuLS0keyBzaGFwZSB9YFxuICAgICAgKyAoY29sb3JzICE9PSB2b2lkIDAgPyAnICcgKyBjb2xvcnMgOiAnJylcbiAgICAgICsgKGlzQWN0aW9uYWJsZS52YWx1ZSA9PT0gdHJ1ZSA/ICcgcS1idG4tLWFjdGlvbmFibGUgcS1mb2N1c2FibGUgcS1ob3ZlcmFibGUnIDogKHByb3BzLmRpc2FibGUgPT09IHRydWUgPyAnIGRpc2FibGVkJyA6ICcnKSlcbiAgICAgICsgKHByb3BzLmZhYiA9PT0gdHJ1ZSA/ICcgcS1idG4tLWZhYicgOiAocHJvcHMuZmFiTWluaSA9PT0gdHJ1ZSA/ICcgcS1idG4tLWZhYi1taW5pJyA6ICcnKSlcbiAgICAgICsgKHByb3BzLm5vQ2FwcyA9PT0gdHJ1ZSA/ICcgcS1idG4tLW5vLXVwcGVyY2FzZScgOiAnJylcbiAgICAgICsgKHByb3BzLmRlbnNlID09PSB0cnVlID8gJyBxLWJ0bi0tZGVuc2UnIDogJycpXG4gICAgICArIChwcm9wcy5zdHJldGNoID09PSB0cnVlID8gJyBuby1ib3JkZXItcmFkaXVzIHNlbGYtc3RyZXRjaCcgOiAnJylcbiAgICAgICsgKHByb3BzLmdsb3NzeSA9PT0gdHJ1ZSA/ICcgZ2xvc3N5JyA6ICcnKVxuICAgICAgKyAocHJvcHMuc3F1YXJlID8gJyBxLWJ0bi0tc3F1YXJlJyA6ICcnKVxuICB9KVxuXG4gIGNvbnN0IGlubmVyQ2xhc3NlcyA9IGNvbXB1dGVkKCgpID0+XG4gICAgYWxpZ25DbGFzcy52YWx1ZSArIChwcm9wcy5zdGFjayA9PT0gdHJ1ZSA/ICcgY29sdW1uJyA6ICcgcm93JylcbiAgICArIChwcm9wcy5ub1dyYXAgPT09IHRydWUgPyAnIG5vLXdyYXAgdGV4dC1uby13cmFwJyA6ICcnKVxuICAgICsgKHByb3BzLmxvYWRpbmcgPT09IHRydWUgPyAnIHEtYnRuX19jb250ZW50LS1oaWRkZW4nIDogJycpXG4gIClcblxuICByZXR1cm4ge1xuICAgIGNsYXNzZXMsXG4gICAgc3R5bGUsXG4gICAgaW5uZXJDbGFzc2VzLFxuICAgIGF0dHJpYnV0ZXMsXG4gICAgaGFzTGluayxcbiAgICBsaW5rVGFnLFxuICAgIG5hdmlnYXRlT25DbGljayxcbiAgICBpc0FjdGlvbmFibGVcbiAgfVxufVxuIiwiaW1wb3J0IHsgaCwgcmVmLCBjb21wdXRlZCwgVHJhbnNpdGlvbiwgb25CZWZvcmVVbm1vdW50LCB3aXRoRGlyZWN0aXZlcywgZ2V0Q3VycmVudEluc3RhbmNlIH0gZnJvbSAndnVlJ1xuXG5pbXBvcnQgUUljb24gZnJvbSAnLi4vaWNvbi9RSWNvbi5qcydcbmltcG9ydCBRU3Bpbm5lciBmcm9tICcuLi9zcGlubmVyL1FTcGlubmVyLmpzJ1xuXG5pbXBvcnQgUmlwcGxlIGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvcmlwcGxlL1JpcHBsZS5qcydcblxuaW1wb3J0IHVzZUJ0biwgeyB1c2VCdG5Qcm9wcyB9IGZyb20gJy4vdXNlLWJ0bi5qcydcblxuaW1wb3J0IHsgY3JlYXRlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS5jcmVhdGUvY3JlYXRlLmpzJ1xuaW1wb3J0IHsgaE1lcmdlU2xvdCB9IGZyb20gJy4uLy4uL3V0aWxzL3ByaXZhdGUucmVuZGVyL3JlbmRlci5qcydcbmltcG9ydCB7IHN0b3AsIHByZXZlbnQsIHN0b3BBbmRQcmV2ZW50LCBsaXN0ZW5PcHRzIH0gZnJvbSAnLi4vLi4vdXRpbHMvZXZlbnQvZXZlbnQuanMnXG5pbXBvcnQgeyBpc0tleUNvZGUgfSBmcm9tICcuLi8uLi91dGlscy9wcml2YXRlLmtleWJvYXJkL2tleS1jb21wb3NpdGlvbi5qcydcblxuY29uc3QgeyBwYXNzaXZlQ2FwdHVyZSB9ID0gbGlzdGVuT3B0c1xuXG5sZXRcbiAgdG91Y2hUYXJnZXQgPSBudWxsLFxuICBrZXlib2FyZFRhcmdldCA9IG51bGwsXG4gIG1vdXNlVGFyZ2V0ID0gbnVsbFxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVDb21wb25lbnQoe1xuICBuYW1lOiAnUUJ0bicsXG5cbiAgcHJvcHM6IHtcbiAgICAuLi51c2VCdG5Qcm9wcyxcblxuICAgIHBlcmNlbnRhZ2U6IE51bWJlcixcbiAgICBkYXJrUGVyY2VudGFnZTogQm9vbGVhbixcblxuICAgIG9uVG91Y2hzdGFydDogWyBGdW5jdGlvbiwgQXJyYXkgXVxuICB9LFxuXG4gIGVtaXRzOiBbICdjbGljaycsICdrZXlkb3duJywgJ21vdXNlZG93bicsICdrZXl1cCcgXSxcblxuICBzZXR1cCAocHJvcHMsIHsgc2xvdHMsIGVtaXQgfSkge1xuICAgIGNvbnN0IHsgcHJveHkgfSA9IGdldEN1cnJlbnRJbnN0YW5jZSgpXG5cbiAgICBjb25zdCB7XG4gICAgICBjbGFzc2VzLCBzdHlsZSwgaW5uZXJDbGFzc2VzLFxuICAgICAgYXR0cmlidXRlcyxcbiAgICAgIGhhc0xpbmssIGxpbmtUYWcsIG5hdmlnYXRlT25DbGljayxcbiAgICAgIGlzQWN0aW9uYWJsZVxuICAgIH0gPSB1c2VCdG4ocHJvcHMpXG5cbiAgICBjb25zdCByb290UmVmID0gcmVmKG51bGwpXG4gICAgY29uc3QgYmx1clRhcmdldFJlZiA9IHJlZihudWxsKVxuXG4gICAgbGV0IGxvY2FsVG91Y2hUYXJnZXRFbCA9IG51bGwsIGF2b2lkTW91c2VSaXBwbGUsIG1vdXNlVGltZXIgPSBudWxsXG5cbiAgICBjb25zdCBoYXNMYWJlbCA9IGNvbXB1dGVkKCgpID0+XG4gICAgICBwcm9wcy5sYWJlbCAhPT0gdm9pZCAwICYmIHByb3BzLmxhYmVsICE9PSBudWxsICYmIHByb3BzLmxhYmVsICE9PSAnJ1xuICAgIClcblxuICAgIGNvbnN0IHJpcHBsZSA9IGNvbXB1dGVkKCgpID0+IChcbiAgICAgIHByb3BzLmRpc2FibGUgPT09IHRydWUgfHwgcHJvcHMucmlwcGxlID09PSBmYWxzZVxuICAgICAgICA/IGZhbHNlXG4gICAgICAgIDoge1xuICAgICAgICAgICAga2V5Q29kZXM6IGhhc0xpbmsudmFsdWUgPT09IHRydWUgPyBbIDEzLCAzMiBdIDogWyAxMyBdLFxuICAgICAgICAgICAgLi4uKHByb3BzLnJpcHBsZSA9PT0gdHJ1ZSA/IHt9IDogcHJvcHMucmlwcGxlKVxuICAgICAgICAgIH1cbiAgICApKVxuXG4gICAgY29uc3QgcmlwcGxlUHJvcHMgPSBjb21wdXRlZCgoKSA9PiAoeyBjZW50ZXI6IHByb3BzLnJvdW5kIH0pKVxuXG4gICAgY29uc3QgcGVyY2VudGFnZVN0eWxlID0gY29tcHV0ZWQoKCkgPT4ge1xuICAgICAgY29uc3QgdmFsID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMTAwLCBwcm9wcy5wZXJjZW50YWdlKSlcbiAgICAgIHJldHVybiB2YWwgPiAwXG4gICAgICAgID8geyB0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDAuNnMnLCB0cmFuc2Zvcm06IGB0cmFuc2xhdGVYKCR7IHZhbCAtIDEwMCB9JSlgIH1cbiAgICAgICAgOiB7fVxuICAgIH0pXG5cbiAgICBjb25zdCBvbkV2ZW50cyA9IGNvbXB1dGVkKCgpID0+IHtcbiAgICAgIGlmIChwcm9wcy5sb2FkaW5nID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgb25Nb3VzZWRvd246IG9uTG9hZGluZ0V2dCxcbiAgICAgICAgICBvblRvdWNoc3RhcnQ6IG9uTG9hZGluZ0V2dCxcbiAgICAgICAgICBvbkNsaWNrOiBvbkxvYWRpbmdFdnQsXG4gICAgICAgICAgb25LZXlkb3duOiBvbkxvYWRpbmdFdnQsXG4gICAgICAgICAgb25LZXl1cDogb25Mb2FkaW5nRXZ0XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGlzQWN0aW9uYWJsZS52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBhY2MgPSB7XG4gICAgICAgICAgb25DbGljayxcbiAgICAgICAgICBvbktleWRvd24sXG4gICAgICAgICAgb25Nb3VzZWRvd25cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm94eS4kcS5wbGF0Zm9ybS5oYXMudG91Y2ggPT09IHRydWUpIHtcbiAgICAgICAgICBjb25zdCBzdWZmaXggPSBwcm9wcy5vblRvdWNoc3RhcnQgIT09IHZvaWQgMFxuICAgICAgICAgICAgPyAnJ1xuICAgICAgICAgICAgOiAnUGFzc2l2ZSdcblxuICAgICAgICAgIGFjY1sgYG9uVG91Y2hzdGFydCR7IHN1ZmZpeCB9YCBdID0gb25Ub3VjaHN0YXJ0XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWNjXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8vIG5lZWRlZDsgZXNwZWNpYWxseSBmb3IgZGlzYWJsZWQgPGE+IHRhZ3NcbiAgICAgICAgb25DbGljazogc3RvcEFuZFByZXZlbnRcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3Qgbm9kZVByb3BzID0gY29tcHV0ZWQoKCkgPT4gKHtcbiAgICAgIHJlZjogcm9vdFJlZixcbiAgICAgIGNsYXNzOiAncS1idG4gcS1idG4taXRlbSBub24tc2VsZWN0YWJsZSBuby1vdXRsaW5lICcgKyBjbGFzc2VzLnZhbHVlLFxuICAgICAgc3R5bGU6IHN0eWxlLnZhbHVlLFxuICAgICAgLi4uYXR0cmlidXRlcy52YWx1ZSxcbiAgICAgIC4uLm9uRXZlbnRzLnZhbHVlXG4gICAgfSkpXG5cbiAgICBmdW5jdGlvbiBvbkNsaWNrIChlKSB7XG4gICAgICAvLyBpcyBpdCBhbHJlYWR5IGRlc3Ryb3llZD9cbiAgICAgIGlmIChyb290UmVmLnZhbHVlID09PSBudWxsKSByZXR1cm5cblxuICAgICAgaWYgKGUgIT09IHZvaWQgMCkge1xuICAgICAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkID09PSB0cnVlKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRcbiAgICAgICAgLy8gZm9jdXMgYnV0dG9uIGlmIGl0IGNhbWUgZnJvbSBFTlRFUiBvbiBmb3JtXG4gICAgICAgIC8vIHByZXZlbnQgdGhlIG5ldyBzdWJtaXQgKGFscmVhZHkgZG9uZSlcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHByb3BzLnR5cGUgPT09ICdzdWJtaXQnXG4gICAgICAgICAgJiYgZWwgIT09IGRvY3VtZW50LmJvZHlcbiAgICAgICAgICAmJiByb290UmVmLnZhbHVlLmNvbnRhaW5zKGVsKSA9PT0gZmFsc2VcbiAgICAgICAgICAvLyByZXF1aXJlZCBmb3IgaU9TIGFuZCBkZXNrdG9wIFNhZmFyaVxuICAgICAgICAgICYmIGVsLmNvbnRhaW5zKHJvb3RSZWYudmFsdWUpID09PSBmYWxzZVxuICAgICAgICApIHtcbiAgICAgICAgICByb290UmVmLnZhbHVlLmZvY3VzKClcblxuICAgICAgICAgIGNvbnN0IG9uQ2xpY2tDbGVhbnVwID0gKCkgPT4ge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHN0b3BBbmRQcmV2ZW50LCB0cnVlKVxuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbkNsaWNrQ2xlYW51cCwgcGFzc2l2ZUNhcHR1cmUpXG4gICAgICAgICAgICByb290UmVmLnZhbHVlICE9PSBudWxsICYmIHJvb3RSZWYudmFsdWUucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIG9uQ2xpY2tDbGVhbnVwLCBwYXNzaXZlQ2FwdHVyZSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgc3RvcEFuZFByZXZlbnQsIHRydWUpXG4gICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvbkNsaWNrQ2xlYW51cCwgcGFzc2l2ZUNhcHR1cmUpXG4gICAgICAgICAgcm9vdFJlZi52YWx1ZS5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgb25DbGlja0NsZWFudXAsIHBhc3NpdmVDYXB0dXJlKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG5hdmlnYXRlT25DbGljayhlKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uS2V5ZG93biAoZSkge1xuICAgICAgLy8gaXMgaXQgYWxyZWFkeSBkZXN0cm95ZWQ/XG4gICAgICBpZiAocm9vdFJlZi52YWx1ZSA9PT0gbnVsbCkgcmV0dXJuXG5cbiAgICAgIGVtaXQoJ2tleWRvd24nLCBlKVxuXG4gICAgICBpZiAoaXNLZXlDb2RlKGUsIFsgMTMsIDMyIF0pID09PSB0cnVlICYmIGtleWJvYXJkVGFyZ2V0ICE9PSByb290UmVmLnZhbHVlKSB7XG4gICAgICAgIGtleWJvYXJkVGFyZ2V0ICE9PSBudWxsICYmIGNsZWFudXAoKVxuXG4gICAgICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQgIT09IHRydWUpIHtcbiAgICAgICAgICAvLyBmb2N1cyBleHRlcm5hbCBidXR0b24gaWYgdGhlIGZvY3VzIGhlbHBlciB3YXMgZm9jdXNlZCBiZWZvcmVcbiAgICAgICAgICByb290UmVmLnZhbHVlLmZvY3VzKClcblxuICAgICAgICAgIGtleWJvYXJkVGFyZ2V0ID0gcm9vdFJlZi52YWx1ZVxuICAgICAgICAgIHJvb3RSZWYudmFsdWUuY2xhc3NMaXN0LmFkZCgncS1idG4tLWFjdGl2ZScpXG4gICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBvblByZXNzRW5kLCB0cnVlKVxuICAgICAgICAgIHJvb3RSZWYudmFsdWUuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIG9uUHJlc3NFbmQsIHBhc3NpdmVDYXB0dXJlKVxuICAgICAgICB9XG5cbiAgICAgICAgc3RvcEFuZFByZXZlbnQoZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvblRvdWNoc3RhcnQgKGUpIHtcbiAgICAgIC8vIGlzIGl0IGFscmVhZHkgZGVzdHJveWVkP1xuICAgICAgaWYgKHJvb3RSZWYudmFsdWUgPT09IG51bGwpIHJldHVyblxuXG4gICAgICBlbWl0KCd0b3VjaHN0YXJ0JywgZSlcblxuICAgICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZCA9PT0gdHJ1ZSkgcmV0dXJuXG5cbiAgICAgIGlmICh0b3VjaFRhcmdldCAhPT0gcm9vdFJlZi52YWx1ZSkge1xuICAgICAgICB0b3VjaFRhcmdldCAhPT0gbnVsbCAmJiBjbGVhbnVwKClcbiAgICAgICAgdG91Y2hUYXJnZXQgPSByb290UmVmLnZhbHVlXG5cbiAgICAgICAgbG9jYWxUb3VjaFRhcmdldEVsID0gZS50YXJnZXRcbiAgICAgICAgbG9jYWxUb3VjaFRhcmdldEVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgb25QcmVzc0VuZCwgcGFzc2l2ZUNhcHR1cmUpXG4gICAgICAgIGxvY2FsVG91Y2hUYXJnZXRFbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG9uUHJlc3NFbmQsIHBhc3NpdmVDYXB0dXJlKVxuICAgICAgfVxuXG4gICAgICAvLyBhdm9pZCBkdXBsaWNhdGVkIG1vdXNlZG93biBldmVudFxuICAgICAgLy8gdHJpZ2dlcmluZyBhbm90aGVyIGVhcmx5IHJpcHBsZVxuICAgICAgYXZvaWRNb3VzZVJpcHBsZSA9IHRydWVcbiAgICAgIG1vdXNlVGltZXIgIT09IG51bGwgJiYgY2xlYXJUaW1lb3V0KG1vdXNlVGltZXIpXG4gICAgICBtb3VzZVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIG1vdXNlVGltZXIgPSBudWxsXG4gICAgICAgIGF2b2lkTW91c2VSaXBwbGUgPSBmYWxzZVxuICAgICAgfSwgMjAwKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uTW91c2Vkb3duIChlKSB7XG4gICAgICAvLyBpcyBpdCBhbHJlYWR5IGRlc3Ryb3llZD9cbiAgICAgIGlmIChyb290UmVmLnZhbHVlID09PSBudWxsKSByZXR1cm5cblxuICAgICAgZS5xU2tpcFJpcHBsZSA9IGF2b2lkTW91c2VSaXBwbGUgPT09IHRydWVcbiAgICAgIGVtaXQoJ21vdXNlZG93bicsIGUpXG5cbiAgICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQgIT09IHRydWUgJiYgbW91c2VUYXJnZXQgIT09IHJvb3RSZWYudmFsdWUpIHtcbiAgICAgICAgbW91c2VUYXJnZXQgIT09IG51bGwgJiYgY2xlYW51cCgpXG4gICAgICAgIG1vdXNlVGFyZ2V0ID0gcm9vdFJlZi52YWx1ZVxuICAgICAgICByb290UmVmLnZhbHVlLmNsYXNzTGlzdC5hZGQoJ3EtYnRuLS1hY3RpdmUnKVxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgb25QcmVzc0VuZCwgcGFzc2l2ZUNhcHR1cmUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25QcmVzc0VuZCAoZSkge1xuICAgICAgLy8gaXMgaXQgYWxyZWFkeSBkZXN0cm95ZWQ/XG4gICAgICBpZiAocm9vdFJlZi52YWx1ZSA9PT0gbnVsbCkgcmV0dXJuXG5cbiAgICAgIC8vIG5lZWRlZCBmb3IgSUUgKGJlY2F1c2UgaXQgZW1pdHMgYmx1ciB3aGVuIGZvY3VzaW5nIGJ1dHRvbiBmcm9tIGZvY3VzIGhlbHBlcilcbiAgICAgIGlmIChlICE9PSB2b2lkIDAgJiYgZS50eXBlID09PSAnYmx1cicgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gcm9vdFJlZi52YWx1ZSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKGUgIT09IHZvaWQgMCAmJiBlLnR5cGUgPT09ICdrZXl1cCcpIHtcbiAgICAgICAgaWYgKGtleWJvYXJkVGFyZ2V0ID09PSByb290UmVmLnZhbHVlICYmIGlzS2V5Q29kZShlLCBbIDEzLCAzMiBdKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIC8vIGZvciBjbGljayB0cmlnZ2VyXG4gICAgICAgICAgY29uc3QgZXZ0ID0gbmV3IE1vdXNlRXZlbnQoJ2NsaWNrJywgZSlcbiAgICAgICAgICBldnQucUtleUV2ZW50ID0gdHJ1ZVxuICAgICAgICAgIGUuZGVmYXVsdFByZXZlbnRlZCA9PT0gdHJ1ZSAmJiBwcmV2ZW50KGV2dClcbiAgICAgICAgICBlLmNhbmNlbEJ1YmJsZSA9PT0gdHJ1ZSAmJiBzdG9wKGV2dClcbiAgICAgICAgICByb290UmVmLnZhbHVlLmRpc3BhdGNoRXZlbnQoZXZ0KVxuXG4gICAgICAgICAgc3RvcEFuZFByZXZlbnQoZSlcblxuICAgICAgICAgIC8vIGZvciByaXBwbGVcbiAgICAgICAgICBlLnFLZXlFdmVudCA9IHRydWVcbiAgICAgICAgfVxuXG4gICAgICAgIGVtaXQoJ2tleXVwJywgZSlcbiAgICAgIH1cblxuICAgICAgY2xlYW51cCgpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW51cCAoZGVzdHJveWluZykge1xuICAgICAgY29uc3QgYmx1clRhcmdldCA9IGJsdXJUYXJnZXRSZWYudmFsdWVcblxuICAgICAgaWYgKFxuICAgICAgICBkZXN0cm95aW5nICE9PSB0cnVlXG4gICAgICAgICYmICh0b3VjaFRhcmdldCA9PT0gcm9vdFJlZi52YWx1ZSB8fCBtb3VzZVRhcmdldCA9PT0gcm9vdFJlZi52YWx1ZSlcbiAgICAgICAgJiYgYmx1clRhcmdldCAhPT0gbnVsbFxuICAgICAgICAmJiBibHVyVGFyZ2V0ICE9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50XG4gICAgICApIHtcbiAgICAgICAgYmx1clRhcmdldC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgLTEpXG4gICAgICAgIGJsdXJUYXJnZXQuZm9jdXMoKVxuICAgICAgfVxuXG4gICAgICBpZiAodG91Y2hUYXJnZXQgPT09IHJvb3RSZWYudmFsdWUpIHtcbiAgICAgICAgaWYgKGxvY2FsVG91Y2hUYXJnZXRFbCAhPT0gbnVsbCkge1xuICAgICAgICAgIGxvY2FsVG91Y2hUYXJnZXRFbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIG9uUHJlc3NFbmQsIHBhc3NpdmVDYXB0dXJlKVxuICAgICAgICAgIGxvY2FsVG91Y2hUYXJnZXRFbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG9uUHJlc3NFbmQsIHBhc3NpdmVDYXB0dXJlKVxuICAgICAgICB9XG4gICAgICAgIHRvdWNoVGFyZ2V0ID0gbG9jYWxUb3VjaFRhcmdldEVsID0gbnVsbFxuICAgICAgfVxuXG4gICAgICBpZiAobW91c2VUYXJnZXQgPT09IHJvb3RSZWYudmFsdWUpIHtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG9uUHJlc3NFbmQsIHBhc3NpdmVDYXB0dXJlKVxuICAgICAgICBtb3VzZVRhcmdldCA9IG51bGxcbiAgICAgIH1cblxuICAgICAgaWYgKGtleWJvYXJkVGFyZ2V0ID09PSByb290UmVmLnZhbHVlKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgb25QcmVzc0VuZCwgdHJ1ZSlcbiAgICAgICAgcm9vdFJlZi52YWx1ZSAhPT0gbnVsbCAmJiByb290UmVmLnZhbHVlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCBvblByZXNzRW5kLCBwYXNzaXZlQ2FwdHVyZSlcbiAgICAgICAga2V5Ym9hcmRUYXJnZXQgPSBudWxsXG4gICAgICB9XG5cbiAgICAgIHJvb3RSZWYudmFsdWUgIT09IG51bGwgJiYgcm9vdFJlZi52YWx1ZS5jbGFzc0xpc3QucmVtb3ZlKCdxLWJ0bi0tYWN0aXZlJylcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbkxvYWRpbmdFdnQgKGV2dCkge1xuICAgICAgc3RvcEFuZFByZXZlbnQoZXZ0KVxuICAgICAgZXZ0LnFTa2lwUmlwcGxlID0gdHJ1ZVxuICAgIH1cblxuICAgIG9uQmVmb3JlVW5tb3VudCgoKSA9PiB7XG4gICAgICBjbGVhbnVwKHRydWUpXG4gICAgfSlcblxuICAgIC8vIGV4cG9zZSBwdWJsaWMgbWV0aG9kc1xuICAgIE9iamVjdC5hc3NpZ24ocHJveHksIHtcbiAgICAgIGNsaWNrOiBlID0+IHtcbiAgICAgICAgaWYgKGlzQWN0aW9uYWJsZS52YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIG9uQ2xpY2soZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgbGV0IGlubmVyID0gW11cblxuICAgICAgcHJvcHMuaWNvbiAhPT0gdm9pZCAwICYmIGlubmVyLnB1c2goXG4gICAgICAgIGgoUUljb24sIHtcbiAgICAgICAgICBuYW1lOiBwcm9wcy5pY29uLFxuICAgICAgICAgIGxlZnQ6IHByb3BzLnN0YWNrICE9PSB0cnVlICYmIGhhc0xhYmVsLnZhbHVlID09PSB0cnVlLFxuICAgICAgICAgIHJvbGU6ICdpbWcnLFxuICAgICAgICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJ1xuICAgICAgICB9KVxuICAgICAgKVxuXG4gICAgICBoYXNMYWJlbC52YWx1ZSA9PT0gdHJ1ZSAmJiBpbm5lci5wdXNoKFxuICAgICAgICBoKCdzcGFuJywgeyBjbGFzczogJ2Jsb2NrJyB9LCBbIHByb3BzLmxhYmVsIF0pXG4gICAgICApXG5cbiAgICAgIGlubmVyID0gaE1lcmdlU2xvdChzbG90cy5kZWZhdWx0LCBpbm5lcilcblxuICAgICAgaWYgKHByb3BzLmljb25SaWdodCAhPT0gdm9pZCAwICYmIHByb3BzLnJvdW5kID09PSBmYWxzZSkge1xuICAgICAgICBpbm5lci5wdXNoKFxuICAgICAgICAgIGgoUUljb24sIHtcbiAgICAgICAgICAgIG5hbWU6IHByb3BzLmljb25SaWdodCxcbiAgICAgICAgICAgIHJpZ2h0OiBwcm9wcy5zdGFjayAhPT0gdHJ1ZSAmJiBoYXNMYWJlbC52YWx1ZSA9PT0gdHJ1ZSxcbiAgICAgICAgICAgIHJvbGU6ICdpbWcnLFxuICAgICAgICAgICAgJ2FyaWEtaGlkZGVuJzogJ3RydWUnXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGlsZCA9IFtcbiAgICAgICAgaCgnc3BhbicsIHtcbiAgICAgICAgICBjbGFzczogJ3EtZm9jdXMtaGVscGVyJyxcbiAgICAgICAgICByZWY6IGJsdXJUYXJnZXRSZWZcbiAgICAgICAgfSlcbiAgICAgIF1cblxuICAgICAgaWYgKHByb3BzLmxvYWRpbmcgPT09IHRydWUgJiYgcHJvcHMucGVyY2VudGFnZSAhPT0gdm9pZCAwKSB7XG4gICAgICAgIGNoaWxkLnB1c2goXG4gICAgICAgICAgaCgnc3BhbicsIHtcbiAgICAgICAgICAgIGNsYXNzOiAncS1idG5fX3Byb2dyZXNzIGFic29sdXRlLWZ1bGwgb3ZlcmZsb3ctaGlkZGVuJyArIChwcm9wcy5kYXJrUGVyY2VudGFnZSA9PT0gdHJ1ZSA/ICcgcS1idG5fX3Byb2dyZXNzLS1kYXJrJyA6ICcnKVxuICAgICAgICAgIH0sIFtcbiAgICAgICAgICAgIGgoJ3NwYW4nLCB7XG4gICAgICAgICAgICAgIGNsYXNzOiAncS1idG5fX3Byb2dyZXNzLWluZGljYXRvciBmaXQgYmxvY2snLFxuICAgICAgICAgICAgICBzdHlsZTogcGVyY2VudGFnZVN0eWxlLnZhbHVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIF0pXG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgY2hpbGQucHVzaChcbiAgICAgICAgaCgnc3BhbicsIHtcbiAgICAgICAgICBjbGFzczogJ3EtYnRuX19jb250ZW50IHRleHQtY2VudGVyIGNvbCBpdGVtcy1jZW50ZXIgcS1hbmNob3ItLXNraXAgJyArIGlubmVyQ2xhc3Nlcy52YWx1ZVxuICAgICAgICB9LCBpbm5lcilcbiAgICAgIClcblxuICAgICAgcHJvcHMubG9hZGluZyAhPT0gbnVsbCAmJiBjaGlsZC5wdXNoKFxuICAgICAgICBoKFRyYW5zaXRpb24sIHtcbiAgICAgICAgICBuYW1lOiAncS10cmFuc2l0aW9uLS1mYWRlJ1xuICAgICAgICB9LCAoKSA9PiAoXG4gICAgICAgICAgcHJvcHMubG9hZGluZyA9PT0gdHJ1ZVxuICAgICAgICAgICAgPyBbXG4gICAgICAgICAgICAgICAgaCgnc3BhbicsIHtcbiAgICAgICAgICAgICAgICAgIGtleTogJ2xvYWRpbmcnLFxuICAgICAgICAgICAgICAgICAgY2xhc3M6ICdhYnNvbHV0ZS1mdWxsIGZsZXggZmxleC1jZW50ZXInXG4gICAgICAgICAgICAgICAgfSwgc2xvdHMubG9hZGluZyAhPT0gdm9pZCAwID8gc2xvdHMubG9hZGluZygpIDogWyBoKFFTcGlubmVyKSBdKVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICA6IG51bGxcbiAgICAgICAgKSlcbiAgICAgIClcblxuICAgICAgcmV0dXJuIHdpdGhEaXJlY3RpdmVzKFxuICAgICAgICBoKFxuICAgICAgICAgIGxpbmtUYWcudmFsdWUsXG4gICAgICAgICAgbm9kZVByb3BzLnZhbHVlLFxuICAgICAgICAgIGNoaWxkXG4gICAgICAgICksXG4gICAgICAgIFsgW1xuICAgICAgICAgIFJpcHBsZSxcbiAgICAgICAgICByaXBwbGUudmFsdWUsXG4gICAgICAgICAgdm9pZCAwLFxuICAgICAgICAgIHJpcHBsZVByb3BzLnZhbHVlXG4gICAgICAgIF0gXVxuICAgICAgKVxuICAgIH1cbiAgfVxufSlcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdPLE1BQU0sa0JBQWtCO0FBQUEsRUFDN0IsTUFBTTtBQUFBLElBQ0osTUFBTSxDQUFFLFFBQVEsTUFBUTtBQUFBLElBQ3hCLFNBQVM7QUFBQSxFQUNWO0FBQUEsRUFDRCxPQUFPO0FBQ1Q7QUFFZSxTQUFTLFdBQVksT0FBTztBQUN6QyxTQUFPO0FBQUEsSUFDTCxPQUFPLFNBQVMsTUFDZCxNQUFNLFFBQVEsa0JBQ1YsR0FBSSxnQkFBaUIsTUFBTSxZQUMzQixNQUFNLElBQ1g7QUFBQSxJQUVELFNBQVM7QUFBQSxNQUFTLE1BQ2hCLGVBQWUsTUFBTSxRQUFRLFNBQVUsTUFBTSxVQUFXO0FBQUEsSUFDekQ7QUFBQSxFQUNGO0FBQ0g7QUNqQkEsSUFBQSxXQUFlLGdCQUFnQjtBQUFBLEVBQzdCLE1BQU07QUFBQSxFQUVOLE9BQU87QUFBQSxJQUNMLEdBQUc7QUFBQSxJQUVILFdBQVc7QUFBQSxNQUNULE1BQU07QUFBQSxNQUNOLFNBQVM7QUFBQSxJQUNWO0FBQUEsRUFDRjtBQUFBLEVBRUQsTUFBTyxPQUFPO0FBQ1osVUFBTSxFQUFFLE9BQU8sWUFBWSxXQUFXLEtBQUs7QUFFM0MsV0FBTyxNQUFNLEVBQUUsT0FBTztBQUFBLE1BQ3BCLE9BQU8sUUFBUSxRQUFRO0FBQUEsTUFDdkIsT0FBTyxNQUFNO0FBQUEsTUFDYixRQUFRLE1BQU07QUFBQSxNQUNkLFNBQVM7QUFBQSxJQUNmLEdBQU87QUFBQSxNQUNELEVBQUUsVUFBVTtBQUFBLFFBQ1YsT0FBTztBQUFBLFFBQ1AsSUFBSTtBQUFBLFFBQ0osSUFBSTtBQUFBLFFBQ0osR0FBRztBQUFBLFFBQ0gsTUFBTTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsZ0JBQWdCLE1BQU07QUFBQSxRQUN0QixxQkFBcUI7QUFBQSxNQUM3QixDQUFPO0FBQUEsSUFDUCxDQUFLO0FBQUEsRUFDRjtBQUNILENBQUM7QUN2Q2MsU0FBQSxTQUFVLElBQUksUUFBUSxLQUFLO0FBQ3hDLE1BQUksT0FBTyxPQUFPO0FBRWxCLFNBQU8sV0FBeUI7QUFDOUIsUUFBSSxTQUFTLE9BQU87QUFDbEIsYUFBTztBQUNQLGlCQUFXLE1BQU07QUFBRSxlQUFPO0FBQUEsTUFBSyxHQUFJLEtBQUs7QUFDeEMsZUFBUyxHQUFHLE1BQU0sTUFBTSxTQUFTO0FBQUEsSUFDbEM7QUFFRCxXQUFPO0FBQUEsRUFDUjtBQUNIO0FDTEEsU0FBUyxXQUFZLEtBQUssSUFBSSxLQUFLLGFBQWE7QUFDOUMsTUFBSSxVQUFVLFNBQVMsUUFBUSxLQUFLLEdBQUc7QUFFdkMsUUFBTSxRQUFRLElBQUksVUFBVTtBQUM1QixNQUFJLFNBQVMsSUFBSSxVQUFVO0FBQzNCLFdBQVMsV0FBVyxRQUFRLGdCQUFnQjtBQUU1QyxRQUNFLE9BQU8sU0FBUyxjQUFjLE1BQU0sR0FDcEMsWUFBWSxTQUFTLGNBQWMsTUFBTSxHQUN6QyxNQUFNLFNBQVMsR0FBRyxHQUNsQixFQUFFLE1BQU0sS0FBSyxPQUFPLE9BQVEsSUFBRyxHQUFHLHNCQUF1QixHQUN6RCxXQUFXLEtBQUssS0FBSyxRQUFRLFFBQVEsU0FBUyxNQUFNLEdBQ3BELFNBQVMsV0FBVyxHQUNwQixVQUFVLElBQUssUUFBUSxZQUFZLE9BQ25DLElBQUksU0FBUyxVQUFVLEdBQUksSUFBSSxPQUFPLE9BQU8sWUFDN0MsVUFBVSxJQUFLLFNBQVMsWUFBWSxPQUNwQyxJQUFJLFNBQVMsVUFBVSxHQUFJLElBQUksTUFBTSxNQUFNO0FBRTdDLFlBQVUsWUFBWTtBQUN0QixNQUFJLFdBQVc7QUFBQSxJQUNiLFFBQVEsR0FBSTtBQUFBLElBQ1osT0FBTyxHQUFJO0FBQUEsSUFDWCxXQUFXLGVBQWdCLEtBQU87QUFBQSxJQUNsQyxTQUFTO0FBQUEsRUFDYixDQUFHO0FBRUQsT0FBSyxZQUFZLFdBQVksUUFBUSxXQUFXLFFBQVE7QUFDeEQsT0FBSyxhQUFhLE9BQU8sS0FBSztBQUM5QixPQUFLLFlBQVksU0FBUztBQUMxQixLQUFHLFlBQVksSUFBSTtBQUVuQixRQUFNLFFBQVEsTUFBTTtBQUNsQixTQUFLLE9BQVE7QUFDYixpQkFBYSxLQUFLO0FBQUEsRUFDbkI7QUFDRCxNQUFJLE1BQU0sS0FBSyxLQUFLO0FBRXBCLE1BQUksUUFBUSxXQUFXLE1BQU07QUFDM0IsY0FBVSxVQUFVLElBQUksd0JBQXdCO0FBQ2hELGNBQVUsTUFBTSxZQUFZLGVBQWdCLFdBQWE7QUFDekQsY0FBVSxNQUFNLFVBQVU7QUFFMUIsWUFBUSxXQUFXLE1BQU07QUFDdkIsZ0JBQVUsVUFBVSxPQUFPLHdCQUF3QjtBQUNuRCxnQkFBVSxVQUFVLElBQUksd0JBQXdCO0FBQ2hELGdCQUFVLE1BQU0sVUFBVTtBQUUxQixjQUFRLFdBQVcsTUFBTTtBQUN2QixhQUFLLE9BQVE7QUFDYixZQUFJLE1BQU0sT0FBTyxJQUFJLE1BQU0sUUFBUSxLQUFLLEdBQUcsQ0FBQztBQUFBLE1BQzdDLEdBQUUsR0FBRztBQUFBLElBQ1AsR0FBRSxHQUFHO0FBQUEsRUFDUCxHQUFFLEVBQUU7QUFDUDtBQUVBLFNBQVMsZ0JBQWlCLEtBQUssRUFBRSxXQUFXLE9BQU8sSUFBRyxHQUFJO0FBQ3hELFFBQU0sTUFBTSxPQUFPLE9BQU8sQ0FBRSxHQUFFLElBQUksSUFBSSxRQUFRLFdBQVcsS0FBSztBQUM5RCxNQUFJLFlBQVk7QUFBQSxJQUNkLE9BQU8sSUFBSSxVQUFVO0FBQUEsSUFDckIsTUFBTSxJQUFJLFNBQVM7QUFBQSxJQUNuQixRQUFRLElBQUksV0FBVztBQUFBLElBQ3ZCLE9BQU8sSUFBSSxTQUFTO0FBQUEsSUFDcEIsVUFBVSxDQUFBLEVBQUcsT0FBTyxJQUFJLFlBQVksRUFBRTtBQUFBLEVBQ3ZDO0FBQ0g7QUFFQSxJQUFBLFNBQWU7QUFBQSxFQUVYO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFFTixZQUFhLElBQUksU0FBUztBQUN4QixZQUFNLE1BQU0sUUFBUSxTQUFTLEVBQUUsV0FBVyxPQUFPLGlCQUFpQixHQUFHLFVBQVUsQ0FBRTtBQUVqRixVQUFJLElBQUksV0FBVyxPQUFPO0FBQ3hCO0FBQUEsTUFDRDtBQUVELFlBQU0sTUFBTTtBQUFBLFFBQ1Y7QUFBQSxRQUNBLFNBQVMsUUFBUSxVQUFVO0FBQUEsUUFDM0IsV0FBVyxDQUFFO0FBQUEsUUFDYixPQUFPLENBQUU7QUFBQSxRQUVULE1BQU8sS0FBSztBQUNWLGNBQ0UsSUFBSSxZQUFZLFFBQ2IsSUFBSSxnQkFBZ0IsUUFDcEIsSUFBSSxVQUFVLElBQUksVUFBVSxVQUFVLE9BQU8sZ0JBQWdCLFVBQ2hFO0FBQ0EsdUJBQVcsS0FBSyxJQUFJLEtBQUssSUFBSSxjQUFjLElBQUk7QUFBQSxVQUNoRDtBQUFBLFFBQ0Y7QUFBQSxRQUVELFVBQVUsU0FBUyxTQUFPO0FBQ3hCLGNBQ0UsSUFBSSxZQUFZLFFBQ2IsSUFBSSxnQkFBZ0IsUUFDcEIsVUFBVSxLQUFLLElBQUksVUFBVSxRQUFRLE1BQU0sUUFDM0MsSUFBSSxTQUFTLE1BQU8sSUFBSSxVQUFVLFVBQVUsT0FBTyxTQUFTLFFBQy9EO0FBQ0EsdUJBQVcsS0FBSyxJQUFJLEtBQUssSUFBSTtBQUFBLFVBQzlCO0FBQUEsUUFDRixHQUFFLEdBQUc7QUFBQSxNQUNQO0FBRUQsc0JBQWdCLEtBQUssT0FBTztBQUU1QixTQUFHLFlBQVk7QUFFZixhQUFPLEtBQUssUUFBUTtBQUFBLFFBQ2xCLENBQUUsSUFBSSxlQUFlLFNBQVMsU0FBVztBQUFBLFFBQ3pDLENBQUUsSUFBSSxTQUFTLFNBQVMsU0FBVztBQUFBLFFBQ25DLENBQUUsSUFBSSxXQUFXLFlBQVksU0FBVztBQUFBLFFBQ3hDLENBQUUsSUFBSSxTQUFTLFlBQVksU0FBVztBQUFBLE1BQ2hELENBQVM7QUFBQSxJQUNGO0FBQUEsSUFFRCxRQUFTLElBQUksU0FBUztBQUNwQixVQUFJLFFBQVEsYUFBYSxRQUFRLE9BQU87QUFDdEMsY0FBTSxNQUFNLEdBQUc7QUFDZixZQUFJLFFBQVEsUUFBUTtBQUNsQixjQUFJLFVBQVUsUUFBUSxVQUFVO0FBRWhDLGNBQUksSUFBSSxZQUFZLFFBQVEsT0FBTyxRQUFRLEtBQUssTUFBTSxRQUFRLE9BQU87QUFDbkUsNEJBQWdCLEtBQUssT0FBTztBQUFBLFVBQzdCO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFFRCxjQUFlLElBQUk7QUFDakIsWUFBTSxNQUFNLEdBQUc7QUFDZixVQUFJLFFBQVEsUUFBUTtBQUNsQixZQUFJLE1BQU0sUUFBUSxRQUFNO0FBQUUsYUFBSTtBQUFBLFFBQUEsQ0FBRTtBQUNoQyxpQkFBUyxLQUFLLE1BQU07QUFDcEIsZUFBTyxHQUFHO0FBQUEsTUFDWDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0w7QUNsSk8sTUFBTSxXQUFXO0FBQUEsRUFDdEIsTUFBTTtBQUFBLEVBQ04sUUFBUTtBQUFBLEVBQ1IsT0FBTztBQUFBLEVBQ1AsU0FBUztBQUFBLEVBQ1QsUUFBUTtBQUFBLEVBQ1IsUUFBUTtBQUFBLEVBQ1IsU0FBUztBQUNYO0FBRU8sTUFBTSxjQUFjLE9BQU8sS0FBSyxRQUFRO0FBRXhDLE1BQU0sZ0JBQWdCO0FBQUEsRUFDM0IsT0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sV0FBVyxPQUFLLFlBQVksU0FBUyxDQUFDO0FBQUEsRUFDdkM7QUFDSDtBQUVlLFNBQVEsU0FBRSxPQUFPO0FBRTlCLFNBQU8sU0FBUyxNQUFNO0FBQ3BCLFVBQU0sUUFBUSxNQUFNLFVBQVUsU0FDMUIsTUFBTSxhQUFhLE9BQU8sWUFBWSxTQUN0QyxNQUFNO0FBRVYsV0FBTyxHQUFJLE1BQU0sYUFBYSxPQUFPLFVBQVUsYUFBZSxTQUFVO0FBQUEsRUFDNUUsQ0FBRztBQUNIO0FDeEJPLE1BQU0sYUFBYTtBQUFBLEVBQ3hCLE1BQU07QUFBQSxFQUNOLElBQUk7QUFBQSxFQUNKLElBQUk7QUFBQSxFQUNKLElBQUk7QUFBQSxFQUNKLElBQUk7QUFBQSxFQUNKLElBQUk7QUFDTjtBQUVPLE1BQU0sZUFBZTtBQUFBLEVBQzFCLElBQUk7QUFBQSxFQUNKLElBQUk7QUFBQSxFQUNKLElBQUk7QUFBQSxFQUNKLElBQUk7QUFBQSxFQUNKLElBQUk7QUFDTjtBQUVBLE1BQU0sWUFBWSxDQUFFLFVBQVUsVUFBVSxPQUFTO0FBQ2pELE1BQU0sY0FBYztBQUViLE1BQU0sbUJBQW1CLENBQUUsUUFBUSxXQUFXLFFBQVEsWUFBYztBQUVwRSxTQUFTLGFBQWMsT0FBTyxjQUFjO0FBQ2pELE1BQUksTUFBTSxTQUFTO0FBQU0sV0FBTztBQUNoQyxNQUFJLE1BQU0sWUFBWTtBQUFNLFdBQU87QUFDbkMsTUFBSSxNQUFNLFNBQVM7QUFBTSxXQUFPO0FBQ2hDLE1BQUksTUFBTSxlQUFlO0FBQU0sV0FBTztBQUN0QyxTQUFPO0FBQ1Q7QUFTTyxNQUFNLGNBQWM7QUFBQSxFQUN6QixHQUFHO0FBQUEsRUFDSCxHQUFHO0FBQUEsRUFFSCxNQUFNO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsRUFDVjtBQUFBLEVBRUQsT0FBTyxDQUFFLFFBQVEsTUFBUTtBQUFBLEVBQ3pCLE1BQU07QUFBQSxFQUNOLFdBQVc7QUFBQSxFQUVYLEdBQUcsaUJBQWlCO0FBQUEsSUFDbEIsQ0FBQyxLQUFLLFNBQVMsSUFBSyxPQUFRLFlBQVk7QUFBQSxJQUN4QyxDQUFFO0FBQUEsRUFDSDtBQUFBLEVBRUQsUUFBUTtBQUFBLEVBQ1IsT0FBTztBQUFBLEVBQ1AsU0FBUztBQUFBLEVBQ1QsUUFBUTtBQUFBLEVBRVIsTUFBTTtBQUFBLEVBQ04sS0FBSztBQUFBLEVBQ0wsU0FBUztBQUFBLEVBQ1QsU0FBUztBQUFBLEVBRVQsT0FBTztBQUFBLEVBQ1AsV0FBVztBQUFBLEVBQ1gsUUFBUTtBQUFBLEVBQ1IsUUFBUTtBQUFBLEVBQ1IsT0FBTztBQUFBLEVBRVAsVUFBVSxDQUFFLFFBQVEsTUFBUTtBQUFBLEVBRTVCLFFBQVE7QUFBQSxJQUNOLE1BQU0sQ0FBRSxTQUFTLE1BQVE7QUFBQSxJQUN6QixTQUFTO0FBQUEsRUFDVjtBQUFBLEVBRUQsT0FBTztBQUFBLElBQ0wsR0FBRyxjQUFjO0FBQUEsSUFDakIsU0FBUztBQUFBLEVBQ1Y7QUFBQSxFQUNELE9BQU87QUFBQSxFQUNQLFNBQVM7QUFBQSxFQUNULFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVM7QUFBQSxFQUNWO0FBQUEsRUFDRCxTQUFTO0FBQ1g7QUFFZSxTQUFRLE9BQUUsT0FBTztBQUM5QixRQUFNLFlBQVksUUFBUSxPQUFPLFlBQVk7QUFDN0MsUUFBTSxhQUFhLFNBQVMsS0FBSztBQUNqQyxRQUFNLEVBQUUsZUFBZSxTQUFTLFNBQVMsV0FBVyxnQkFBaUIsSUFBRyxjQUFjO0FBQUEsSUFDcEYsYUFBYTtBQUFBLEVBQ2pCLENBQUc7QUFFRCxRQUFNLFFBQVEsU0FBUyxNQUFNO0FBQzNCLFVBQU0sTUFBTSxNQUFNLFFBQVEsU0FBUyxNQUFNLFlBQVksUUFDakQsVUFBVSxRQUNWLENBQUU7QUFFTixXQUFPLE1BQU0sWUFBWSxTQUNyQixPQUFPLE9BQU8sQ0FBRSxHQUFFLEtBQUs7QUFBQSxNQUN2QixTQUFTLE1BQU0sUUFDWixNQUFNLEtBQUssRUFDWCxJQUFJLE9BQU0sS0FBSyxhQUFhLFdBQVksS0FBTSxPQUFPLENBQUUsRUFDdkQsS0FBSyxHQUFHO0FBQUEsTUFDWCxVQUFVO0FBQUEsTUFDVixXQUFXO0FBQUEsSUFDbkIsQ0FBTyxJQUNDO0FBQUEsRUFDUixDQUFHO0FBRUQsUUFBTSxZQUFZO0FBQUEsSUFBUyxNQUN6QixNQUFNLFlBQVksUUFBUSxNQUFNLFFBQVEsUUFBUSxNQUFNLFlBQVk7QUFBQSxFQUNuRTtBQUVELFFBQU0sZUFBZTtBQUFBLElBQVMsTUFDNUIsTUFBTSxZQUFZLFFBQVEsTUFBTSxZQUFZO0FBQUEsRUFDN0M7QUFFRCxRQUFNLFdBQVcsU0FBUyxNQUN4QixhQUFhLFVBQVUsT0FBTyxNQUFNLFlBQVksSUFBSSxFQUNyRDtBQUVELFFBQU0sU0FBUyxTQUFTLE1BQU0sYUFBYSxPQUFPLFVBQVUsQ0FBQztBQUU3RCxRQUFNLGFBQWEsU0FBUyxNQUFNO0FBQ2hDLFVBQU0sTUFBTSxFQUFFLFVBQVUsU0FBUyxNQUFPO0FBRXhDLFFBQUksUUFBUSxVQUFVLE1BQU07QUFDMUIsYUFBTyxPQUFPLEtBQUssVUFBVSxLQUFLO0FBQUEsSUFDbkMsV0FDUSxVQUFVLFNBQVMsTUFBTSxJQUFJLE1BQU0sTUFBTTtBQUNoRCxVQUFJLE9BQU8sTUFBTTtBQUFBLElBQ2xCO0FBRUQsUUFBSSxRQUFRLFVBQVUsS0FBSztBQUN6QixVQUFJLE1BQU0sWUFBWSxNQUFNO0FBQzFCLFlBQUssbUJBQW9CO0FBQUEsTUFDMUIsV0FDUSxJQUFJLFNBQVMsUUFBUTtBQUM1QixZQUFJLE9BQU87QUFBQSxNQUNaO0FBRUQsVUFBSSxjQUFjLFVBQVUsUUFBUSxZQUFZLEtBQUssTUFBTSxJQUFJLE1BQU0sTUFBTTtBQUN6RSxZQUFJLE9BQU8sTUFBTTtBQUFBLE1BQ2xCO0FBQUEsSUFDRixXQUNRLE1BQU0sWUFBWSxNQUFNO0FBQy9CLFVBQUksV0FBVztBQUNmLFVBQUssbUJBQW9CO0FBQUEsSUFDMUI7QUFFRCxRQUFJLE1BQU0sWUFBWSxRQUFRLE1BQU0sZUFBZSxRQUFRO0FBQ3pELGFBQU8sT0FBTyxLQUFLO0FBQUEsUUFDakIsTUFBTTtBQUFBLFFBQ04saUJBQWlCO0FBQUEsUUFDakIsaUJBQWlCO0FBQUEsUUFDakIsaUJBQWlCLE1BQU07QUFBQSxNQUMvQixDQUFPO0FBQUEsSUFDRjtBQUVELFdBQU87QUFBQSxFQUNYLENBQUc7QUFFRCxRQUFNLFVBQVUsU0FBUyxNQUFNO0FBQzdCLFFBQUk7QUFFSixRQUFJLE1BQU0sVUFBVSxRQUFRO0FBQzFCLFVBQUksTUFBTSxTQUFTLFFBQVEsTUFBTSxZQUFZLE1BQU07QUFDakQsaUJBQVMsUUFBUyxNQUFNLGFBQWEsTUFBTTtBQUFBLE1BQzVDLE9BQ0k7QUFDSCxpQkFBUyxNQUFPLE1BQU0sY0FBZ0IsTUFBTSxhQUFhO0FBQUEsTUFDMUQ7QUFBQSxJQUNGLFdBQ1EsTUFBTSxXQUFXO0FBQ3hCLGVBQVMsUUFBUyxNQUFNO0FBQUEsSUFDekI7QUFFRCxVQUFNLFFBQVEsTUFBTSxVQUFVLE9BQzFCLFVBQ0EsWUFBYSxVQUFVLFVBQVUsT0FBTyxvQkFBcUIsTUFBTSxXQUFXLE9BQU8sbUJBQW1CO0FBRTVHLFdBQU8sVUFBVyxPQUFPLGdCQUFrQixXQUN0QyxXQUFXLFNBQVMsTUFBTSxTQUFTLE9BQ25DLGFBQWEsVUFBVSxPQUFPLCtDQUFnRCxNQUFNLFlBQVksT0FBTyxjQUFjLE9BQ3JILE1BQU0sUUFBUSxPQUFPLGdCQUFpQixNQUFNLFlBQVksT0FBTyxxQkFBcUIsT0FDcEYsTUFBTSxXQUFXLE9BQU8seUJBQXlCLE9BQ2pELE1BQU0sVUFBVSxPQUFPLGtCQUFrQixPQUN6QyxNQUFNLFlBQVksT0FBTyxtQ0FBbUMsT0FDNUQsTUFBTSxXQUFXLE9BQU8sWUFBWSxPQUNwQyxNQUFNLFNBQVMsbUJBQW1CO0FBQUEsRUFDM0MsQ0FBRztBQUVELFFBQU0sZUFBZTtBQUFBLElBQVMsTUFDNUIsV0FBVyxTQUFTLE1BQU0sVUFBVSxPQUFPLFlBQVksV0FDcEQsTUFBTSxXQUFXLE9BQU8sMEJBQTBCLE9BQ2xELE1BQU0sWUFBWSxPQUFPLDRCQUE0QjtBQUFBLEVBQ3pEO0FBRUQsU0FBTztBQUFBLElBQ0w7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRDtBQUNIO0FDOU1BLE1BQU0sRUFBRSxlQUFnQixJQUFHO0FBRTNCLElBQ0UsY0FBYyxNQUNkLGlCQUFpQixNQUNqQixjQUFjO0FBRWhCLElBQUEsT0FBZSxnQkFBZ0I7QUFBQSxFQUM3QixNQUFNO0FBQUEsRUFFTixPQUFPO0FBQUEsSUFDTCxHQUFHO0FBQUEsSUFFSCxZQUFZO0FBQUEsSUFDWixnQkFBZ0I7QUFBQSxJQUVoQixjQUFjLENBQUUsVUFBVSxLQUFPO0FBQUEsRUFDbEM7QUFBQSxFQUVELE9BQU8sQ0FBRSxTQUFTLFdBQVcsYUFBYSxPQUFTO0FBQUEsRUFFbkQsTUFBTyxPQUFPLEVBQUUsT0FBTyxLQUFJLEdBQUk7QUFDN0IsVUFBTSxFQUFFLE1BQU8sSUFBRyxtQkFBb0I7QUFFdEMsVUFBTTtBQUFBLE1BQ0o7QUFBQSxNQUFTO0FBQUEsTUFBTztBQUFBLE1BQ2hCO0FBQUEsTUFDQTtBQUFBLE1BQVM7QUFBQSxNQUFTO0FBQUEsTUFDbEI7QUFBQSxJQUNOLElBQVEsT0FBTyxLQUFLO0FBRWhCLFVBQU0sVUFBVSxJQUFJLElBQUk7QUFDeEIsVUFBTSxnQkFBZ0IsSUFBSSxJQUFJO0FBRTlCLFFBQUkscUJBQXFCLE1BQU0sa0JBQWtCLGFBQWE7QUFFOUQsVUFBTSxXQUFXO0FBQUEsTUFBUyxNQUN4QixNQUFNLFVBQVUsVUFBVSxNQUFNLFVBQVUsUUFBUSxNQUFNLFVBQVU7QUFBQSxJQUNuRTtBQUVELFVBQU0sU0FBUyxTQUFTLE1BQ3RCLE1BQU0sWUFBWSxRQUFRLE1BQU0sV0FBVyxRQUN2QyxRQUNBO0FBQUEsTUFDRSxVQUFVLFFBQVEsVUFBVSxPQUFPLENBQUUsSUFBSSxFQUFFLElBQUssQ0FBRSxFQUFJO0FBQUEsTUFDdEQsR0FBSSxNQUFNLFdBQVcsT0FBTyxDQUFBLElBQUssTUFBTTtBQUFBLElBQ3hDLENBQ047QUFFRCxVQUFNLGNBQWMsU0FBUyxPQUFPLEVBQUUsUUFBUSxNQUFNLE1BQUssRUFBRztBQUU1RCxVQUFNLGtCQUFrQixTQUFTLE1BQU07QUFDckMsWUFBTSxNQUFNLEtBQUssSUFBSSxHQUFHLEtBQUssSUFBSSxLQUFLLE1BQU0sVUFBVSxDQUFDO0FBQ3ZELGFBQU8sTUFBTSxJQUNULEVBQUUsWUFBWSxrQkFBa0IsV0FBVyxjQUFlLE1BQU0sUUFBVSxJQUMxRSxDQUFFO0FBQUEsSUFDWixDQUFLO0FBRUQsVUFBTSxXQUFXLFNBQVMsTUFBTTtBQUM5QixVQUFJLE1BQU0sWUFBWSxNQUFNO0FBQzFCLGVBQU87QUFBQSxVQUNMLGFBQWE7QUFBQSxVQUNiLGNBQWM7QUFBQSxVQUNkLFNBQVM7QUFBQSxVQUNULFdBQVc7QUFBQSxVQUNYLFNBQVM7QUFBQSxRQUNWO0FBQUEsTUFDRjtBQUVELFVBQUksYUFBYSxVQUFVLE1BQU07QUFDL0IsY0FBTSxNQUFNO0FBQUEsVUFDVjtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsUUFDRDtBQUVELFlBQUksTUFBTSxHQUFHLFNBQVMsSUFBSSxVQUFVLE1BQU07QUFDeEMsZ0JBQU0sU0FBUyxNQUFNLGlCQUFpQixTQUNsQyxLQUNBO0FBRUosY0FBSyxlQUFnQixZQUFjO0FBQUEsUUFDcEM7QUFFRCxlQUFPO0FBQUEsTUFDUjtBQUVELGFBQU87QUFBQSxRQUVMLFNBQVM7QUFBQSxNQUNWO0FBQUEsSUFDUCxDQUFLO0FBRUQsVUFBTSxZQUFZLFNBQVMsT0FBTztBQUFBLE1BQ2hDLEtBQUs7QUFBQSxNQUNMLE9BQU8sZ0RBQWdELFFBQVE7QUFBQSxNQUMvRCxPQUFPLE1BQU07QUFBQSxNQUNiLEdBQUcsV0FBVztBQUFBLE1BQ2QsR0FBRyxTQUFTO0FBQUEsSUFDbEIsRUFBTTtBQUVGLGFBQVMsUUFBUyxHQUFHO0FBRW5CLFVBQUksUUFBUSxVQUFVO0FBQU07QUFFNUIsVUFBSSxNQUFNLFFBQVE7QUFDaEIsWUFBSSxFQUFFLHFCQUFxQixNQUFNO0FBQy9CO0FBQUEsUUFDRDtBQUVELGNBQU0sS0FBSyxTQUFTO0FBR3BCLFlBQ0UsTUFBTSxTQUFTLFlBQ1osT0FBTyxTQUFTLFFBQ2hCLFFBQVEsTUFBTSxTQUFTLEVBQUUsTUFBTSxTQUUvQixHQUFHLFNBQVMsUUFBUSxLQUFLLE1BQU0sT0FDbEM7QUFDQSxrQkFBUSxNQUFNLE1BQU87QUFFckIsZ0JBQU0saUJBQWlCLE1BQU07QUFDM0IscUJBQVMsb0JBQW9CLFdBQVcsZ0JBQWdCLElBQUk7QUFDNUQscUJBQVMsb0JBQW9CLFNBQVMsZ0JBQWdCLGNBQWM7QUFDcEUsb0JBQVEsVUFBVSxRQUFRLFFBQVEsTUFBTSxvQkFBb0IsUUFBUSxnQkFBZ0IsY0FBYztBQUFBLFVBQ25HO0FBRUQsbUJBQVMsaUJBQWlCLFdBQVcsZ0JBQWdCLElBQUk7QUFDekQsbUJBQVMsaUJBQWlCLFNBQVMsZ0JBQWdCLGNBQWM7QUFDakUsa0JBQVEsTUFBTSxpQkFBaUIsUUFBUSxnQkFBZ0IsY0FBYztBQUFBLFFBQ3RFO0FBQUEsTUFDRjtBQUVELHNCQUFnQixDQUFDO0FBQUEsSUFDbEI7QUFFRCxhQUFTLFVBQVcsR0FBRztBQUVyQixVQUFJLFFBQVEsVUFBVTtBQUFNO0FBRTVCLFdBQUssV0FBVyxDQUFDO0FBRWpCLFVBQUksVUFBVSxHQUFHLENBQUUsSUFBSSxHQUFJLE1BQU0sUUFBUSxtQkFBbUIsUUFBUSxPQUFPO0FBQ3pFLDJCQUFtQixRQUFRLFFBQVM7QUFFcEMsWUFBSSxFQUFFLHFCQUFxQixNQUFNO0FBRS9CLGtCQUFRLE1BQU0sTUFBTztBQUVyQiwyQkFBaUIsUUFBUTtBQUN6QixrQkFBUSxNQUFNLFVBQVUsSUFBSSxlQUFlO0FBQzNDLG1CQUFTLGlCQUFpQixTQUFTLFlBQVksSUFBSTtBQUNuRCxrQkFBUSxNQUFNLGlCQUFpQixRQUFRLFlBQVksY0FBYztBQUFBLFFBQ2xFO0FBRUQsdUJBQWUsQ0FBQztBQUFBLE1BQ2pCO0FBQUEsSUFDRjtBQUVELGFBQVMsYUFBYyxHQUFHO0FBRXhCLFVBQUksUUFBUSxVQUFVO0FBQU07QUFFNUIsV0FBSyxjQUFjLENBQUM7QUFFcEIsVUFBSSxFQUFFLHFCQUFxQjtBQUFNO0FBRWpDLFVBQUksZ0JBQWdCLFFBQVEsT0FBTztBQUNqQyx3QkFBZ0IsUUFBUSxRQUFTO0FBQ2pDLHNCQUFjLFFBQVE7QUFFdEIsNkJBQXFCLEVBQUU7QUFDdkIsMkJBQW1CLGlCQUFpQixlQUFlLFlBQVksY0FBYztBQUM3RSwyQkFBbUIsaUJBQWlCLFlBQVksWUFBWSxjQUFjO0FBQUEsTUFDM0U7QUFJRCx5QkFBbUI7QUFDbkIscUJBQWUsUUFBUSxhQUFhLFVBQVU7QUFDOUMsbUJBQWEsV0FBVyxNQUFNO0FBQzVCLHFCQUFhO0FBQ2IsMkJBQW1CO0FBQUEsTUFDcEIsR0FBRSxHQUFHO0FBQUEsSUFDUDtBQUVELGFBQVMsWUFBYSxHQUFHO0FBRXZCLFVBQUksUUFBUSxVQUFVO0FBQU07QUFFNUIsUUFBRSxjQUFjLHFCQUFxQjtBQUNyQyxXQUFLLGFBQWEsQ0FBQztBQUVuQixVQUFJLEVBQUUscUJBQXFCLFFBQVEsZ0JBQWdCLFFBQVEsT0FBTztBQUNoRSx3QkFBZ0IsUUFBUSxRQUFTO0FBQ2pDLHNCQUFjLFFBQVE7QUFDdEIsZ0JBQVEsTUFBTSxVQUFVLElBQUksZUFBZTtBQUMzQyxpQkFBUyxpQkFBaUIsV0FBVyxZQUFZLGNBQWM7QUFBQSxNQUNoRTtBQUFBLElBQ0Y7QUFFRCxhQUFTLFdBQVksR0FBRztBQUV0QixVQUFJLFFBQVEsVUFBVTtBQUFNO0FBRzVCLFVBQUksTUFBTSxVQUFVLEVBQUUsU0FBUyxVQUFVLFNBQVMsa0JBQWtCLFFBQVEsT0FBTztBQUNqRjtBQUFBLE1BQ0Q7QUFFRCxVQUFJLE1BQU0sVUFBVSxFQUFFLFNBQVMsU0FBUztBQUN0QyxZQUFJLG1CQUFtQixRQUFRLFNBQVMsVUFBVSxHQUFHLENBQUUsSUFBSSxHQUFJLE1BQU0sTUFBTTtBQUV6RSxnQkFBTSxNQUFNLElBQUksV0FBVyxTQUFTLENBQUM7QUFDckMsY0FBSSxZQUFZO0FBQ2hCLFlBQUUscUJBQXFCLFFBQVEsUUFBUSxHQUFHO0FBQzFDLFlBQUUsaUJBQWlCLFFBQVEsS0FBSyxHQUFHO0FBQ25DLGtCQUFRLE1BQU0sY0FBYyxHQUFHO0FBRS9CLHlCQUFlLENBQUM7QUFHaEIsWUFBRSxZQUFZO0FBQUEsUUFDZjtBQUVELGFBQUssU0FBUyxDQUFDO0FBQUEsTUFDaEI7QUFFRCxjQUFTO0FBQUEsSUFDVjtBQUVELGFBQVMsUUFBUyxZQUFZO0FBQzVCLFlBQU0sYUFBYSxjQUFjO0FBRWpDLFVBQ0UsZUFBZSxTQUNYLGdCQUFnQixRQUFRLFNBQVMsZ0JBQWdCLFFBQVEsVUFDMUQsZUFBZSxRQUNmLGVBQWUsU0FBUyxlQUMzQjtBQUNBLG1CQUFXLGFBQWEsWUFBWSxFQUFFO0FBQ3RDLG1CQUFXLE1BQU87QUFBQSxNQUNuQjtBQUVELFVBQUksZ0JBQWdCLFFBQVEsT0FBTztBQUNqQyxZQUFJLHVCQUF1QixNQUFNO0FBQy9CLDZCQUFtQixvQkFBb0IsZUFBZSxZQUFZLGNBQWM7QUFDaEYsNkJBQW1CLG9CQUFvQixZQUFZLFlBQVksY0FBYztBQUFBLFFBQzlFO0FBQ0Qsc0JBQWMscUJBQXFCO0FBQUEsTUFDcEM7QUFFRCxVQUFJLGdCQUFnQixRQUFRLE9BQU87QUFDakMsaUJBQVMsb0JBQW9CLFdBQVcsWUFBWSxjQUFjO0FBQ2xFLHNCQUFjO0FBQUEsTUFDZjtBQUVELFVBQUksbUJBQW1CLFFBQVEsT0FBTztBQUNwQyxpQkFBUyxvQkFBb0IsU0FBUyxZQUFZLElBQUk7QUFDdEQsZ0JBQVEsVUFBVSxRQUFRLFFBQVEsTUFBTSxvQkFBb0IsUUFBUSxZQUFZLGNBQWM7QUFDOUYseUJBQWlCO0FBQUEsTUFDbEI7QUFFRCxjQUFRLFVBQVUsUUFBUSxRQUFRLE1BQU0sVUFBVSxPQUFPLGVBQWU7QUFBQSxJQUN6RTtBQUVELGFBQVMsYUFBYyxLQUFLO0FBQzFCLHFCQUFlLEdBQUc7QUFDbEIsVUFBSSxjQUFjO0FBQUEsSUFDbkI7QUFFRCxvQkFBZ0IsTUFBTTtBQUNwQixjQUFRLElBQUk7QUFBQSxJQUNsQixDQUFLO0FBR0QsV0FBTyxPQUFPLE9BQU87QUFBQSxNQUNuQixPQUFPLE9BQUs7QUFDVixZQUFJLGFBQWEsVUFBVSxNQUFNO0FBQy9CLGtCQUFRLENBQUM7QUFBQSxRQUNWO0FBQUEsTUFDRjtBQUFBLElBQ1AsQ0FBSztBQUVELFdBQU8sTUFBTTtBQUNYLFVBQUksUUFBUSxDQUFFO0FBRWQsWUFBTSxTQUFTLFVBQVUsTUFBTTtBQUFBLFFBQzdCLEVBQUUsT0FBTztBQUFBLFVBQ1AsTUFBTSxNQUFNO0FBQUEsVUFDWixNQUFNLE1BQU0sVUFBVSxRQUFRLFNBQVMsVUFBVTtBQUFBLFVBQ2pELE1BQU07QUFBQSxVQUNOLGVBQWU7QUFBQSxRQUN6QixDQUFTO0FBQUEsTUFDRjtBQUVELGVBQVMsVUFBVSxRQUFRLE1BQU07QUFBQSxRQUMvQixFQUFFLFFBQVEsRUFBRSxPQUFPLFFBQU8sR0FBSSxDQUFFLE1BQU0sTUFBTztBQUFBLE1BQzlDO0FBRUQsY0FBUSxXQUFXLE1BQU0sU0FBUyxLQUFLO0FBRXZDLFVBQUksTUFBTSxjQUFjLFVBQVUsTUFBTSxVQUFVLE9BQU87QUFDdkQsY0FBTTtBQUFBLFVBQ0osRUFBRSxPQUFPO0FBQUEsWUFDUCxNQUFNLE1BQU07QUFBQSxZQUNaLE9BQU8sTUFBTSxVQUFVLFFBQVEsU0FBUyxVQUFVO0FBQUEsWUFDbEQsTUFBTTtBQUFBLFlBQ04sZUFBZTtBQUFBLFVBQzNCLENBQVc7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUVELFlBQU0sUUFBUTtBQUFBLFFBQ1osRUFBRSxRQUFRO0FBQUEsVUFDUixPQUFPO0FBQUEsVUFDUCxLQUFLO0FBQUEsUUFDZixDQUFTO0FBQUEsTUFDRjtBQUVELFVBQUksTUFBTSxZQUFZLFFBQVEsTUFBTSxlQUFlLFFBQVE7QUFDekQsY0FBTTtBQUFBLFVBQ0osRUFBRSxRQUFRO0FBQUEsWUFDUixPQUFPLG1EQUFtRCxNQUFNLG1CQUFtQixPQUFPLDJCQUEyQjtBQUFBLFVBQ2pJLEdBQWE7QUFBQSxZQUNELEVBQUUsUUFBUTtBQUFBLGNBQ1IsT0FBTztBQUFBLGNBQ1AsT0FBTyxnQkFBZ0I7QUFBQSxZQUNyQyxDQUFhO0FBQUEsVUFDYixDQUFXO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFFRCxZQUFNO0FBQUEsUUFDSixFQUFFLFFBQVE7QUFBQSxVQUNSLE9BQU8sZ0VBQWdFLGFBQWE7QUFBQSxRQUNyRixHQUFFLEtBQUs7QUFBQSxNQUNUO0FBRUQsWUFBTSxZQUFZLFFBQVEsTUFBTTtBQUFBLFFBQzlCLEVBQUUsWUFBWTtBQUFBLFVBQ1osTUFBTTtBQUFBLFFBQ2hCLEdBQVcsTUFDRCxNQUFNLFlBQVksT0FDZDtBQUFBLFVBQ0UsRUFBRSxRQUFRO0FBQUEsWUFDUixLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDekIsR0FBbUIsTUFBTSxZQUFZLFNBQVMsTUFBTSxRQUFPLElBQUssQ0FBRSxFQUFFLFFBQVEsRUFBRztBQUFBLFFBQ2hFLElBQ0QsSUFDTDtBQUFBLE1BQ0Y7QUFFRCxhQUFPO0FBQUEsUUFDTDtBQUFBLFVBQ0UsUUFBUTtBQUFBLFVBQ1IsVUFBVTtBQUFBLFVBQ1Y7QUFBQSxRQUNEO0FBQUEsUUFDRCxDQUFFO0FBQUEsVUFDQTtBQUFBLFVBQ0EsT0FBTztBQUFBLFVBQ1A7QUFBQSxVQUNBLFlBQVk7QUFBQSxRQUN0QixDQUFXO0FBQUEsTUFDSjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0gsQ0FBQzs7In0=
