import { JSX, useCallback, useEffect, useRef, useState } from "react"
import { toast, ToastContainer } from "react-toastify"

/**
 * @todo add system on Glyphs that defines possible actions;
 * Might need to account for overrides like for
 * specific quests.
 * @example
 * Gather rice instead of
 * eat rice
 *
 * Hard code actions results (callbacks) first
 * but may eventually generalize to make
 * writing boards / scenarios easer
 */

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
  /** `NaN` if not in a board */
  indexInBoardString = NaN

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
          target[key as keyof T] = value
          this.onChange({ ...target })
          return true
        },
        deleteProperty: (target, p) => {
          return delete target[p as keyof T]
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

type BoardNotifyEvent =
  | {
      type: "glyphSelected"
      glyph: Glyph
    }
  | {
      type: "glyphMoveBlocked"
      occupyingGlyph: Glyph
      failedToMoveGlyph: Glyph
    }
  | {
      type: "glyphDeselected"
      glyph: Glyph
    }
  | {
      type: "requestActionBySelectedGlyph"
      glyph: Glyph
    }
class Board {
  onBoardChange: (boardString: string) => void = () => {
    /** noop */
  }

  onNotify(event: BoardNotifyEvent): void {
    event
    // noop
  }

  submitAction(actionText: string) {
    toast(`${actionText} the ${this.selectedGlyph}`)
  }

  #emptySpace: string
  #coordGlyphTwoWayMap: TwoWayMap<Record<coordPrimitive, Glyph>>
  #playerGlyph: Glyph
  #boardString = ""
  get boardString() {
    return this.#boardString
  }
  selectedGlyph: Glyph | null = null

  constructor(
    playerGlyph: Glyph,
    coordGlyphRecord: Record<coordPrimitive, Glyph> = {},
    emptySpace: string = "　"
  ) {
    this.#coordGlyphTwoWayMap = new TwoWayMap(coordGlyphRecord)
    this.#coordGlyphTwoWayMap.onChange = () => {
      this.onBoardChange(this.boardString)

      let boardString = this.#generateBlankBoardString()
      for (const key in this.#coordGlyphTwoWayMap.toObject()) {
        const shouldBeGlyph = this.#coordGlyphTwoWayMap.get(
          key as coordPrimitive
        )
        if (shouldBeGlyph === undefined) {
          throw "Glyph cannot be undefined"
        }
        let glyph = shouldBeGlyph
        boardString = this.#writeGlyphToBoardString(
          key as coordPrimitive,
          glyph,
          boardString
        )

        this.#boardString = boardString
      }
    }
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
    /** @default throw */
    targetOccupiedBehavior: "overwrite" | "throw" | "notify" = "throw",
    isPlayer = false
  ): boolean {
    if (
      this.#coordGlyphTwoWayMap.has(
        `${coord.x as unknown as bigint}, ${coord.y as unknown as bigint}`
      )
    ) {
      switch (targetOccupiedBehavior) {
        case "throw":
          throw new Error("Attempted to overwrite a glyph on the board")
          break
        case "overwrite":
          this.#coordGlyphTwoWayMap.set(
            `${coord.x as unknown as bigint}, ${coord.y as unknown as bigint}`,
            glyph
          )
          return true
          break
        case "notify":
          const occupyingGlyph = this.#coordGlyphTwoWayMap.get(
            `${coord.x as unknown as bigint}, ${coord.y as unknown as bigint}`
          )!
          const failedToMoveGlyph = glyph
          this.onNotify({
            type: "glyphMoveBlocked",
            occupyingGlyph,
            failedToMoveGlyph,
          })
          ;(isPlayer && (this.selectedGlyph = occupyingGlyph),
            this.onNotify({ type: "glyphSelected", glyph: occupyingGlyph }),
            this.onNotify({
              type: "requestActionBySelectedGlyph",
              glyph: occupyingGlyph,
            }))
          return false
          break
      }
    } else {
      this.#coordGlyphTwoWayMap.set(
        `${coord.x as unknown as bigint}, ${coord.y as unknown as bigint}`,
        glyph
      )
      return true
    }
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
    /** @default throw */
    targetOccupiedBehavior: "overwrite" | "throw" | "notify" = "throw",
    isPlayer = false
  ): boolean {
    const originalPosTuple = this.#coordGlyphTwoWayMap
      .get(glyph)
      ?.split(", ")
      .map((v) => parseInt(v))
    if (!originalPosTuple) {
      throw "Glyph did not exist on board"
    }

    const originalBoardCoordinate = new BoardCoordinate(
      originalPosTuple[0],
      originalPosTuple[1]
    )
    this.removeGlyph(originalBoardCoordinate)

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

    const successfullyMovedGlyphToDest = this.placeGlyph(
      glyph,
      destBoardCoordinate,
      targetOccupiedBehavior,
      isPlayer
    )
    if (!successfullyMovedGlyphToDest) {
      return this.placeGlyph(
        glyph,
        originalBoardCoordinate,
        targetOccupiedBehavior,
        isPlayer
      )
    }

    return successfullyMovedGlyphToDest
  }

  moveGlyphRelativeToSelf(
    glyph: Glyph,
    direction: "up" | "right" | "down" | "left",
    /** @default throw */
    targetOccupiedBehavior: "overwrite" | "throw" | "notify" = "throw",
    isPlayer = false
  ): boolean {
    const originalPosTuple = this.#coordGlyphTwoWayMap
      .get(glyph)
      ?.split(", ")
      .map((v) => parseInt(v))
    if (!originalPosTuple) {
      throw "Glyph did not exist on board"
    }

    switch (direction) {
      case "up":
        return this.moveGlyph(
          glyph,
          new BoardCoordinate(originalPosTuple[0], originalPosTuple[1] - 1),
          targetOccupiedBehavior,
          isPlayer
        )
        break
      case "right":
        return this.moveGlyph(
          glyph,
          new BoardCoordinate(originalPosTuple[0] + 1, originalPosTuple[1]),
          targetOccupiedBehavior,
          isPlayer
        )
        break
      case "down":
        return this.moveGlyph(
          glyph,
          new BoardCoordinate(originalPosTuple[0], originalPosTuple[1] + 1),
          targetOccupiedBehavior,
          isPlayer
        )
        break
      case "left":
        return this.moveGlyph(
          glyph,
          new BoardCoordinate(originalPosTuple[0] - 1, originalPosTuple[1]),
          targetOccupiedBehavior,
          isPlayer
        )
        break
    }
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

    glyph.indexInBoardString =
      // Width + 1 char for new line
      (WIDTH + 1) *
        // * number of lines above line of glyph
        (coordObj.y - 1) +
      // + partial line - 1 for index starting at 0
      coordObj.x -
      1
    return rows.join("\n")
  }
}

function tintSpecialGlyphs({
  boardString,
  selectedGlyph,
}: {
  boardString: string
  selectedGlyph: Glyph | null
}) {
  if (selectedGlyph === null) {
    return boardString
  }

  return (
    <>
      {boardString.slice(0, selectedGlyph.indexInBoardString)}
      <span className='text-arne16-yellow'>{selectedGlyph.toString()}</span>
      {boardString.slice(selectedGlyph.indexInBoardString + 1)}
    </>
  )
}

export default function WorldMap() {
  const worldMapDomRef = useRef<HTMLPreElement | null>(null)

  const playerGlyphRef = useRef(new Glyph("＠"))
  const [boardString, setBoardString] = useState<string>("")
  const [notification, setNotification] = useState<JSX.Element>()
  const [selectedGlyph, setSelectedGlyph] = useState<Glyph | null>(null)
  const [showTextInput, setShowTextInput] = useState(false)
  const [textActionInputValue, setTextActionInputValue] = useState("")

  const boardRef = useRef<Board>(undefined as unknown as Board)
  // Prevent initializing board every render
  if (boardRef.current === undefined) {
    boardRef.current = new Board(playerGlyphRef.current)
    boardRef.current.placeGlyph(new Glyph("米"), new BoardCoordinate(5, 5))
    boardRef.current.placeGlyph(new Glyph("水"), new BoardCoordinate(20, 7))
  }
  boardRef.current.onBoardChange = setBoardString
  boardRef.current.onNotify = (event) => {
    const notificationElement = (
      <span>
        Type: {event.type}
        <br />
        <pre>{JSON.stringify({ ...event, type: undefined }, undefined, 2)}</pre>
      </span>
    )
    setNotification(notificationElement)
    /**
     * @todo Need to prevent these toasts in production env
     * @todo style with arne16
     */
    toast(notificationElement, {
      style: { width: "max-content" },
    })

    switch (event.type) {
      case "glyphMoveBlocked":
        if (Number.isNaN(event.occupyingGlyph.indexInBoardString)) {
          throw "Glyph string should have a real board index"
        }
        break
      case "glyphSelected":
        if (Number.isNaN(event.glyph.indexInBoardString)) {
          throw "Glyph string should have a real board index"
        }
        setSelectedGlyph(event.glyph)
        break
      case "requestActionBySelectedGlyph":
        if (Number.isNaN(event.glyph.indexInBoardString)) {
          throw "Glyph string should have a real board index"
        }
        setShowTextInput(true)
        break
    }
  }

  const handleKeyboard = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      /** @Todo add asdf mode */
      case "w":
        boardRef.current.moveGlyphRelativeToSelf(
          playerGlyphRef.current,
          "up",
          "notify",
          true
        )
        setBoardString(boardRef.current.boardString)
        break
      case "a":
        boardRef.current.moveGlyphRelativeToSelf(
          playerGlyphRef.current,
          "left",
          "notify",
          true
        )
        setBoardString(boardRef.current.boardString)

        break
      case "s":
        boardRef.current.moveGlyphRelativeToSelf(
          playerGlyphRef.current,
          "down",
          "notify",
          true
        )
        setBoardString(boardRef.current.boardString)

        break
      case "d":
        boardRef.current.moveGlyphRelativeToSelf(
          playerGlyphRef.current,
          "right",
          "notify",
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
    <>
      <div>
        <pre
          tabIndex={0}
          ref={worldMapDomRef}
          className='leading-none bg-arne16-void w-fit'
        >
          {tintSpecialGlyphs({ boardString, selectedGlyph })}
        </pre>
      </div>
      <div>
        {showTextInput && (
          <input
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                toast(textActionInputValue)
                boardRef.current.submitAction(textActionInputValue)
              }
            }}
            onChange={(event) =>
              setTextActionInputValue(event.currentTarget.value)
            }
            ref={(el) => el?.focus()}
            type='text'
            className='bg-arne16-void m-1'
          />
        )}
      </div>
      <div>
        {notification}
        <ToastContainer theme='dark' />
      </div>
    </>
  )
}
