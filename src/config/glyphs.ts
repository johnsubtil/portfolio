export const glyphGroups = [
  { weight: 3, glyphs: Array.from('πθλφΩμσΔ') },
  { weight: 3, glyphs: Array.from('∑∫√∂±≈≠≤≥×÷+−=%') },
  { weight: 2, glyphs: Array.from('∈∀∃∴∞') },
  { weight: 2, glyphs: [...Array.from('0123456789'), '42', '10', 'x²', 'e'] },
];

export const allGlyphs = glyphGroups.flatMap((group) => group.glyphs);
