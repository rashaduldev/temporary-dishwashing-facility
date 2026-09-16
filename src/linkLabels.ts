export const capitalizeLinkLabel = (label: string) =>
  label.replace(/^\s*([a-z])/, (match, letter: string) =>
    match.replace(letter, letter.toUpperCase()),
  );
