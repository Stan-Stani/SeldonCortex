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

function throwIfNotInt(number: number, message = "Number must be an integer") {
  if (!Number.isInteger(number)) {
    throw new Error(message)
  }
}

class Coordinate {
  #x: number
  #y: number

  constructor(x: number, y: number) {
    throwIfNotInt(x, "x must be an integer")
    throwIfNotInt(y, "y must be an integer")

    this.#x = x
    this.#y = y
  }

  get x() {
    return this.#x
  }
  set x(v: number) {
    throwIfNotInt(v, "x must be an integer")
    this.#x = v
  }
  get y() {
    return this.#y
  }
  set y(v: number) {
    throwIfNotInt(v, "y must be an integer")
    this.#y = v
  }
}

class BoardCoordinate extends Coordinate {
  static xRange: { min: number; max: number } = { min: 1, max: WIDTH }
  static yRange: { min: number; max: number } = { min: 1, max: HEIGHT }
  constructor(x: number, y: number) {
    if (x > BoardCoordinate.xRange.max || x < BoardCoordinate.xRange.min) {
      throw new Error(
        `Coordinate must be inclusively between ${BoardCoordinate.xRange.min} and ${BoardCoordinate.xRange.max} `
      )
    }
    if (y > BoardCoordinate.yRange.max || y < BoardCoordinate.yRange.min) {
      throw new Error(
        `Coordinate must be inclusively between ${BoardCoordinate.yRange.min} and ${BoardCoordinate.yRange.max} `
      )
    }

    super(x, y)
  }

  get x() {
    return super.x
  }
  set x(v: number) {
    if (v > BoardCoordinate.xRange.max || v < BoardCoordinate.xRange.min) {
      throw new Error(
        `Coordinate must be inclusively between ${BoardCoordinate.xRange.min} and ${BoardCoordinate.xRange.max} `
      )
    }

    super.x = v
  }

  get y() {
    return super.y
  }
  set y(v: number) {
    if (v > BoardCoordinate.yRange.max || v < BoardCoordinate.yRange.min) {
      throw new Error(
        `Coordinate must be inclusively between ${BoardCoordinate.yRange.min} and ${BoardCoordinate.yRange.max} `
      )
    }

    super.y = v
  }
}

type coordPrimitive = `${bigint}, ${bigint}`
class Board {
  constructor(public coordGlyphRecord: Record<coordPrimitive, Glyph> = {}) {}

  placeGlyph(glyph: string, coord: BoardCoordinate, overwriteOkay = false) {
    if (!isGlyph(glyph)) {
      throw new Error("Glyph must be one character")
    }

    if (
      this.coordGlyphRecord[
        `${coord.x as unknown as bigint}, ${coord.y as unknown as bigint}`
      ] &&
      !overwriteOkay
    ) {
      throw new Error("Attempted to overwrite a glyph on the board")
    }

    this.coordGlyphRecord[
      `${coord.x as unknown as bigint}, ${coord.y as unknown as bigint}`
    ] = glyph
  }

  get boardString() {
    let boardString = this.#generateBlankBoardString()
    for (const key in this.coordGlyphRecord) {
      boardString = this.#writeGlyphToBoardString(
        key as coordPrimitive,
        this.coordGlyphRecord[key as coordPrimitive],
        boardString
      )
    }

    return boardString
  }

  #generateBlankBoardString(width = WIDTH, height = HEIGHT) {
    let blankBoardString = ""

    let blankLine = ""
    for (let i = 1; i <= width; i++) {
      blankLine += "　"
    }

    for (let i = 1; i <= height; i++) {
      blankBoardString += `${blankLine}\n`
    }

    return blankBoardString
  }

  #writeGlyphToBoardString(
    boardCoordPrim: coordPrimitive,
    glyph: string,
    boardString: string,
    doneByPlayer: boolean = false
  ) {
    if (!isGlyph(glyph)) {
      throw new Error("Glyph must be one character")
    }

    const coordStrArr = boardCoordPrim.split(", ")
    const x = parseInt(coordStrArr[0])
    const y = parseInt(coordStrArr[1])
    if (Number.isNaN(x) || Number.isNaN(y)) {
      throw new Error("boardCoordPrim invalid")
    }
    const coordObj = { x, y }

    if (
      coordObj.y < 1 ||
      coordObj.y > HEIGHT ||
      coordObj.x < 1 ||
      coordObj.x > WIDTH
    ) {
      if (!doneByPlayer) {
        throw new Error("Attempted to place glyph outside map")
      }

      coordObj.x = clamp(coordObj.x, 1, WIDTH)
      coordObj.y = clamp(coordObj.y, 1, HEIGHT)
    }

    const rows = boardString.split("\n")

    rows[coordObj.y - 1] =
      rows[coordObj.y - 1].slice(0, coordObj.x - 1) +
      glyph +
      rows[coordObj.y - 1].slice(coordObj.x + 1)

    return rows.join("\n")
  }
}

export default function WorldMap() {
  const worldMapDomRef = useRef<HTMLPreElement | null>(null)

  const boardRef = useRef(new Board())
  const [playerPosition, setPlayerPosition] = useState({ x: 13, y: 13 })

  const handleKeyboard = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      /** @Todo add asdf mode */
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

  boardRef.current.placeGlyph(
    "＠",
    new BoardCoordinate(playerPosition.x, playerPosition.y)
  )
  return (
    <pre
      tabIndex={0}
      ref={worldMapDomRef}
      className='leading-none bg-arne16-nightblue w-fit'
    >
      {boardRef.current.boardString}
    </pre>
  )
}
