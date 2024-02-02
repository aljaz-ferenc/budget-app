export function formatCurrency(number: number, currency: string ) {
  let locale: string;

  switch (currency.toLocaleLowerCase()) {
    case "eur":
      locale = "eu-EUR";
      break;
    case "usd":
      locale = "en-USD";
      break;
    default:
      locale = "eu-EUR";
  }

  const formatter = Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  });
  
  return formatter.format(number);
}

export function formatDate(date: Date) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();

  return `${day}. ${month + 1}. ${year}`;
}

export function formatCalendarDate(date: Date){
  const d = new Date(date)
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}