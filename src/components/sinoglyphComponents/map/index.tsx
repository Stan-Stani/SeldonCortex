
/** 80 wide by 32 24 tall */
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

export default function SinoglyphMap() {
  return <pre className='leading-none'>{mockMap}</pre>
}
