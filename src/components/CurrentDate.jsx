export default function CurrentDate() {
  return new Date().toLocaleDateString("AR-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
