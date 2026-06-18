export const normalizeSearchQuery = (query: string) => query.trim().toLowerCase();

export const matchesSearchQuery = (
  query: string,
  ...fields: (string | number | undefined | null)[]
): boolean => {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return true;
  return fields.some((field) =>
    String(field ?? "")
      .toLowerCase()
      .includes(normalized),
  );
};
