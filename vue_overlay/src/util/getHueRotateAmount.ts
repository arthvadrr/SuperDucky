export function getHueFromHex(hex: string): number {
  const hexString: string = hex.slice(1);
  const value: number = Number('0x' + hexString);
  const r: number = value >> 16;
  const g: number = (value >> 8) & 0xff;
  const b: number = value & 0xff;
  const max: number = Math.max(r, g, b);
  const min: number = Math.min(r, g, b);
  const delta: number = max - min;

  if (delta === 0) return 0;

  let hue: number = 0;

  if (r === max) {
    hue = (60 * (g - b)) / delta;
  } else if (g === max) {
    hue = (60 * (b - r)) / delta + 120;
  } else {
    hue = (60 * (r - g)) / delta + 240;
  }
  hue = (hue + 360) % 360;

  return hue;
}

export function getHueRotateAmount(targetHex: string, baseHex: string = '#FFDB50'): number {
  const hue: number = getHueFromHex(targetHex);
  const baseHue: number = getHueFromHex(baseHex);

  if (hue === baseHue) return 0;
  return (hue - baseHue + 360) % 360;
}
