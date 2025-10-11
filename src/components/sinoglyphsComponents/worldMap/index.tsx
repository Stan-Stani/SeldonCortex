import { useCallback, useEffect, useRef, useState } from "react"

/** 80 wide by 26 tall */
const mockMap = `ABCDEFGHIJKLMNOP
12345678901234561234567890123456123456789012345612345678901234561234567890123456
口日月人大小山川
木火水田土石竹糸
................
::::::::::::::::


@




米


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

/**
 *  @todo Add error handler for whole game to show in panel
 *  @todo Research Add internationalization and localization feature for glyph names
 *  @todo PlayerGlyph subtype that interacts with Glyphs
 */
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
  onChange: (changedObject: T) => void = () => {
    /* noop */
  }
  constructor(srcObj: T) {
    this.#internalObjRepresentation = new Proxy(
      { ...srcObj },
      {
        set: (target, key, value) => {
          console.log(`${String(key)} set to ${value}`)
          target[key as keyof T] = value
          this.onChange({ ...target })
          return true
        },
      }
    )
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

  delete(twoWayKey: keyof T | T[keyof T]): boolean {
    const mapHasKey = this.map.has(twoWayKey as keyof T)
    const revMapHasKey = this.reverseMap.has(twoWayKey as T[keyof T])
    if (mapHasKey && revMapHasKey) {
      throw new Error(
        "Unable to determine which way to use key because it exists as a key and as a value"
      )
    }

    let isDeleteFromMapSuccess: boolean = false
    let isDeleteFromRevMapSuccess: boolean = false
    if (mapHasKey) {
      const value = this.map.get(twoWayKey as keyof T) as T[keyof T]
      isDeleteFromMapSuccess = this.map.delete(twoWayKey as keyof T)
      isDeleteFromRevMapSuccess = this.reverseMap.delete(value)
      delete this.#internalObjRepresentation[twoWayKey as keyof T]
    } else if (revMapHasKey) {
      const value = this.reverseMap.get(twoWayKey as T[keyof T]) as keyof T
      delete this.#internalObjRepresentation[value]
      isDeleteFromRevMapSuccess = this.reverseMap.delete(
        twoWayKey as T[keyof T]
      )
      isDeleteFromMapSuccess = this.map.delete(value)
    }

    if (
      (isDeleteFromMapSuccess || isDeleteFromRevMapSuccess) &&
      !(isDeleteFromMapSuccess && isDeleteFromRevMapSuccess)
    ) {
      throw new Error(
        "Should have successfully deleted from both map and reverseMap \
        if one of them had a successful deletion"
      )
    }

    return isDeleteFromMapSuccess && isDeleteFromRevMapSuccess
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
  onBoardChange: (boardString: string) => void = () => {
    /** noop */
  }
  #emptySpace: string
  #coordGlyphTwoWayMap: TwoWayMap<Record<coordPrimitive, Glyph>>
  #playerGlyph: Glyph

  constructor(
    playerGlyph: Glyph,
    coordGlyphRecord: Record<coordPrimitive, Glyph> = {},
    emptySpace: string = "　"
  ) {
    this.#coordGlyphTwoWayMap = new TwoWayMap(coordGlyphRecord)
    this.#coordGlyphTwoWayMap.onChange = () =>
      this.onBoardChange(this.boardString)
    // Ensure its string passes Glyph string validation by instantiating a Glyph we immediately discard
    this.#emptySpace = new Glyph(emptySpace).toString()
    this.#playerGlyph = playerGlyph
    this.#coordGlyphTwoWayMap.set(
      `${WIDTH / 2}, ${HEIGHT / 2}`,
      this.#playerGlyph
    )
  }

  placeGlyph(
    glyph: Glyph,
    coord: BoardCoordinate,
    /** @default false */
    overwriteOkay = false
  ) {
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
  }

  removeGlyph(coord: BoardCoordinate, throwIfAlreadyEmpty = false) {
    const retrievedMember = this.#coordGlyphTwoWayMap.get(
      `${coord.x as unknown as bigint}, ${coord.y as unknown as bigint}`
    )

    if (retrievedMember && throwIfAlreadyEmpty) {
      throw new Error("Attempted to remove empty space")
    }

    this.#coordGlyphTwoWayMap.delete(
      `${coord.x as unknown as bigint}, ${coord.y as unknown as bigint}`
    )
  }

  moveGlyph(
    glyph: Glyph,
    dest: coordPrimitive | BoardCoordinate,
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

    let destBoardCoordinate: BoardCoordinate
    if (!(dest instanceof BoardCoordinate)) {
      const destPosTuple = dest?.split(", ").map((v) => parseInt(v))
      destBoardCoordinate = new BoardCoordinate(
        destPosTuple[0],
        destPosTuple[1]
      )
    } else {
      destBoardCoordinate = dest
    }
    this.placeGlyph(glyph, destBoardCoordinate, overwriteOkay)
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

    switch (direction) {
      case "up":
        this.moveGlyph(
          glyph,
          new BoardCoordinate(originalPosTuple[0], originalPosTuple[1] - 1),
          overwriteOkay
        )
        break
      case "right":
        this.moveGlyph(
          glyph,
          new BoardCoordinate(originalPosTuple[0] + 1, originalPosTuple[1]),
          overwriteOkay
        )
        break
      case "down":
        this.moveGlyph(
          glyph,
          new BoardCoordinate(originalPosTuple[0], originalPosTuple[1] + 1),
          overwriteOkay
        )
        break
      case "left":
        this.moveGlyph(
          glyph,
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
      blankLine += this.#emptySpace
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
  const [boardString, setBoardString] = useState<string>()

  const boardRef = useRef<Board>(undefined as unknown as Board)
  // Prevent initializing board every render
  if (boardRef.current === undefined) {
    boardRef.current = new Board(playerGlyphRef.current)
    boardRef.current.placeGlyph(new Glyph("米"), new BoardCoordinate(5, 5))
    boardRef.current.placeGlyph(new Glyph("水"), new BoardCoordinate(20, 7))
  }
  boardRef.current.onBoardChange = setBoardString

  /** @todo Pass setBoardString to Board instance */

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

  /** @effectName onMountEffect() */
  useEffect(() => {
    setBoardString(boardRef.current.boardString)
  }, [])

  return (
    <pre
      tabIndex={0}
      ref={worldMapDomRef}
      className='leading-none bg-arne16-nightblue w-fit'
    >
      {boardString}
    </pre>
  )
}
