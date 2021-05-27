export function generateId(input: string): string {
  let departmentCode!: string;
  let depFormatted!: string;

  if (input !== undefined && input.length > 0) {
    depFormatted = input.trim();
  }

  switch (countWhiteSpace(depFormatted)) {
    case 0:
      switch (depFormatted.length) {
        case 1:
          departmentCode = (depFormatted + '11').toUpperCase();
          break;
        case 2:
          departmentCode = (depFormatted + '1').toUpperCase();
          break;
        default:
          departmentCode = depFormatted.substring(0, 3).toUpperCase();
      }
      break;
    default:
      departmentCode = (depFormatted.substring(0, 1) + depFormatted.split(' ')[1].substring(0, 1) + depFormatted.split(' ')[2].substring(0, 1)).toUpperCase();
  }
  return departmentCode;
}

function countWhiteSpace(s: string) {
  if (s === undefined || s.length === 0) {
    return "";
  }
  return s.match(/([\s]+)/g) == null ? 0 : s?.match(/([\s]+)/g)?.length;
}


export function generateNameCode(str) {

  // Xoa dau cach thua VA xoa Unico
  str = str.trim();
  str = str.replace(/\s+/g, " ");

  // Tach cac ki tu dau tien
  let x = str.split(" ");
  let kq = "";
  for (let i = x.length - 1; i >= 0; i--) {
    kq = x[i].charAt(0) + kq;
  }

  // Xoa ki tu them
  while (kq.length <= 2) kq += "1";
  if (kq.length > 3) kq = kq.slice(kq.length - 3);
  // Xoa dau
  kq = kq.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  return kq.toUpperCase();
}
