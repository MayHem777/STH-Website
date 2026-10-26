// "1 bed · 1 bath" line for modular cards (Mitch 2026-10-17: every model shows its bedrooms and
// bathrooms under the name; the name itself never says "1 Bedroom" / "2 Bedroom").
type Specs = Record<string, string> | undefined;
const SPECIAL: Record<string, string> = {
  cabin: 'Studio · 1 bath',
  banksia: 'Studio · 1 bath',
  dahlia: 'Studio · 1 bath',
  raglan: 'Studio · 1 ensuite',
  office: 'Workspace · restroom',
  'banksia-office': 'Workspace · restroom',
  retreat: 'Wellness · shower & toilet',
};
export function roomsLine(id: string, specs: Specs): string | undefined {
  if (SPECIAL[id]) return SPECIAL[id];
  const bed = specs?.Bedrooms ?? specs?.Bedroom;
  const bath = specs?.Bathrooms;
  if (!bed && !bath) return undefined;
  const n = (v: string) => (v.match(/\d+/) ?? [''])[0];
  const parts: string[] = [];
  if (bed) parts.push(`${n(bed)} bed`);
  // A single ensuite reads "1 ensuite"; more than one bathroom is counted (Jacaranda: "2 (ensuite + bathroom)" = 2 bath)
  if (bath) parts.push(/ensuite/i.test(bath) && Number(n(bath)) <= 1 ? '1 ensuite' : `${n(bath)} bath`);
  return parts.join(' · ');
}
