type TemplateValue<T> =
  | string
  | { [P in keyof T]: T[P] extends Function ? never : P }[keyof T] | ((val: T) => unknown);

function parse(val: any) {
  const variable = val?.toString();
  const isFunc = variable.indexOf("f") > -1;
  if (!variable) return "";
  const firstParanthesis = variable.indexOf("(") + 1;
  const secondParanthesis = variable.indexOf(")");
  const variableName = variable.substring(firstParanthesis, secondParanthesis) || variable[0];
  const regex = new RegExp(`${variableName}\\.`, "g");
  return variable
    .substring(
      isFunc ? variable.indexOf("return") + 7 : variable.indexOf("=>") + 3
    )
    .replace(regex, "");
}

export function html<TSource = any>(
  strings: TemplateStringsArray, // html text
  ...values: TemplateValue<TSource>[] // variables which they are functions.
) {
  let html = "";
  for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
    const currentString = strings[i];
    const value = values[i];
    html += currentString;
    if (typeof value === "function") {
      const parsed = parse(value);
      html += `${parsed}`;
      continue;
    }
    html += `${value}`;
  }

  html += strings[strings.length - 1];
  return html;
}
