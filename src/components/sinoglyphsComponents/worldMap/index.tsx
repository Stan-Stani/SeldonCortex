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

// declare const GlyphBrand: unique symbol
// /** One character string */
// type Glyph = string & { readonly [GlyphBrand]: never }

class Glyph {
  #string: string
  static throwIfNotOneCharacter(s: string) {
    if (s.length !== 1) {
      throw new Error("Glyph must be one character")
    }
    return true
  }

  constructor(string: string) {
    Glyph.throwIfNotOneCharacter(string)
    this.#string = string
  }

  toString = () => this.#string
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

class TwoWayMap<T extends object> {
  map: Map<keyof T, T[keyof T]>
  reverseMap: Map<T[keyof T], keyof T>
  #internalObjRepresentation: T
  constructor(srcObj: T) {
    this.#internalObjRepresentation = { ...srcObj }
    const srcEntries = Object.entries(this.#internalObjRepresentation) as Array<
      [keyof T, T[keyof T]]
    >
    this.map = new Map(srcEntries)

    const reverseEntries = srcEntries.map((entry) => [
      entry[1],
      entry[0],
    ]) as Array<[T[keyof T], keyof T]>
    this.reverseMap = new Map(reverseEntries)
  }
  get<K extends keyof T>(key: K): T[K] | undefined
  get<V extends T[keyof T]>(value: V): keyof T | undefined
  get(key: keyof T | T[keyof T]): T[keyof T] | keyof T | undefined {
    if (
      this.map.has(key as keyof T) &&
      this.reverseMap.has(key as T[keyof T])
    ) {
      throw new Error(
        "Unable to determine which way to use key because it exists as a key and as a value"
      )
    }
    return this.map.get(key as keyof T) === undefined
      ? this.reverseMap.get(key as T[keyof T])
      : this.map.get(key as keyof T)
  }
  has(key: keyof T | T[keyof T]) {
    return (
      this.map.has(key as keyof T) || this.reverseMap.has(key as T[keyof T])
    )
  }
  set(key: keyof T, value: T[keyof T]) {
    if (key === value) {
      throw new Error(
        "Can't add a key and value pair that are identical to each other"
      )
    }
    this.map.set(key, value)
    this.reverseMap.set(value, key)
    this.#internalObjRepresentation[key] = value
  }

  toObject() {
    return { ...this.#internalObjRepresentation }
  }
}

type coordPrimitive = `${bigint}, ${bigint}`
class Board {
  #emptyGlyph: Glyph
  #coordGlyphTwoWayMap: TwoWayMap<Record<coordPrimitive, Glyph>>
  #playerGlyph: Glyph
  constructor(
    playerGlyph: Glyph,
    coordGlyphRecord: Record<coordPrimitive, Glyph> = {},
    emptyGlyphString: string = "　"
  ) {
    this.#coordGlyphTwoWayMap = new TwoWayMap(coordGlyphRecord)
    this.#emptyGlyph = new Glyph(emptyGlyphString)
    this.#playerGlyph = playerGlyph
    this.#coordGlyphTwoWayMap.set(
      `${WIDTH / 2}, ${HEIGHT / 2}`,
      this.#playerGlyph
    )
  }

  placeGlyph(
    glyphString: string,
    coord: BoardCoordinate,
    overwriteOkay = false
  ) {
    const glyph = new Glyph(glyphString)

    if (
      this.#coordGlyphTwoWayMap.has(
        `${coord.x as unknown as bigint}, ${coord.y as unknown as bigint}`
      ) &&
      !overwriteOkay
    ) {
      throw new Error("Attempted to overwrite a glyph on the board")
    }

    this.#coordGlyphTwoWayMap.set(
      `${coord.x as unknown as bigint}, ${coord.y as unknown as bigint}`,
      glyph
    )
    console.log(this.#coordGlyphTwoWayMap.toObject())
  }

  removeGlyph(coord: BoardCoordinate, throwIfAlreadyEmpty = false) {
    const retrievedMember = this.#coordGlyphTwoWayMap.get(
      `${coord.x as unknown as bigint}, ${coord.y as unknown as bigint}`
    )
    if (!(retrievedMember instanceof Glyph)) {
      throw new Error("retrievedMember should be a glyph")
    }
    const glyph = retrievedMember

    if (
      glyph.toString() === this.#emptyGlyph.toString() &&
      throwIfAlreadyEmpty
    ) {
      throw new Error("Attempted to remove an empty glyph")
    }

    this.#coordGlyphTwoWayMap.set(
      `${coord.x as unknown as bigint}, ${coord.y as unknown as bigint}`,
      this.#emptyGlyph
    )
  }

  moveGlyph(glyph: Glyph, dest: coordPrimitive, overwriteOkay = false) {
    const originalPosTuple = this.#coordGlyphTwoWayMap
      .get(glyph)
      ?.split(", ")
      .map((v) => parseInt(v))
    if (!originalPosTuple) {
      throw "Glyph did not exist on board"
    }
    this.removeGlyph(
      new BoardCoordinate(originalPosTuple[0], originalPosTuple[1])
    )
    const destPosTuple = dest?.split(", ").map((v) => parseInt(v))
    this.placeGlyph(
      glyph.toString(),
      new BoardCoordinate(destPosTuple[0], destPosTuple[1]),
      overwriteOkay
    )
  }

  moveGlyphRelativeToSelf(
    glyph: Glyph,
    direction: "up" | "right" | "down" | "left",
    overwriteOkay = false
  ) {
    const originalPosTuple = this.#coordGlyphTwoWayMap
      .get(glyph)
      ?.split(", ")
      .map((v) => parseInt(v))
    if (!originalPosTuple) {
      throw "Glyph did not exist on board"
    }
    this.removeGlyph(
      new BoardCoordinate(originalPosTuple[0], originalPosTuple[1])
    )
    switch (direction) {
      case "up":
        this.placeGlyph(
          glyph.toString(),
          new BoardCoordinate(originalPosTuple[0], originalPosTuple[1] - 1),
          overwriteOkay
        )
        break
      case "right":
        this.placeGlyph(
          glyph.toString(),
          new BoardCoordinate(originalPosTuple[0] + 1, originalPosTuple[1]),
          overwriteOkay
        )
        break
      case "down":
        this.placeGlyph(
          glyph.toString(),
          new BoardCoordinate(originalPosTuple[0], originalPosTuple[1] + 1),
          overwriteOkay
        )
        break
      case "left":
        this.placeGlyph(
          glyph.toString(),
          new BoardCoordinate(originalPosTuple[0] - 1, originalPosTuple[1]),
          overwriteOkay
        )
        break
    }
  }

  get boardString() {
    let boardString = this.#generateBlankBoardString()
    for (const key in this.#coordGlyphTwoWayMap.toObject()) {
      const shouldBeGlyph = this.#coordGlyphTwoWayMap.get(key as coordPrimitive)
      if (shouldBeGlyph === undefined) {
        throw "Glyph cannot be undefined"
      }
      let glyph = shouldBeGlyph
      boardString = this.#writeGlyphToBoardString(
        key as coordPrimitive,
        glyph,
        boardString
      )
    }

    return boardString
  }

  #generateBlankBoardString(width = WIDTH, height = HEIGHT) {
    let blankBoardString = ""

    let blankLine = ""
    for (let i = 1; i <= width; i++) {
      blankLine += this.#emptyGlyph
    }

    for (let i = 1; i <= height; i++) {
      blankBoardString += `${blankLine}\n`
    }

    return blankBoardString
  }

  #writeGlyphToBoardString(
    boardCoordPrim: coordPrimitive,
    glyph: Glyph,
    boardString: string,
    clampToBoardDimensions: boolean = false
  ) {
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
      if (!clampToBoardDimensions) {
        throw new Error("Attempted to place glyph outside map")
      }

      coordObj.x = clamp(coordObj.x, 1, WIDTH)
      coordObj.y = clamp(coordObj.y, 1, HEIGHT)
    }

    const rows = boardString.split("\n")

    rows[coordObj.y - 1] =
      rows[coordObj.y - 1].slice(0, coordObj.x - 1) +
      glyph +
      rows[coordObj.y - 1].slice(coordObj.x)

    return rows.join("\n")
  }
}

export default function WorldMap() {
  const worldMapDomRef = useRef<HTMLPreElement | null>(null)

  const playerGlyphRef = useRef(new Glyph("＠"))
  const boardRef = useRef(new Board(playerGlyphRef.current))
  const [boardString, setBoardString] = useState<any>()

  const handleKeyboard = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      /** @Todo add asdf mode */
      case "w":
        boardRef.current.moveGlyphRelativeToSelf(
          playerGlyphRef.current,
          "up",
          true
        )
        setBoardString(boardRef.current.boardString)
        break
      case "a":
        boardRef.current.moveGlyphRelativeToSelf(
          playerGlyphRef.current,
          "left",
          true
        )
        setBoardString(boardRef.current.boardString)

        break
      case "s":
        boardRef.current.moveGlyphRelativeToSelf(
          playerGlyphRef.current,
          "down",
          true
        )
        setBoardString(boardRef.current.boardString)

        break
      case "d":
        boardRef.current.moveGlyphRelativeToSelf(
          playerGlyphRef.current,
          "right",
          true
        )
        setBoardString(boardRef.current.boardString)

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
      {boardRef.current.boardString}
    </pre>
  )
}
