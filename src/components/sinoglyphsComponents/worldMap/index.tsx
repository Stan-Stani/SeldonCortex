import { useCallback, useEffect, useRef, useState } from "react"

/** 80 wide by 26 tall */
const mockMap = `ABCDEFGHIJKLMNOP
12345678901234561234567890123456123456789012345612345678901234561234567890123456
口日月人大小山川
木火水田土石竹糸
................
::::::::::::::::


@







               A
ＢＣＤ

＠





X
`

const WIDTH = 26
const HEIGHT = 26

function generateBlankWorldMap(width = WIDTH, height = HEIGHT) {
  let blankWorldMap = ""

  let blankLine = ""
  for (let i = 1; i <= width; i++) {
    blankLine += "　"
  }

  for (let i = 1; i <= height; i++) {
    blankWorldMap += `${blankLine}\n`
  }

  return blankWorldMap
}

declare const GlyphBrand: unique symbol
/** One character string */
type Glyph = string & { readonly [GlyphBrand]: never }

function isGlyph(s: string): s is Glyph {
  if (s.length !== 1) {
    throw new Error("Glyph must be one character")
  }
  return true
}

function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(number, max))
}

function placeGlyph(
  { x, y }: { x: number; y: number },
  glyph: string,
  worldMap: string,
  doneByPlayer: boolean = false
) {
  if (!isGlyph(glyph)) {
    throw new Error("Glyph must be one character")
  }

  if (y < 1 || y > HEIGHT || x < 1 || x > WIDTH) {
    if (!doneByPlayer) {
      throw new Error("Attempted to place glyph outside map")
    }

    x = clamp(x, 1, WIDTH)
    y = clamp(y, 1, HEIGHT)
    console.log("clamp")
  }

  const rows = worldMap.split("\n")

  rows[y - 1] = rows[y - 1].slice(0, x - 1) + glyph + rows[y - 1].slice(x + 1)

  return rows.join("\n")
}

export default function WorldMap() {
  const worldMapDomRef = useRef<HTMLPreElement | null>(null)
  const [worldMap, setWorldMap] = useState(generateBlankWorldMap())
  const [playerPosition, setPlayerPosition] = useState({ x: 13, y: 13 })

  const handleKeyboard = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case "w":
        setPlayerPosition((prev) => ({
          ...prev,
          y: clamp(--prev.y, 1, HEIGHT),
        }))
        break
      case "a":
        setPlayerPosition((prev) => ({ ...prev, x: clamp(--prev.x, 1, WIDTH) }))
        break
      case "s":
        setPlayerPosition((prev) => ({
          ...prev,
          y: clamp(++prev.y, 1, HEIGHT),
        }))
        break
      case "d":
        setPlayerPosition((prev) => ({ ...prev, x: clamp(++prev.x, 1, WIDTH) }))
        break
    }
  }, [])

  useEffect(() => {
    if (worldMapDomRef.current) {
      worldMapDomRef.current.addEventListener("keydown", handleKeyboard)
    }

    const worldMapDomElement = worldMapDomRef.current

    return () =>
      worldMapDomElement?.removeEventListener("keydown", handleKeyboard)
  }, [handleKeyboard])

  return (
    <pre
      tabIndex={0}
      ref={worldMapDomRef}
      className='leading-none bg-arne16-nightblue w-fit'
    >
      {placeGlyph(playerPosition, "＠", generateBlankWorldMap(), true)}
    </pre>
  )
}
