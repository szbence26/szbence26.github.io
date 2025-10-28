import colors from "./colors";

export default [
  {
    type: "text",
    text: "Dorka és Feli",
    class: "text-h2 q-my-xl",
    style: `color: ${colors.main1}`,
  },
  {
    type: "text",
    text: "2026. május 16.",
    class: "text-h4",
    style: `color: ${colors.main1}`,
  },
  {
    type: "text",
    text: "Helyszín: ...",
    class: "text-h4 q-mt-xl",
    style: `color: ${colors.main1}`,
  },
  {
    type: "text",
    text: "...",
    class: "text-h4",
    style: `color: ${colors.main1}`,
  },
  {
    type: "link",
    text: "Mutasd a térképen",
    class: "text-h4",
    style: `color: ${colors.main1}`,
    href: "https://www.google.com/maps/",
  },
  {
    type: "text",
    text: "Program",
    class: "text-h4 q-mt-xl",
    style: `color: ${colors.main1}`,
  },
  {
    type: "timeline",
    text: "Program",
    class: "text-h4",
    style: `width: auto`,
    entry: [
      {
        title: "Szállás elfoglalása",
        subtitle: "15:00",
        icon: "las la-bed",
      },
      {
        title: "Vendégvárás kezdete",
        subtitle: "16:30",
        icon: "las la-glass-cheers",
      },
      {
        title: "Polgári szertartás",
        subtitle: "17:30",
        icon: "las la-ring",
      },
      {
        title: "Fotózás",
        subtitle: "18:00",
        icon: "las la-camera",
      },
      {
        title: "Vacsora",
        subtitle: "19:00",
        icon: "las la-utensils",
      },
      {
        title: "Lagzi",
        subtitle: "20:30",
        icon: "las la-music",
      },
    ],
  },
  {
    type: "text",
    text: "Menü",
    class: "text-h4",
    style: `color: ${colors.main1}`,
  },
  {
    type: "list",
    text: "Menü",
    sections: [
      {
        header: "Előételek",
        items: ["Füstölt lazacrolád kapros túrókrémmel, friss zöldsaláta"],
      },
      {
        header: "Leves",
        items: ["Újházy tyúkhúsleves"],
      },
      {
        header: "Főételek",
        items: [
          "Rántott csirkecomb, petrezselymes burgonya, tartármártás",
          "Sertéspörkölt, galuska",
        ],
      },
      {
        header: "Desszertek",
        items: ["Somlói galuska", "Friss gyümölcssaláta habbal"],
      },
      {
        header: "Éjféli menü",
        items: ["Töltött káposzta"],
      },
    ],
  },
  {
    type: "text",
    text: "Hasznos információk",
    class: "text-h4 q-mt-xl",
    style: `color: ${colors.main1}`,
  },
  {
    type: "text",
    text: "Információk a szállásról",
    class: "q-mt-sm",
    style: `color: ${colors.main1}`,
  },
];
