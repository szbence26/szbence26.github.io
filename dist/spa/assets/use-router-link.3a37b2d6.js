import { E as unref, a as computed, c as createComponent, h, g as getCurrentInstance } from "./index.4401bd22.js";
function hSlot(slot, otherwise) {
  return slot !== void 0 ? slot() || otherwise : otherwise;
}
function hUniqueSlot(slot, otherwise) {
  if (slot !== void 0) {
    const vnode = slot();
    if (vnode !== void 0 && vnode !== null) {
      return vnode.slice();
    }
  }
  return otherwise;
}
function hMergeSlot(slot, source) {
  return slot !== void 0 ? source.concat(slot()) : source;
}
function css(element, css2) {
  const style = element.style;
  for (const prop in css2) {
    style[prop] = css2[prop];
  }
}
function getElement(el) {
  if (el === void 0 || el === null) {
    return void 0;
  }
  if (typeof el === "string") {
    try {
      return document.querySelector(el) || void 0;
    } catch (err) {
      return void 0;
    }
  }
  const target = unref(el);
  if (target) {
    return target.$el || target;
  }
}
const useSizeDefaults = {
  xs: 18,
  sm: 24,
  md: 32,
  lg: 38,
  xl: 46
};
const useSizeProps = {
  size: String
};
function useSize(props, sizes = useSizeDefaults) {
  return computed(() => props.size !== void 0 ? { fontSize: props.size in sizes ? `${sizes[props.size]}px` : props.size } : null);
}
const defaultViewBox = "0 0 24 24";
const sameFn = (i) => i;
const ionFn = (i) => `ionicons ${i}`;
const libMap = {
  "mdi-": (i) => `mdi ${i}`,
  "icon-": sameFn,
  "bt-": (i) => `bt ${i}`,
  "eva-": (i) => `eva ${i}`,
  "ion-md": ionFn,
  "ion-ios": ionFn,
  "ion-logo": ionFn,
  "iconfont ": sameFn,
  "ti-": (i) => `themify-icon ${i}`,
  "bi-": (i) => `bootstrap-icons ${i}`
};
const matMap = {
  o_: "-outlined",
  r_: "-round",
  s_: "-sharp"
};
const symMap = {
  sym_o_: "-outlined",
  sym_r_: "-rounded",
  sym_s_: "-sharp"
};
const libRE = new RegExp("^(" + Object.keys(libMap).join("|") + ")");
const matRE = new RegExp("^(" + Object.keys(matMap).join("|") + ")");
const symRE = new RegExp("^(" + Object.keys(symMap).join("|") + ")");
const mRE = /^[Mm]\s?[-+]?\.?\d/;
const imgRE = /^img:/;
const svgUseRE = /^svguse:/;
const ionRE = /^ion-/;
const faRE = /^(fa-(sharp|solid|regular|light|brands|duotone|thin)|[lf]a[srlbdk]?) /;
var QIcon = createComponent({
  name: "QIcon",
  props: {
    ...useSizeProps,
    tag: {
      type: String,
      default: "i"
    },
    name: String,
    color: String,
    left: Boolean,
    right: Boolean
  },
  setup(props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance();
    const sizeStyle = useSize(props);
    const classes = computed(
      () => "q-icon" + (props.left === true ? " on-left" : "") + (props.right === true ? " on-right" : "") + (props.color !== void 0 ? ` text-${props.color}` : "")
    );
    const type = computed(() => {
      let cls;
      let icon = props.name;
      if (icon === "none" || !icon) {
        return { none: true };
      }
      if ($q.iconMapFn !== null) {
        const res = $q.iconMapFn(icon);
        if (res !== void 0) {
          if (res.icon !== void 0) {
            icon = res.icon;
            if (icon === "none" || !icon) {
              return { none: true };
            }
          } else {
            return {
              cls: res.cls,
              content: res.content !== void 0 ? res.content : " "
            };
          }
        }
      }
      if (mRE.test(icon) === true) {
        const [def, viewBox = defaultViewBox] = icon.split("|");
        return {
          svg: true,
          viewBox,
          nodes: def.split("&&").map((path) => {
            const [d, style, transform] = path.split("@@");
            return h("path", { style, d, transform });
          })
        };
      }
      if (imgRE.test(icon) === true) {
        return {
          img: true,
          src: icon.substring(4)
        };
      }
      if (svgUseRE.test(icon) === true) {
        const [def, viewBox = defaultViewBox] = icon.split("|");
        return {
          svguse: true,
          src: def.substring(7),
          viewBox
        };
      }
      let content = " ";
      const matches = icon.match(libRE);
      if (matches !== null) {
        cls = libMap[matches[1]](icon);
      } else if (faRE.test(icon) === true) {
        cls = icon;
      } else if (ionRE.test(icon) === true) {
        cls = `ionicons ion-${$q.platform.is.ios === true ? "ios" : "md"}${icon.substring(3)}`;
      } else if (symRE.test(icon) === true) {
        cls = "notranslate material-symbols";
        const matches2 = icon.match(symRE);
        if (matches2 !== null) {
          icon = icon.substring(6);
          cls += symMap[matches2[1]];
        }
        content = icon;
      } else {
        cls = "notranslate material-icons";
        const matches2 = icon.match(matRE);
        if (matches2 !== null) {
          icon = icon.substring(2);
          cls += matMap[matches2[1]];
        }
        content = icon;
      }
      return {
        cls,
        content
      };
    });
    return () => {
      const data = {
        class: classes.value,
        style: sizeStyle.value,
        "aria-hidden": "true",
        role: "presentation"
      };
      if (type.value.none === true) {
        return h(props.tag, data, hSlot(slots.default));
      }
      if (type.value.img === true) {
        return h(props.tag, data, hMergeSlot(slots.default, [
          h("img", { src: type.value.src })
        ]));
      }
      if (type.value.svg === true) {
        return h(props.tag, data, hMergeSlot(slots.default, [
          h("svg", {
            viewBox: type.value.viewBox || "0 0 24 24"
          }, type.value.nodes)
        ]));
      }
      if (type.value.svguse === true) {
        return h(props.tag, data, hMergeSlot(slots.default, [
          h("svg", {
            viewBox: type.value.viewBox
          }, [
            h("use", { "xlink:href": type.value.src })
          ])
        ]));
      }
      if (type.value.cls !== void 0) {
        data.class += " " + type.value.cls;
      }
      return h(props.tag, data, hMergeSlot(slots.default, [
        type.value.content
      ]));
    };
  }
});
function vmHasRouter(vm) {
  return vm.appContext.config.globalProperties.$router !== void 0;
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
function isSameRouteRecord(a, b) {
  return (a.aliasOf || a) === (b.aliasOf || b);
}
function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key], outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue) {
        return false;
      }
    } else if (Array.isArray(outerValue) === false || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i])) {
      return false;
    }
  }
  return true;
}
function isEquivalentArray(a, b) {
  return Array.isArray(b) === true ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function isSameRouteLocationParamsValue(a, b) {
  return Array.isArray(a) === true ? isEquivalentArray(a, b) : Array.isArray(b) === true ? isEquivalentArray(b, a) : a === b;
}
function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  for (const key in a) {
    if (isSameRouteLocationParamsValue(a[key], b[key]) === false) {
      return false;
    }
  }
  return true;
}
const useRouterLinkProps = {
  to: [String, Object],
  replace: Boolean,
  exact: Boolean,
  activeClass: {
    type: String,
    default: "q-router-link--active"
  },
  exactActiveClass: {
    type: String,
    default: "q-router-link--exact-active"
  },
  href: String,
  target: String,
  disable: Boolean
};
function useRouterLink({ fallbackTag, useDisableForRouterLinkProps = true } = {}) {
  const vm = getCurrentInstance();
  const { props, proxy, emit } = vm;
  const hasRouter = vmHasRouter(vm);
  const hasHrefLink = computed(() => props.disable !== true && props.href !== void 0);
  const hasRouterLinkProps = useDisableForRouterLinkProps === true ? computed(
    () => hasRouter === true && props.disable !== true && hasHrefLink.value !== true && props.to !== void 0 && props.to !== null && props.to !== ""
  ) : computed(
    () => hasRouter === true && hasHrefLink.value !== true && props.to !== void 0 && props.to !== null && props.to !== ""
  );
  const resolvedLink = computed(() => hasRouterLinkProps.value === true ? getLink(props.to) : null);
  const hasRouterLink = computed(() => resolvedLink.value !== null);
  const hasLink = computed(() => hasHrefLink.value === true || hasRouterLink.value === true);
  const linkTag = computed(() => props.type === "a" || hasLink.value === true ? "a" : props.tag || fallbackTag || "div");
  const linkAttrs = computed(() => hasHrefLink.value === true ? {
    href: props.href,
    target: props.target
  } : hasRouterLink.value === true ? {
    href: resolvedLink.value.href,
    target: props.target
  } : {});
  const linkActiveIndex = computed(() => {
    if (hasRouterLink.value === false) {
      return -1;
    }
    const { matched } = resolvedLink.value, { length } = matched, routeMatched = matched[length - 1];
    if (routeMatched === void 0) {
      return -1;
    }
    const currentMatched = proxy.$route.matched;
    if (currentMatched.length === 0) {
      return -1;
    }
    const index = currentMatched.findIndex(
      isSameRouteRecord.bind(null, routeMatched)
    );
    if (index !== -1) {
      return index;
    }
    const parentRecordPath = getOriginalPath(matched[length - 2]);
    return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(
      isSameRouteRecord.bind(null, matched[length - 2])
    ) : index;
  });
  const linkIsActive = computed(
    () => hasRouterLink.value === true && linkActiveIndex.value !== -1 && includesParams(proxy.$route.params, resolvedLink.value.params)
  );
  const linkIsExactActive = computed(
    () => linkIsActive.value === true && linkActiveIndex.value === proxy.$route.matched.length - 1 && isSameRouteLocationParams(proxy.$route.params, resolvedLink.value.params)
  );
  const linkClass = computed(() => hasRouterLink.value === true ? linkIsExactActive.value === true ? ` ${props.exactActiveClass} ${props.activeClass}` : props.exact === true ? "" : linkIsActive.value === true ? ` ${props.activeClass}` : "" : "");
  function getLink(to) {
    try {
      return proxy.$router.resolve(to);
    } catch (_) {
    }
    return null;
  }
  function navigateToRouterLink(e, { returnRouterError, to = props.to, replace = props.replace } = {}) {
    if (props.disable === true) {
      e.preventDefault();
      return Promise.resolve(false);
    }
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || e.button !== void 0 && e.button !== 0 || props.target === "_blank") {
      return Promise.resolve(false);
    }
    e.preventDefault();
    const promise = proxy.$router[replace === true ? "replace" : "push"](to);
    return returnRouterError === true ? promise : promise.then(() => {
    }).catch(() => {
    });
  }
  function navigateOnClick(e) {
    if (hasRouterLink.value === true) {
      const go = (opts) => navigateToRouterLink(e, opts);
      emit("click", e, go);
      e.defaultPrevented !== true && go();
    } else {
      emit("click", e);
    }
  }
  return {
    hasRouterLink,
    hasHrefLink,
    hasLink,
    linkTag,
    resolvedLink,
    linkIsActive,
    linkIsExactActive,
    linkClass,
    linkAttrs,
    getLink,
    navigateToRouterLink,
    navigateOnClick
  };
}
export { QIcon as Q, hMergeSlot as a, useRouterLink as b, css as c, hUniqueSlot as d, useSizeDefaults as e, useSizeProps as f, getElement as g, hSlot as h, useSize as i, useRouterLinkProps as u };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXJvdXRlci1saW5rLjNhMzdiMmQ2LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcXVhc2FyL3NyYy91dGlscy9wcml2YXRlLnJlbmRlci9yZW5kZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcXVhc2FyL3NyYy91dGlscy9kb20vZG9tLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3F1YXNhci9zcmMvY29tcG9zYWJsZXMvcHJpdmF0ZS51c2Utc2l6ZS91c2Utc2l6ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9xdWFzYXIvc3JjL2NvbXBvbmVudHMvaWNvbi9RSWNvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9xdWFzYXIvc3JjL3V0aWxzL3ByaXZhdGUudm0vdm0uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcXVhc2FyL3NyYy9jb21wb3NhYmxlcy9wcml2YXRlLnVzZS1yb3V0ZXItbGluay91c2Utcm91dGVyLWxpbmsuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCwgd2l0aERpcmVjdGl2ZXMgfSBmcm9tICd2dWUnXG5cbmV4cG9ydCBmdW5jdGlvbiBoU2xvdCAoc2xvdCwgb3RoZXJ3aXNlKSB7XG4gIHJldHVybiBzbG90ICE9PSB2b2lkIDBcbiAgICA/IHNsb3QoKSB8fCBvdGhlcndpc2VcbiAgICA6IG90aGVyd2lzZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaFVuaXF1ZVNsb3QgKHNsb3QsIG90aGVyd2lzZSkge1xuICBpZiAoc2xvdCAhPT0gdm9pZCAwKSB7XG4gICAgY29uc3Qgdm5vZGUgPSBzbG90KClcbiAgICBpZiAodm5vZGUgIT09IHZvaWQgMCAmJiB2bm9kZSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHZub2RlLnNsaWNlKClcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3RoZXJ3aXNlXG59XG5cbi8qKlxuICogU291cmNlIGRlZmluaXRlbHkgZXhpc3RzLFxuICogc28gaXQncyBtZXJnZWQgd2l0aCB0aGUgcG9zc2libGUgc2xvdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaE1lcmdlU2xvdCAoc2xvdCwgc291cmNlKSB7XG4gIHJldHVybiBzbG90ICE9PSB2b2lkIDBcbiAgICA/IHNvdXJjZS5jb25jYXQoc2xvdCgpKVxuICAgIDogc291cmNlXG59XG5cbi8qKlxuICogTWVyZ2Ugd2l0aCBwb3NzaWJsZSBzbG90LFxuICogZXZlbiBpZiBzb3VyY2UgbWlnaHQgbm90IGV4aXN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoTWVyZ2VTbG90U2FmZWx5IChzbG90LCBzb3VyY2UpIHtcbiAgaWYgKHNsb3QgPT09IHZvaWQgMCkge1xuICAgIHJldHVybiBzb3VyY2VcbiAgfVxuXG4gIHJldHVybiBzb3VyY2UgIT09IHZvaWQgMFxuICAgID8gc291cmNlLmNvbmNhdChzbG90KCkpXG4gICAgOiBzbG90KClcbn1cblxuLypcbiAqIChTdHJpbmcpICBrZXkgICAgICAgLSB1bmlxdWUgdm5vZGUga2V5XG4gKiAoQm9vbGVhbikgY29uZGl0aW9uIC0gc2hvdWxkIGNoYW5nZSBPTkxZIHdoZW4gYWRkaW5nL3JlbW92aW5nIGRpcmVjdGl2ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaERpciAoXG4gIHRhZyxcbiAgZGF0YSxcbiAgY2hpbGRyZW4sXG4gIGtleSxcbiAgY29uZGl0aW9uLFxuICBnZXREaXJzRm5cbikge1xuICBkYXRhLmtleSA9IGtleSArIGNvbmRpdGlvblxuXG4gIGNvbnN0IHZub2RlID0gaCh0YWcsIGRhdGEsIGNoaWxkcmVuKVxuXG4gIHJldHVybiBjb25kaXRpb24gPT09IHRydWVcbiAgICA/IHdpdGhEaXJlY3RpdmVzKHZub2RlLCBnZXREaXJzRm4oKSlcbiAgICA6IHZub2RlXG59XG4iLCJpbXBvcnQgeyB1bnJlZiB9IGZyb20gJ3Z1ZSdcblxuZXhwb3J0IGZ1bmN0aW9uIG9mZnNldCAoZWwpIHtcbiAgaWYgKGVsID09PSB3aW5kb3cpIHtcbiAgICByZXR1cm4geyB0b3A6IDAsIGxlZnQ6IDAgfVxuICB9XG4gIGNvbnN0IHsgdG9wLCBsZWZ0IH0gPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICByZXR1cm4geyB0b3AsIGxlZnQgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3R5bGUgKGVsLCBwcm9wZXJ0eSkge1xuICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoZWlnaHQgKGVsKSB7XG4gIHJldHVybiBlbCA9PT0gd2luZG93XG4gICAgPyB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICA6IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodFxufVxuXG5leHBvcnQgZnVuY3Rpb24gd2lkdGggKGVsKSB7XG4gIHJldHVybiBlbCA9PT0gd2luZG93XG4gICAgPyB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIDogZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGhcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNzcyAoZWxlbWVudCwgY3NzKSB7XG4gIGNvbnN0IHN0eWxlID0gZWxlbWVudC5zdHlsZVxuXG4gIGZvciAoY29uc3QgcHJvcCBpbiBjc3MpIHtcbiAgICBzdHlsZVsgcHJvcCBdID0gY3NzWyBwcm9wIF1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3NzQmF0Y2ggKGVsZW1lbnRzLCBzdHlsZSkge1xuICBlbGVtZW50cy5mb3JFYWNoKGVsID0+IGNzcyhlbCwgc3R5bGUpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVhZHkgKGZuKSB7XG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9PSAnbG9hZGluZycpIHtcbiAgICByZXR1cm4gZm4oKVxuICB9XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZuLCBmYWxzZSlcbn1cblxuLy8gaW50ZXJuYWxcbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50IChlbCkge1xuICBpZiAoZWwgPT09IHZvaWQgMCB8fCBlbCA9PT0gbnVsbCkge1xuICAgIHJldHVybiB2b2lkIDBcbiAgfVxuXG4gIGlmICh0eXBlb2YgZWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKSB8fCB2b2lkIDBcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHZvaWQgMFxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHRhcmdldCA9IHVucmVmKGVsKVxuICBpZiAodGFyZ2V0KSB7XG4gICAgcmV0dXJuIHRhcmdldC4kZWwgfHwgdGFyZ2V0XG4gIH1cbn1cblxuLy8gaW50ZXJuYWxcbmV4cG9ydCBmdW5jdGlvbiBjaGlsZEhhc0ZvY3VzIChlbCwgZm9jdXNlZEVsKSB7XG4gIGlmIChlbCA9PT0gdm9pZCAwIHx8IGVsID09PSBudWxsIHx8IGVsLmNvbnRhaW5zKGZvY3VzZWRFbCkgPT09IHRydWUpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgZm9yIChsZXQgbmV4dCA9IGVsLm5leHRFbGVtZW50U2libGluZzsgbmV4dCAhPT0gbnVsbDsgbmV4dCA9IG5leHQubmV4dEVsZW1lbnRTaWJsaW5nKSB7XG4gICAgaWYgKG5leHQuY29udGFpbnMoZm9jdXNlZEVsKSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2Vcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBvZmZzZXQsXG4gIHN0eWxlLFxuICBoZWlnaHQsXG4gIHdpZHRoLFxuICBjc3MsXG4gIGNzc0JhdGNoLFxuICByZWFkeVxufVxuIiwiaW1wb3J0IHsgY29tcHV0ZWQgfSBmcm9tICd2dWUnXG5cbmV4cG9ydCBjb25zdCB1c2VTaXplRGVmYXVsdHMgPSB7XG4gIHhzOiAxOCxcbiAgc206IDI0LFxuICBtZDogMzIsXG4gIGxnOiAzOCxcbiAgeGw6IDQ2XG59XG5cbmV4cG9ydCBjb25zdCB1c2VTaXplUHJvcHMgPSB7XG4gIHNpemU6IFN0cmluZ1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAocHJvcHMsIHNpemVzID0gdXNlU2l6ZURlZmF1bHRzKSB7XG4gIC8vIHJldHVybiBzaXplU3R5bGVcbiAgcmV0dXJuIGNvbXB1dGVkKCgpID0+IChcbiAgICBwcm9wcy5zaXplICE9PSB2b2lkIDBcbiAgICAgID8geyBmb250U2l6ZTogcHJvcHMuc2l6ZSBpbiBzaXplcyA/IGAkeyBzaXplc1sgcHJvcHMuc2l6ZSBdIH1weGAgOiBwcm9wcy5zaXplIH1cbiAgICAgIDogbnVsbFxuICApKVxufVxuIiwiaW1wb3J0IHsgaCwgY29tcHV0ZWQsIGdldEN1cnJlbnRJbnN0YW5jZSB9IGZyb20gJ3Z1ZSdcblxuaW1wb3J0IHVzZVNpemUsIHsgdXNlU2l6ZVByb3BzIH0gZnJvbSAnLi4vLi4vY29tcG9zYWJsZXMvcHJpdmF0ZS51c2Utc2l6ZS91c2Utc2l6ZS5qcydcblxuaW1wb3J0IHsgY3JlYXRlQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vdXRpbHMvcHJpdmF0ZS5jcmVhdGUvY3JlYXRlLmpzJ1xuaW1wb3J0IHsgaFNsb3QsIGhNZXJnZVNsb3QgfSBmcm9tICcuLi8uLi91dGlscy9wcml2YXRlLnJlbmRlci9yZW5kZXIuanMnXG5cbmNvbnN0IGRlZmF1bHRWaWV3Qm94ID0gJzAgMCAyNCAyNCdcblxuY29uc3Qgc2FtZUZuID0gaSA9PiBpXG5jb25zdCBpb25GbiA9IGkgPT4gYGlvbmljb25zICR7IGkgfWBcblxuY29uc3QgbGliTWFwID0ge1xuICAnbWRpLSc6IGkgPT4gYG1kaSAkeyBpIH1gLFxuICAnaWNvbi0nOiBzYW1lRm4sIC8vIGZvbnRhd2Vzb21lIGVxdWl2XG4gICdidC0nOiBpID0+IGBidCAkeyBpIH1gLFxuICAnZXZhLSc6IGkgPT4gYGV2YSAkeyBpIH1gLFxuICAnaW9uLW1kJzogaW9uRm4sXG4gICdpb24taW9zJzogaW9uRm4sXG4gICdpb24tbG9nbyc6IGlvbkZuLFxuICAnaWNvbmZvbnQgJzogc2FtZUZuLFxuICAndGktJzogaSA9PiBgdGhlbWlmeS1pY29uICR7IGkgfWAsXG4gICdiaS0nOiBpID0+IGBib290c3RyYXAtaWNvbnMgJHsgaSB9YFxufVxuXG5jb25zdCBtYXRNYXAgPSB7XG4gIG9fOiAnLW91dGxpbmVkJyxcbiAgcl86ICctcm91bmQnLFxuICBzXzogJy1zaGFycCdcbn1cblxuY29uc3Qgc3ltTWFwID0ge1xuICBzeW1fb186ICctb3V0bGluZWQnLFxuICBzeW1fcl86ICctcm91bmRlZCcsXG4gIHN5bV9zXzogJy1zaGFycCdcbn1cblxuY29uc3QgbGliUkUgPSBuZXcgUmVnRXhwKCdeKCcgKyBPYmplY3Qua2V5cyhsaWJNYXApLmpvaW4oJ3wnKSArICcpJylcbmNvbnN0IG1hdFJFID0gbmV3IFJlZ0V4cCgnXignICsgT2JqZWN0LmtleXMobWF0TWFwKS5qb2luKCd8JykgKyAnKScpXG5jb25zdCBzeW1SRSA9IG5ldyBSZWdFeHAoJ14oJyArIE9iamVjdC5rZXlzKHN5bU1hcCkuam9pbignfCcpICsgJyknKVxuY29uc3QgbVJFID0gL15bTW1dXFxzP1stK10/XFwuP1xcZC9cbmNvbnN0IGltZ1JFID0gL15pbWc6L1xuY29uc3Qgc3ZnVXNlUkUgPSAvXnN2Z3VzZTovXG5jb25zdCBpb25SRSA9IC9eaW9uLS9cbmNvbnN0IGZhUkUgPSAvXihmYS0oc2hhcnB8c29saWR8cmVndWxhcnxsaWdodHxicmFuZHN8ZHVvdG9uZXx0aGluKXxbbGZdYVtzcmxiZGtdPykgL1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVDb21wb25lbnQoe1xuICBuYW1lOiAnUUljb24nLFxuXG4gIHByb3BzOiB7XG4gICAgLi4udXNlU2l6ZVByb3BzLFxuXG4gICAgdGFnOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBkZWZhdWx0OiAnaSdcbiAgICB9LFxuXG4gICAgbmFtZTogU3RyaW5nLFxuICAgIGNvbG9yOiBTdHJpbmcsXG4gICAgbGVmdDogQm9vbGVhbixcbiAgICByaWdodDogQm9vbGVhblxuICB9LFxuXG4gIHNldHVwIChwcm9wcywgeyBzbG90cyB9KSB7XG4gICAgY29uc3QgeyBwcm94eTogeyAkcSB9IH0gPSBnZXRDdXJyZW50SW5zdGFuY2UoKVxuICAgIGNvbnN0IHNpemVTdHlsZSA9IHVzZVNpemUocHJvcHMpXG5cbiAgICBjb25zdCBjbGFzc2VzID0gY29tcHV0ZWQoKCkgPT5cbiAgICAgICdxLWljb24nXG4gICAgICArIChwcm9wcy5sZWZ0ID09PSB0cnVlID8gJyBvbi1sZWZ0JyA6ICcnKSAvLyBUT0RPIFF2MzogZHJvcCB0aGlzXG4gICAgICArIChwcm9wcy5yaWdodCA9PT0gdHJ1ZSA/ICcgb24tcmlnaHQnIDogJycpXG4gICAgICArIChwcm9wcy5jb2xvciAhPT0gdm9pZCAwID8gYCB0ZXh0LSR7IHByb3BzLmNvbG9yIH1gIDogJycpXG4gICAgKVxuXG4gICAgY29uc3QgdHlwZSA9IGNvbXB1dGVkKCgpID0+IHtcbiAgICAgIGxldCBjbHNcbiAgICAgIGxldCBpY29uID0gcHJvcHMubmFtZVxuXG4gICAgICBpZiAoaWNvbiA9PT0gJ25vbmUnIHx8ICFpY29uKSB7XG4gICAgICAgIHJldHVybiB7IG5vbmU6IHRydWUgfVxuICAgICAgfVxuXG4gICAgICBpZiAoJHEuaWNvbk1hcEZuICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9ICRxLmljb25NYXBGbihpY29uKVxuICAgICAgICBpZiAocmVzICE9PSB2b2lkIDApIHtcbiAgICAgICAgICBpZiAocmVzLmljb24gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgaWNvbiA9IHJlcy5pY29uXG4gICAgICAgICAgICBpZiAoaWNvbiA9PT0gJ25vbmUnIHx8ICFpY29uKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IG5vbmU6IHRydWUgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGNsczogcmVzLmNscyxcbiAgICAgICAgICAgICAgY29udGVudDogcmVzLmNvbnRlbnQgIT09IHZvaWQgMFxuICAgICAgICAgICAgICAgID8gcmVzLmNvbnRlbnRcbiAgICAgICAgICAgICAgICA6ICcgJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobVJFLnRlc3QoaWNvbikgPT09IHRydWUpIHtcbiAgICAgICAgY29uc3QgWyBkZWYsIHZpZXdCb3ggPSBkZWZhdWx0Vmlld0JveCBdID0gaWNvbi5zcGxpdCgnfCcpXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdmc6IHRydWUsXG4gICAgICAgICAgdmlld0JveCxcbiAgICAgICAgICBub2RlczogZGVmLnNwbGl0KCcmJicpLm1hcChwYXRoID0+IHtcbiAgICAgICAgICAgIGNvbnN0IFsgZCwgc3R5bGUsIHRyYW5zZm9ybSBdID0gcGF0aC5zcGxpdCgnQEAnKVxuICAgICAgICAgICAgcmV0dXJuIGgoJ3BhdGgnLCB7IHN0eWxlLCBkLCB0cmFuc2Zvcm0gfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChpbWdSRS50ZXN0KGljb24pID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaW1nOiB0cnVlLFxuICAgICAgICAgIHNyYzogaWNvbi5zdWJzdHJpbmcoNClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc3ZnVXNlUkUudGVzdChpY29uKSA9PT0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBbIGRlZiwgdmlld0JveCA9IGRlZmF1bHRWaWV3Qm94IF0gPSBpY29uLnNwbGl0KCd8JylcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN2Z3VzZTogdHJ1ZSxcbiAgICAgICAgICBzcmM6IGRlZi5zdWJzdHJpbmcoNyksXG4gICAgICAgICAgdmlld0JveFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBjb250ZW50ID0gJyAnXG4gICAgICBjb25zdCBtYXRjaGVzID0gaWNvbi5tYXRjaChsaWJSRSlcblxuICAgICAgaWYgKG1hdGNoZXMgIT09IG51bGwpIHtcbiAgICAgICAgY2xzID0gbGliTWFwWyBtYXRjaGVzWyAxIF0gXShpY29uKVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAoZmFSRS50ZXN0KGljb24pID09PSB0cnVlKSB7XG4gICAgICAgIGNscyA9IGljb25cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGlvblJFLnRlc3QoaWNvbikgPT09IHRydWUpIHtcbiAgICAgICAgY2xzID0gYGlvbmljb25zIGlvbi0keyAkcS5wbGF0Zm9ybS5pcy5pb3MgPT09IHRydWUgPyAnaW9zJyA6ICdtZCcgfSR7IGljb24uc3Vic3RyaW5nKDMpIH1gXG4gICAgICB9XG4gICAgICBlbHNlIGlmIChzeW1SRS50ZXN0KGljb24pID09PSB0cnVlKSB7XG4gICAgICAgIC8vIFwibm90cmFuc2xhdGVcIiBjbGFzcyBpcyBmb3IgR29vZ2xlIFRyYW5zbGF0ZVxuICAgICAgICAvLyB0byBhdm9pZCB0YW1wZXJpbmcgd2l0aCBNYXRlcmlhbCBTeW1ib2xzIGxpZ2F0dXJlIGZvbnRcbiAgICAgICAgLy9cbiAgICAgICAgLy8gQ2F1dGlvbjogVG8gYmUgYWJsZSB0byBhZGQgc3VmZml4IHRvIHRoZSBjbGFzcyBuYW1lLFxuICAgICAgICAvLyBrZWVwIHRoZSAnbWF0ZXJpYWwtc3ltYm9scycgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLlxuICAgICAgICBjbHMgPSAnbm90cmFuc2xhdGUgbWF0ZXJpYWwtc3ltYm9scydcblxuICAgICAgICBjb25zdCBtYXRjaGVzID0gaWNvbi5tYXRjaChzeW1SRSlcbiAgICAgICAgaWYgKG1hdGNoZXMgIT09IG51bGwpIHtcbiAgICAgICAgICBpY29uID0gaWNvbi5zdWJzdHJpbmcoNilcbiAgICAgICAgICBjbHMgKz0gc3ltTWFwWyBtYXRjaGVzWyAxIF0gXVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGVudCA9IGljb25cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAvLyBcIm5vdHJhbnNsYXRlXCIgY2xhc3MgaXMgZm9yIEdvb2dsZSBUcmFuc2xhdGVcbiAgICAgICAgLy8gdG8gYXZvaWQgdGFtcGVyaW5nIHdpdGggTWF0ZXJpYWwgSWNvbnMgbGlnYXR1cmUgZm9udFxuICAgICAgICAvL1xuICAgICAgICAvLyBDYXV0aW9uOiBUbyBiZSBhYmxlIHRvIGFkZCBzdWZmaXggdG8gdGhlIGNsYXNzIG5hbWUsXG4gICAgICAgIC8vIGtlZXAgdGhlICdtYXRlcmlhbC1pY29ucycgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLlxuICAgICAgICBjbHMgPSAnbm90cmFuc2xhdGUgbWF0ZXJpYWwtaWNvbnMnXG5cbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IGljb24ubWF0Y2gobWF0UkUpXG4gICAgICAgIGlmIChtYXRjaGVzICE9PSBudWxsKSB7XG4gICAgICAgICAgaWNvbiA9IGljb24uc3Vic3RyaW5nKDIpXG4gICAgICAgICAgY2xzICs9IG1hdE1hcFsgbWF0Y2hlc1sgMSBdIF1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRlbnQgPSBpY29uXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNscyxcbiAgICAgICAgY29udGVudFxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgY2xhc3M6IGNsYXNzZXMudmFsdWUsXG4gICAgICAgIHN0eWxlOiBzaXplU3R5bGUudmFsdWUsXG4gICAgICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJyxcbiAgICAgICAgcm9sZTogJ3ByZXNlbnRhdGlvbidcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGUudmFsdWUubm9uZSA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gaChwcm9wcy50YWcsIGRhdGEsIGhTbG90KHNsb3RzLmRlZmF1bHQpKVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZS52YWx1ZS5pbWcgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIGgocHJvcHMudGFnLCBkYXRhLCBoTWVyZ2VTbG90KHNsb3RzLmRlZmF1bHQsIFtcbiAgICAgICAgICBoKCdpbWcnLCB7IHNyYzogdHlwZS52YWx1ZS5zcmMgfSlcbiAgICAgICAgXSkpXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlLnZhbHVlLnN2ZyA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gaChwcm9wcy50YWcsIGRhdGEsIGhNZXJnZVNsb3Qoc2xvdHMuZGVmYXVsdCwgW1xuICAgICAgICAgIGgoJ3N2ZycsIHtcbiAgICAgICAgICAgIHZpZXdCb3g6IHR5cGUudmFsdWUudmlld0JveCB8fCAnMCAwIDI0IDI0J1xuICAgICAgICAgIH0sIHR5cGUudmFsdWUubm9kZXMpXG4gICAgICAgIF0pKVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZS52YWx1ZS5zdmd1c2UgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIGgocHJvcHMudGFnLCBkYXRhLCBoTWVyZ2VTbG90KHNsb3RzLmRlZmF1bHQsIFtcbiAgICAgICAgICBoKCdzdmcnLCB7XG4gICAgICAgICAgICB2aWV3Qm94OiB0eXBlLnZhbHVlLnZpZXdCb3hcbiAgICAgICAgICB9LCBbXG4gICAgICAgICAgICBoKCd1c2UnLCB7ICd4bGluazpocmVmJzogdHlwZS52YWx1ZS5zcmMgfSlcbiAgICAgICAgICBdKVxuICAgICAgICBdKSlcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGUudmFsdWUuY2xzICE9PSB2b2lkIDApIHtcbiAgICAgICAgZGF0YS5jbGFzcyArPSAnICcgKyB0eXBlLnZhbHVlLmNsc1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaChwcm9wcy50YWcsIGRhdGEsIGhNZXJnZVNsb3Qoc2xvdHMuZGVmYXVsdCwgW1xuICAgICAgICB0eXBlLnZhbHVlLmNvbnRlbnRcbiAgICAgIF0pKVxuICAgIH1cbiAgfVxufSlcbiIsIi8vIGNvcGllZCB0byBkb2NzIHRvb1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcmVudFByb3h5IChwcm94eSkge1xuICBpZiAoT2JqZWN0KHByb3h5LiRwYXJlbnQpID09PSBwcm94eS4kcGFyZW50KSB7XG4gICAgcmV0dXJuIHByb3h5LiRwYXJlbnRcbiAgfVxuXG4gIGxldCB7IHBhcmVudCB9ID0gcHJveHkuJFxuXG4gIHdoaWxlIChPYmplY3QocGFyZW50KSA9PT0gcGFyZW50KSB7XG4gICAgaWYgKE9iamVjdChwYXJlbnQucHJveHkpID09PSBwYXJlbnQucHJveHkpIHtcbiAgICAgIHJldHVybiBwYXJlbnQucHJveHlcbiAgICB9XG5cbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50XG4gIH1cbn1cblxuZnVuY3Rpb24gZmlsbE5vcm1hbGl6ZWRWTm9kZXMgKGNoaWxkcmVuLCB2bm9kZSkge1xuICBpZiAodHlwZW9mIHZub2RlLnR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodm5vZGUuY2hpbGRyZW4pID09PSB0cnVlKSB7XG4gICAgICB2bm9kZS5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgZmlsbE5vcm1hbGl6ZWRWTm9kZXMoY2hpbGRyZW4sIGNoaWxkKVxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgY2hpbGRyZW4uYWRkKHZub2RlKVxuICB9XG59XG5cbi8vIHZub2RlcyBmcm9tIHJlbmRlcmVkIGluIGFkdmFuY2VkIHNsb3RzXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9ybWFsaXplZFZOb2RlcyAodm5vZGVzKSB7XG4gIGNvbnN0IGNoaWxkcmVuID0gbmV3IFNldCgpXG5cbiAgdm5vZGVzLmZvckVhY2godm5vZGUgPT4ge1xuICAgIGZpbGxOb3JtYWxpemVkVk5vZGVzKGNoaWxkcmVuLCB2bm9kZSlcbiAgfSlcblxuICByZXR1cm4gQXJyYXkuZnJvbShjaGlsZHJlbilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZtSGFzUm91dGVyICh2bSkge1xuICByZXR1cm4gdm0uYXBwQ29udGV4dC5jb25maWcuZ2xvYmFsUHJvcGVydGllcy4kcm91dGVyICE9PSB2b2lkIDBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZtSXNEZXN0cm95ZWQgKHZtKSB7XG4gIHJldHVybiB2bS5pc1VubW91bnRlZCA9PT0gdHJ1ZSB8fCB2bS5pc0RlYWN0aXZhdGVkID09PSB0cnVlXG59XG4iLCIvKlxuICogSW5zcGlyZWQgYnkgUm91dGVyTGluayBmcm9tIFZ1ZSBSb3V0ZXJcbiAqICAtLT4gQVBJIHNob3VsZCBtYXRjaCFcbiAqL1xuXG5pbXBvcnQgeyBjb21wdXRlZCwgZ2V0Q3VycmVudEluc3RhbmNlIH0gZnJvbSAndnVlJ1xuXG5pbXBvcnQgeyB2bUhhc1JvdXRlciB9IGZyb20gJy4uLy4uL3V0aWxzL3ByaXZhdGUudm0vdm0uanMnXG5cbi8vIEdldCB0aGUgb3JpZ2luYWwgcGF0aCB2YWx1ZSBvZiBhIHJlY29yZCBieSBmb2xsb3dpbmcgaXRzIGFsaWFzT2ZcbmZ1bmN0aW9uIGdldE9yaWdpbmFsUGF0aCAocmVjb3JkKSB7XG4gIHJldHVybiByZWNvcmRcbiAgICA/IChcbiAgICAgICAgcmVjb3JkLmFsaWFzT2ZcbiAgICAgICAgICA/IHJlY29yZC5hbGlhc09mLnBhdGhcbiAgICAgICAgICA6IHJlY29yZC5wYXRoXG4gICAgICApIDogJydcbn1cblxuZnVuY3Rpb24gaXNTYW1lUm91dGVSZWNvcmQgKGEsIGIpIHtcbiAgLy8gc2luY2UgdGhlIG9yaWdpbmFsIHJlY29yZCBoYXMgYW4gdW5kZWZpbmVkIHZhbHVlIGZvciBhbGlhc09mXG4gIC8vIGJ1dCBhbGwgYWxpYXNlcyBwb2ludCB0byB0aGUgb3JpZ2luYWwgcmVjb3JkLCB0aGlzIHdpbGwgYWx3YXlzIGNvbXBhcmVcbiAgLy8gdGhlIG9yaWdpbmFsIHJlY29yZFxuICByZXR1cm4gKGEuYWxpYXNPZiB8fCBhKSA9PT0gKGIuYWxpYXNPZiB8fCBiKVxufVxuXG5mdW5jdGlvbiBpbmNsdWRlc1BhcmFtcyAob3V0ZXIsIGlubmVyKSB7XG4gIGZvciAoY29uc3Qga2V5IGluIGlubmVyKSB7XG4gICAgY29uc3RcbiAgICAgIGlubmVyVmFsdWUgPSBpbm5lclsga2V5IF0sXG4gICAgICBvdXRlclZhbHVlID0gb3V0ZXJbIGtleSBdXG5cbiAgICBpZiAodHlwZW9mIGlubmVyVmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoaW5uZXJWYWx1ZSAhPT0gb3V0ZXJWYWx1ZSkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoXG4gICAgICBBcnJheS5pc0FycmF5KG91dGVyVmFsdWUpID09PSBmYWxzZVxuICAgICAgfHwgb3V0ZXJWYWx1ZS5sZW5ndGggIT09IGlubmVyVmFsdWUubGVuZ3RoXG4gICAgICB8fCBpbm5lclZhbHVlLnNvbWUoKHZhbHVlLCBpKSA9PiB2YWx1ZSAhPT0gb3V0ZXJWYWx1ZVsgaSBdKVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gaXNFcXVpdmFsZW50QXJyYXkgKGEsIGIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYikgPT09IHRydWVcbiAgICA/IGEubGVuZ3RoID09PSBiLmxlbmd0aCAmJiBhLmV2ZXJ5KCh2YWx1ZSwgaSkgPT4gdmFsdWUgPT09IGJbIGkgXSlcbiAgICA6IGEubGVuZ3RoID09PSAxICYmIGFbIDAgXSA9PT0gYlxufVxuXG5mdW5jdGlvbiBpc1NhbWVSb3V0ZUxvY2F0aW9uUGFyYW1zVmFsdWUgKGEsIGIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYSkgPT09IHRydWVcbiAgICA/IGlzRXF1aXZhbGVudEFycmF5KGEsIGIpXG4gICAgOiAoXG4gICAgICAgIEFycmF5LmlzQXJyYXkoYikgPT09IHRydWVcbiAgICAgICAgICA/IGlzRXF1aXZhbGVudEFycmF5KGIsIGEpXG4gICAgICAgICAgOiBhID09PSBiXG4gICAgICApXG59XG5cbmZ1bmN0aW9uIGlzU2FtZVJvdXRlTG9jYXRpb25QYXJhbXMgKGEsIGIpIHtcbiAgaWYgKE9iamVjdC5rZXlzKGEpLmxlbmd0aCAhPT0gT2JqZWN0LmtleXMoYikubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBmb3IgKGNvbnN0IGtleSBpbiBhKSB7XG4gICAgaWYgKGlzU2FtZVJvdXRlTG9jYXRpb25QYXJhbXNWYWx1ZShhWyBrZXkgXSwgYlsga2V5IF0pID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWVcbn1cblxuZXhwb3J0IGNvbnN0IHVzZVJvdXRlckxpbmtQcm9wcyA9IHtcbiAgLy8gcm91dGVyLWxpbmtcbiAgdG86IFsgU3RyaW5nLCBPYmplY3QgXSxcbiAgcmVwbGFjZTogQm9vbGVhbixcbiAgZXhhY3Q6IEJvb2xlYW4sXG4gIGFjdGl2ZUNsYXNzOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlZmF1bHQ6ICdxLXJvdXRlci1saW5rLS1hY3RpdmUnXG4gIH0sXG4gIGV4YWN0QWN0aXZlQ2xhc3M6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVmYXVsdDogJ3Etcm91dGVyLWxpbmstLWV4YWN0LWFjdGl2ZSdcbiAgfSxcblxuICAvLyByZWd1bGFyIDxhPiBsaW5rXG4gIGhyZWY6IFN0cmluZyxcbiAgdGFyZ2V0OiBTdHJpbmcsXG5cbiAgLy8gc3RhdGVcbiAgZGlzYWJsZTogQm9vbGVhblxufVxuXG4vLyBleHRlcm5hbCBwcm9wczogdHlwZSwgdGFnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh7IGZhbGxiYWNrVGFnLCB1c2VEaXNhYmxlRm9yUm91dGVyTGlua1Byb3BzID0gdHJ1ZSB9ID0ge30pIHtcbiAgY29uc3Qgdm0gPSBnZXRDdXJyZW50SW5zdGFuY2UoKVxuICBjb25zdCB7IHByb3BzLCBwcm94eSwgZW1pdCB9ID0gdm1cblxuICBjb25zdCBoYXNSb3V0ZXIgPSB2bUhhc1JvdXRlcih2bSlcbiAgY29uc3QgaGFzSHJlZkxpbmsgPSBjb21wdXRlZCgoKSA9PiBwcm9wcy5kaXNhYmxlICE9PSB0cnVlICYmIHByb3BzLmhyZWYgIT09IHZvaWQgMClcblxuICAvLyBmb3IgcGVyZiByZWFzb25zLCB3ZSB1c2UgbWluaW11bSBhbW91bnQgb2YgcnVudGltZSB3b3JrXG4gIGNvbnN0IGhhc1JvdXRlckxpbmtQcm9wcyA9IHVzZURpc2FibGVGb3JSb3V0ZXJMaW5rUHJvcHMgPT09IHRydWVcbiAgICA/IGNvbXB1dGVkKCgpID0+XG4gICAgICBoYXNSb3V0ZXIgPT09IHRydWVcbiAgICAgICYmIHByb3BzLmRpc2FibGUgIT09IHRydWVcbiAgICAgICYmIGhhc0hyZWZMaW5rLnZhbHVlICE9PSB0cnVlXG4gICAgICAmJiBwcm9wcy50byAhPT0gdm9pZCAwICYmIHByb3BzLnRvICE9PSBudWxsICYmIHByb3BzLnRvICE9PSAnJ1xuICAgIClcbiAgICA6IGNvbXB1dGVkKCgpID0+XG4gICAgICBoYXNSb3V0ZXIgPT09IHRydWVcbiAgICAgICYmIGhhc0hyZWZMaW5rLnZhbHVlICE9PSB0cnVlXG4gICAgICAmJiBwcm9wcy50byAhPT0gdm9pZCAwICYmIHByb3BzLnRvICE9PSBudWxsICYmIHByb3BzLnRvICE9PSAnJ1xuICAgIClcblxuICBjb25zdCByZXNvbHZlZExpbmsgPSBjb21wdXRlZCgoKSA9PiAoXG4gICAgaGFzUm91dGVyTGlua1Byb3BzLnZhbHVlID09PSB0cnVlXG4gICAgICA/IGdldExpbmsocHJvcHMudG8pXG4gICAgICA6IG51bGxcbiAgKSlcblxuICBjb25zdCBoYXNSb3V0ZXJMaW5rID0gY29tcHV0ZWQoKCkgPT4gcmVzb2x2ZWRMaW5rLnZhbHVlICE9PSBudWxsKVxuICBjb25zdCBoYXNMaW5rID0gY29tcHV0ZWQoKCkgPT4gaGFzSHJlZkxpbmsudmFsdWUgPT09IHRydWUgfHwgaGFzUm91dGVyTGluay52YWx1ZSA9PT0gdHJ1ZSlcblxuICBjb25zdCBsaW5rVGFnID0gY29tcHV0ZWQoKCkgPT4gKFxuICAgIHByb3BzLnR5cGUgPT09ICdhJyB8fCBoYXNMaW5rLnZhbHVlID09PSB0cnVlXG4gICAgICA/ICdhJ1xuICAgICAgOiAocHJvcHMudGFnIHx8IGZhbGxiYWNrVGFnIHx8ICdkaXYnKVxuICApKVxuXG4gIGNvbnN0IGxpbmtBdHRycyA9IGNvbXB1dGVkKCgpID0+IChcbiAgICBoYXNIcmVmTGluay52YWx1ZSA9PT0gdHJ1ZVxuICAgICAgPyB7XG4gICAgICAgICAgaHJlZjogcHJvcHMuaHJlZixcbiAgICAgICAgICB0YXJnZXQ6IHByb3BzLnRhcmdldFxuICAgICAgICB9XG4gICAgICA6IChcbiAgICAgICAgICBoYXNSb3V0ZXJMaW5rLnZhbHVlID09PSB0cnVlXG4gICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICBocmVmOiByZXNvbHZlZExpbmsudmFsdWUuaHJlZixcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHByb3BzLnRhcmdldFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA6IHt9XG4gICAgICAgIClcbiAgKSlcblxuICBjb25zdCBsaW5rQWN0aXZlSW5kZXggPSBjb21wdXRlZCgoKSA9PiB7XG4gICAgaWYgKGhhc1JvdXRlckxpbmsudmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG5cbiAgICBjb25zdFxuICAgICAgeyBtYXRjaGVkIH0gPSByZXNvbHZlZExpbmsudmFsdWUsXG4gICAgICB7IGxlbmd0aCB9ID0gbWF0Y2hlZCxcbiAgICAgIHJvdXRlTWF0Y2hlZCA9IG1hdGNoZWRbIGxlbmd0aCAtIDEgXVxuXG4gICAgaWYgKHJvdXRlTWF0Y2hlZCA9PT0gdm9pZCAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG5cbiAgICBjb25zdCBjdXJyZW50TWF0Y2hlZCA9IHByb3h5LiRyb3V0ZS5tYXRjaGVkXG5cbiAgICBpZiAoY3VycmVudE1hdGNoZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IGN1cnJlbnRNYXRjaGVkLmZpbmRJbmRleChcbiAgICAgIGlzU2FtZVJvdXRlUmVjb3JkLmJpbmQobnVsbCwgcm91dGVNYXRjaGVkKVxuICAgIClcblxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHJldHVybiBpbmRleFxuICAgIH1cblxuICAgIC8vIHBvc3NpYmxlIHBhcmVudCByZWNvcmRcbiAgICBjb25zdCBwYXJlbnRSZWNvcmRQYXRoID0gZ2V0T3JpZ2luYWxQYXRoKG1hdGNoZWRbIGxlbmd0aCAtIDIgXSlcblxuICAgIHJldHVybiAoXG4gICAgICAvLyB3ZSBhcmUgZGVhbGluZyB3aXRoIG5lc3RlZCByb3V0ZXNcbiAgICAgIGxlbmd0aCA+IDFcbiAgICAgIC8vIGlmIHRoZSBwYXJlbnQgYW5kIG1hdGNoZWQgcm91dGUgaGF2ZSB0aGUgc2FtZSBwYXRoLCB0aGlzIGxpbmsgaXNcbiAgICAgIC8vIHJlZmVycmluZyB0byB0aGUgZW1wdHkgY2hpbGQuIE9yIHdlIGN1cnJlbnRseSBhcmUgb24gYSBkaWZmZXJlbnRcbiAgICAgIC8vIGNoaWxkIG9mIHRoZSBzYW1lIHBhcmVudFxuICAgICAgJiYgZ2V0T3JpZ2luYWxQYXRoKHJvdXRlTWF0Y2hlZCkgPT09IHBhcmVudFJlY29yZFBhdGhcbiAgICAgIC8vIGF2b2lkIGNvbXBhcmluZyB0aGUgY2hpbGQgd2l0aCBpdHMgcGFyZW50XG4gICAgICAmJiBjdXJyZW50TWF0Y2hlZFsgY3VycmVudE1hdGNoZWQubGVuZ3RoIC0gMSBdLnBhdGggIT09IHBhcmVudFJlY29yZFBhdGhcbiAgICAgICAgPyBjdXJyZW50TWF0Y2hlZC5maW5kSW5kZXgoXG4gICAgICAgICAgaXNTYW1lUm91dGVSZWNvcmQuYmluZChudWxsLCBtYXRjaGVkWyBsZW5ndGggLSAyIF0pXG4gICAgICAgIClcbiAgICAgICAgOiBpbmRleFxuICAgIClcbiAgfSlcblxuICBjb25zdCBsaW5rSXNBY3RpdmUgPSBjb21wdXRlZCgoKSA9PlxuICAgIGhhc1JvdXRlckxpbmsudmFsdWUgPT09IHRydWVcbiAgICAmJiBsaW5rQWN0aXZlSW5kZXgudmFsdWUgIT09IC0xXG4gICAgJiYgaW5jbHVkZXNQYXJhbXMocHJveHkuJHJvdXRlLnBhcmFtcywgcmVzb2x2ZWRMaW5rLnZhbHVlLnBhcmFtcylcbiAgKVxuXG4gIGNvbnN0IGxpbmtJc0V4YWN0QWN0aXZlID0gY29tcHV0ZWQoKCkgPT5cbiAgICBsaW5rSXNBY3RpdmUudmFsdWUgPT09IHRydWVcbiAgICAgICYmIGxpbmtBY3RpdmVJbmRleC52YWx1ZSA9PT0gcHJveHkuJHJvdXRlLm1hdGNoZWQubGVuZ3RoIC0gMVxuICAgICAgJiYgaXNTYW1lUm91dGVMb2NhdGlvblBhcmFtcyhwcm94eS4kcm91dGUucGFyYW1zLCByZXNvbHZlZExpbmsudmFsdWUucGFyYW1zKVxuICApXG5cbiAgY29uc3QgbGlua0NsYXNzID0gY29tcHV0ZWQoKCkgPT4gKFxuICAgIGhhc1JvdXRlckxpbmsudmFsdWUgPT09IHRydWVcbiAgICAgID8gKFxuICAgICAgICAgIGxpbmtJc0V4YWN0QWN0aXZlLnZhbHVlID09PSB0cnVlXG4gICAgICAgICAgICA/IGAgJHsgcHJvcHMuZXhhY3RBY3RpdmVDbGFzcyB9ICR7IHByb3BzLmFjdGl2ZUNsYXNzIH1gXG4gICAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgICBwcm9wcy5leGFjdCA9PT0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgPyAnJ1xuICAgICAgICAgICAgICAgICAgOiAobGlua0lzQWN0aXZlLnZhbHVlID09PSB0cnVlID8gYCAkeyBwcm9wcy5hY3RpdmVDbGFzcyB9YCA6ICcnKVxuICAgICAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIDogJydcbiAgKSlcblxuICBmdW5jdGlvbiBnZXRMaW5rICh0bykge1xuICAgIHRyeSB7IHJldHVybiBwcm94eS4kcm91dGVyLnJlc29sdmUodG8pIH1cbiAgICBjYXRjaCAoXykge31cblxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgUHJvbWlzZTxSb3V0ZXJFcnJvciB8IGZhbHNlIHwgdW5kZWZpbmVkPlxuICAgKi9cbiAgZnVuY3Rpb24gbmF2aWdhdGVUb1JvdXRlckxpbmsgKFxuICAgIGUsXG4gICAgeyByZXR1cm5Sb3V0ZXJFcnJvciwgdG8gPSBwcm9wcy50bywgcmVwbGFjZSA9IHByb3BzLnJlcGxhY2UgfSA9IHt9XG4gICkge1xuICAgIGlmIChwcm9wcy5kaXNhYmxlID09PSB0cnVlKSB7XG4gICAgICAvLyBlbnN1cmUgbmF0aXZlIG5hdmlnYXRpb24gaXMgcHJldmVudGVkIGluIGFsbCBjYXNlcyxcbiAgICAgIC8vIGxpa2Ugd2hlbiB1c2VEaXNhYmxlRm9yUm91dGVyTGlua1Byb3BzID09PSBmYWxzZSAoUVJvdXRlVGFiKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZhbHNlKVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIC8vIGRvbid0IHJlZGlyZWN0IHdpdGggY29udHJvbCBrZXlzO1xuICAgICAgLy8gc2hvdWxkIG1hdGNoIFJvdXRlckxpbmsgZnJvbSBWdWUgUm91dGVyXG4gICAgICBlLm1ldGFLZXkgfHwgZS5hbHRLZXkgfHwgZS5jdHJsS2V5IHx8IGUuc2hpZnRLZXlcblxuICAgICAgLy8gZG9uJ3QgcmVkaXJlY3Qgb24gcmlnaHQgY2xpY2tcbiAgICAgIHx8IChlLmJ1dHRvbiAhPT0gdm9pZCAwICYmIGUuYnV0dG9uICE9PSAwKVxuXG4gICAgICAvLyBkb24ndCByZWRpcmVjdCBpZiBpdCBzaG91bGQgb3BlbiBpbiBhIG5ldyB3aW5kb3dcbiAgICAgIHx8IHByb3BzLnRhcmdldCA9PT0gJ19ibGFuaydcbiAgICApIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpXG4gICAgfVxuXG4gICAgLy8gaGluZGVyIHRoZSBuYXRpdmUgbmF2aWdhdGlvblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgLy8gdGhlbigpIGNhbiBhbHNvIHJldHVybiBhIFwic29mdFwiIHJvdXRlciBlcnJvciAoVnVlIFJvdXRlciBiZWhhdmlvcilcbiAgICBjb25zdCBwcm9taXNlID0gcHJveHkuJHJvdXRlclsgcmVwbGFjZSA9PT0gdHJ1ZSA/ICdyZXBsYWNlJyA6ICdwdXNoJyBdKHRvKVxuXG4gICAgcmV0dXJuIHJldHVyblJvdXRlckVycm9yID09PSB0cnVlXG4gICAgICA/IHByb21pc2VcbiAgICAgIC8vIGVsc2UgY2F0Y2hpbmcgaGFyZCBlcnJvcnMgYW5kIGFsc28gXCJzb2Z0XCIgb25lcyAtIHRoZW4oZXJyID0+IC4uLilcbiAgICAgIDogcHJvbWlzZS50aGVuKCgpID0+IHt9KS5jYXRjaCgoKSA9PiB7fSlcbiAgfVxuXG4gIC8vIHdhcm5pbmchIGVuc3VyZSB0aGF0IHRoZSBjb21wb25lbnQgdXNpbmcgaXQgaGFzICdjbGljaycgaW5jbHVkZWQgaW4gaXRzICdlbWl0cycgZGVmaW5pdGlvbiBwcm9wXG4gIGZ1bmN0aW9uIG5hdmlnYXRlT25DbGljayAoZSkge1xuICAgIGlmIChoYXNSb3V0ZXJMaW5rLnZhbHVlID09PSB0cnVlKSB7XG4gICAgICBjb25zdCBnbyA9IG9wdHMgPT4gbmF2aWdhdGVUb1JvdXRlckxpbmsoZSwgb3B0cylcblxuICAgICAgZW1pdCgnY2xpY2snLCBlLCBnbylcbiAgICAgIGUuZGVmYXVsdFByZXZlbnRlZCAhPT0gdHJ1ZSAmJiBnbygpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZW1pdCgnY2xpY2snLCBlKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaGFzUm91dGVyTGluayxcbiAgICBoYXNIcmVmTGluayxcbiAgICBoYXNMaW5rLFxuXG4gICAgbGlua1RhZyxcbiAgICByZXNvbHZlZExpbmssXG4gICAgbGlua0lzQWN0aXZlLFxuICAgIGxpbmtJc0V4YWN0QWN0aXZlLFxuICAgIGxpbmtDbGFzcyxcbiAgICBsaW5rQXR0cnMsXG5cbiAgICBnZXRMaW5rLFxuICAgIG5hdmlnYXRlVG9Sb3V0ZXJMaW5rLFxuICAgIG5hdmlnYXRlT25DbGlja1xuICB9XG59XG4iXSwibmFtZXMiOlsiY3NzIiwibWF0Y2hlcyJdLCJtYXBwaW5ncyI6IjtBQUVPLFNBQVMsTUFBTyxNQUFNLFdBQVc7QUFDdEMsU0FBTyxTQUFTLFNBQ1osS0FBTSxLQUFJLFlBQ1Y7QUFDTjtBQUVPLFNBQVMsWUFBYSxNQUFNLFdBQVc7QUFDNUMsTUFBSSxTQUFTLFFBQVE7QUFDbkIsVUFBTSxRQUFRLEtBQU07QUFDcEIsUUFBSSxVQUFVLFVBQVUsVUFBVSxNQUFNO0FBQ3RDLGFBQU8sTUFBTSxNQUFPO0FBQUEsSUFDckI7QUFBQSxFQUNGO0FBRUQsU0FBTztBQUNUO0FBTU8sU0FBUyxXQUFZLE1BQU0sUUFBUTtBQUN4QyxTQUFPLFNBQVMsU0FDWixPQUFPLE9BQU8sTUFBTSxJQUNwQjtBQUNOO0FDRE8sU0FBUyxJQUFLLFNBQVNBLE1BQUs7QUFDakMsUUFBTSxRQUFRLFFBQVE7QUFFdEIsYUFBVyxRQUFRQSxNQUFLO0FBQ3RCLFVBQU8sUUFBU0EsS0FBSztBQUFBLEVBQ3RCO0FBQ0g7QUFtQk8sU0FBUyxXQUFZLElBQUk7QUFDOUIsTUFBSSxPQUFPLFVBQVUsT0FBTyxNQUFNO0FBQ2hDLFdBQU87QUFBQSxFQUNSO0FBRUQsTUFBSSxPQUFPLE9BQU8sVUFBVTtBQUMxQixRQUFJO0FBQ0YsYUFBTyxTQUFTLGNBQWMsRUFBRSxLQUFLO0FBQUEsSUFDdEMsU0FDTSxLQUFQO0FBQ0UsYUFBTztBQUFBLElBQ1I7QUFBQSxFQUNGO0FBRUQsUUFBTSxTQUFTLE1BQU0sRUFBRTtBQUN2QixNQUFJLFFBQVE7QUFDVixXQUFPLE9BQU8sT0FBTztBQUFBLEVBQ3RCO0FBQ0g7QUNuRVksTUFBQyxrQkFBa0I7QUFBQSxFQUM3QixJQUFJO0FBQUEsRUFDSixJQUFJO0FB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
