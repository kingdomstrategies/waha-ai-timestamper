import tinycolor from 'tinycolor2'

const p1 = '#E42535'
const p2 = tinycolor(p1).darken(10).toString()
const f1 = '#151515'
const f2 = tinycolor(f1).brighten(30).toString()

export const colors = {
  p1,
  p2,
  f1,
  f2,
  b1: '#F2F2F2',
  b2: '#FFFFFF',
  op: '#ebebeb',
}
