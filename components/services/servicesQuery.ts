// Every filter on the Services page lives in the URL, so all components read
// from and write to the same query string instead of keeping React state.

export type ServiceQuery = {
  search: string;
  category: string;
  serviceMode: string;
  sort: string;
  page: number;
};

// Shared type for the "update the URL" function passed down to child components.
// Pass null as a value to remove that query parameter.
export type UpdateQuery = (
  changes: Record<string, string | null>,
  mode?: "push" | "replace"
) => void;

// Reads the current filters out of the URL query string.
export function parseServiceQuery(queryString: string): ServiceQuery {
  const params = new URLSearchParams(queryString);
  const page = Number(params.get("page") ?? "1");

  return {
    search: params.get("search") ?? "",
    category: params.get("category") ?? "",
    serviceMode: params.get("serviceMode") ?? "",
    sort: params.get("sort") ?? "newest",
    page: Number.isFinite(page) && page > 1 ? page : 1,
  };
}

// These are the default values, so they never need to be in the URL.
const DEFAULT_VALUES: Record<string, string> = {
  sort: "newest",
  page: "1",
};

// Builds the next /services URL from the current one.
// Values that are null (or empty) are removed, everything else is kept.
export function buildServicesUrl(
  queryString: string,
  changes: Record<string, string | null>
): string {
  const params = new URLSearchParams(queryString);

  Object.entries(changes).forEach(([key, value]) => {
    const isDefault = value !== null && value === DEFAULT_VALUES[key];

    if (value === null || value === "" || isDefault) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  const nextQuery = params.toString();
  return nextQuery ? `/services?${nextQuery}` : "/services";
}
