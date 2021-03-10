export enum ZoneEnum {
  NORTH = 1,
  MIDDLE = 2,
  SOUTH = 3
}

export enum TypeMotor {
  SCOOTER = 1,
  SIRIUS = 2,
  OTHER = 3
}

export function getLimitWin(typeMotor: number) {
  return {
    1: 150,
    2: 100,
    3: 50
  }[typeMotor];
}

export function checkFrameAndEngine(frameNum: string, engineNum: string) {
  let boo = true;
  const arrayCheck = ["RLCUE1720", "RLCUE3210", "RLCUE3710"];
  for (const value of arrayCheck) {
    if (frameNum.indexOf(value) > -1 || engineNum.indexOf(value) > -1) {
      boo = false;
    }
  }

  return boo;
}
