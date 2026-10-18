const CITY_ALIASES = {
  cairo: "Cairo",
  "القاهرة": "Cairo",
  "القاهره": "Cairo",
  alexandria: "Alexandria",
  "الإسكندرية": "Alexandria",
  "الاسكندرية": "Alexandria",
  "الاسكندريه": "Alexandria",
  giza: "Giza",
  "الجيزة": "Giza",
  "الجيزه": "Giza",
  luxor: "Luxor",
  "الأقصر": "Luxor",
  "الاقصر": "Luxor",
  aswan: "Aswan",
  "أسوان": "Aswan",
  "اسوان": "Aswan",
  hurghada: "Hurghada",
  "الغردقة": "Hurghada",
  "الغردقه": "Hurghada",
  sharmelsheikh: "Sharm el-Sheikh",
  "شرمالشيخ": "Sharm el-Sheikh",
  "شرم الشيخ": "Sharm el-Sheikh",
  london: "London",
  paris: "Paris",
  dubai: "Dubai",
  "دبي": "Dubai",
  riyadh: "Riyadh",
  "الرياض": "Riyadh",
};

export function normalizeCityName(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .toLowerCase()
    .replace(/[\s-]+/g, "")
    .trim();
}

function editDistance(left, right) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let row = 1; row <= left.length; row += 1) {
    let diagonal = previous[0];
    previous[0] = row;
    for (let column = 1; column <= right.length; column += 1) {
      const nextDiagonal = previous[column];
      previous[column] = Math.min(
        previous[column] + 1,
        previous[column - 1] + 1,
        diagonal + (left[row - 1] === right[column - 1] ? 0 : 1),
      );
      diagonal = nextDiagonal;
    }
  }

  return previous[right.length];
}

export function getCitySearchCandidates(query) {
  const input = query.trim().replace(/\s+/g, " ");
  const normalizedInput = normalizeCityName(input);
  const exactMatch = CITY_ALIASES[normalizedInput];

  if (exactMatch && exactMatch !== input) return [input, exactMatch];
  if (normalizedInput.length < 4) return [input];

  const closeMatch = Object.entries(CITY_ALIASES).find(
    ([alias]) =>
      Math.abs(alias.length - normalizedInput.length) <= 1 &&
      editDistance(alias, normalizedInput) <= 1,
  );

  return closeMatch ? [input, closeMatch[1]] : [input];
}
