export const LOGO_PATH =
  "M205.707 0c119.999 0 204.896 82.45 204.896 200-.001 116.733-84.897 200-204.896 200C84.893 400 0 316.733 0 200 0 82.45 84.893 0 205.707 0m0 94.699c-57.958 0-97.958 43.261-97.958 105.301 0 19.016 3.765 36.265 10.646 51.048-6.255 19.097-17.992 37.315-40.05 51.828 25.826 3.473 55.667 2.447 83.855-7.014 12.82 6.106 27.47 9.439 43.507 9.439 57.142 0 97.146-43.261 97.147-105.301 0-62.04-40.004-105.301-97.147-105.301";

export const CONTACTS = {
  sales: "sales@otech.one",
  partnerships: "partnerships@otech.one",
  press: "press@otech.one",
  whatsapp: "https://wa.me/393522394555?text=Ciao%20One%20Tech%2C%20vorrei%20maggiori%20informazioni.",
  address: "Via Gustavo Fara 35, 20124 Milano",
};

export type EngineId = "kore" | "argo" | "allmessage" | "milo";

/** Product names are brand names: never translated. Copy lives in the i18n dictionaries. */
export const ENGINES: { id: EngineId; name: string }[] = [
  { id: "kore", name: "KORE" },
  { id: "argo", name: "ARGO" },
  { id: "allmessage", name: "ALL MESSAGE" },
  { id: "milo", name: "MILO" },
];
