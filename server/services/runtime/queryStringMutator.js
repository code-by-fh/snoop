import queryString from "query-string";

export default function urlModifier(_url, sortByDateParam, urlParamsToRemove) {
  if (_url == null) return _url;

  const original = queryString.parseUrl(_url);
  const query = { ...original.query };

  // Mutiere URL mit neuen Parametern
  if (sortByDateParam != null) {
    const mutate = queryString.parse(sortByDateParam);
    Object.assign(query, mutate);
  }

  // Entferne gezielt Parameter mit bestimmtem Wert
  if (urlParamsToRemove != null) {
    const toRemove = queryString.parse(urlParamsToRemove);
    for (const [key, value] of Object.entries(toRemove)) {
      if (query[key] === value) {
        delete query[key];
      }
    }
  }

  return `${original.url}?${queryString.stringify(query)}`;
}