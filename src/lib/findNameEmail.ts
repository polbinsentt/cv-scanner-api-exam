// scans the cvtext for email
export const findEmail = (text: string) => {
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const email = text.match(emailRegex);

  if (!email) {
    throw new Error(`Email not found in the text!`);
  }
  return email[0];
};

//scans the cvtext for name
export const findName = (text: string) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];

    if (/^([A-Z][a-z]+|[A-Z]+)(?: ([A-Z][a-z]+|[A-Z]+)){1,2}$/.test(line)) {
      return line;
    }
  }
  return null;
};
