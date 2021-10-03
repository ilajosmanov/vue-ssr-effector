import {format} from "prettier"

export function prettyHtml(content: string) {
  if (typeof content !== "string") return content
  try {
    let result = format(content, {parser: "html", printWidth: 60, semi: true})
      .replace(/"/g, "'")
      .trim()
    return `\n${result}\n`
  } catch {
    return content
  }
}
