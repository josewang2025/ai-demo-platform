import Papa from "papaparse";

const normalize = (s: string) =>
  s.trim().toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");

/**
 * Parse a CSV string with column validation and field mapping.
 *
 * @param csvText     Raw CSV content
 * @param columns     Expected column names (normalized for comparison)
 * @param templateHint  File name shown in error when columns are missing
 * @param mapRow      Transform a raw row into the target type
 */
export function parseCsv<T>(
  csvText: string,
  columns: string[],
  templateHint: string,
  mapRow: (get: (col: string) => string) => T
): T[] {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  if (result.errors.length > 0) {
    throw new Error(result.errors.map((e) => e.message).join("; "));
  }
  const rows = result.data;
  if (rows.length === 0) return [];

  const keys = Object.keys(rows[0]).map((k) => normalize(k));
  const expected = columns.map((c) => normalize(c));
  const missing = expected.filter((c) => !keys.includes(c));
  if (missing.length > 0) {
    throw new Error(`Missing columns: ${missing.join(", ")}. Use template: ${templateHint}`);
  }

  const get = (row: Record<string, string>, col: string) => {
    const key = Object.keys(row).find((k) => normalize(k) === normalize(col));
    return (key ? row[key] : "") ?? "";
  };

  return rows.map((row) => mapRow((col) => get(row, col)));
}
