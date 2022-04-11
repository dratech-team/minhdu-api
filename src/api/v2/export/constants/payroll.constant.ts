const payroll = {
  name: "Họ và tên",
  position: "Chức vụ",
  basic: "Tổng Lương cơ bản",
  stay: "Tổng phụ cấp ở lại",
  overtime: "Tổng tiền tăng ca",
  deduction: "Tổng tiền khấu trừ",
  allowance: "Tổng tiền phụ cấp",
  workday: "Ngày công chuẩn",
  absent: "Vắng",
  bsc: "Quên giấy phép/BSC",
  bscSalary: "Tổng tiền quên giấy phép/BSC",
  workdayNotInHoliday: "Tổng công trừ ngày lễ",
  payslipNormalDay: "Tổng lương trừ ngày lễ",
  worksInHoliday: "Ngày Lễ đi làm",
  payslipInHoliday: "Lương lễ đi làm",
  worksNotInHoliday: "Ngày lễ không đi làm",
  payslipNotInHoliday: "Lương lễ không đi làm",
  totalWorkday: "Tổng ngày thực tế",
  payslipOutOfWorkday: "Lương ngoài giờ x2",
  tax: "Thuế",
  total: "Tổng lương",
};

const timesheet = {
  lastName: "Họ và tên",
  branch: "Đơn vị",
  position: "Chức vụ",
};

const seasonal = {
  lastName: "Họ và tên",
  branch: "Đơn vị",
  position: "Chức vụ",
  datetime: "Ngày",
  title: "Loại tăng ca",
  workdays: 'Tổng ngày làm',
  totalSalaryWorkday: "Tổng tiền",
  times: "Tổng giờ làm",
  totalSalaryTimes: "Tổng tiền",
  total: "Tổng cộng"
};

const overtime = {
  lastName: "Họ và tên",
  branch: "Đơn vị",
  position: "Chức vụ",
  datetime: "Ngày",
  title: "Loại tăng ca",
  unit: "Đơn vị tính",
  price: "Đơn giá",
  total: "Tổng tiền"
};

const basic = {
  lastName: "Họ và tên",
  branch: "Đơn vị",
  position: "Chức vụ",
  datetime: "Ngày",
  title: `Loại lương cơ bản`,
  price: `Số tiền`
};

const stay = {
  lastName: "Họ và tên",
  branch: "Đơn vị",
  position: "Chức vụ",
  datetime: "Ngày",
  title: `Loại phụ cấp lương`,
  price: `Giá`
};

const allowance = {
  lastName: "Họ và tên",
  branch: "Đơn vị",
  position: "Chức vụ",
  datetime: "Ngày",
  title: `Loại phụ cấp thêm`,
  price: `Giá`
};

const absent = {
  lastName: "Họ và tên",
  branch: "Đơn vị",
  position: "Chức vụ",
  datetime: "Ngày",
  title: `Loại vắng`,
};

const employee = {
  lastName: "Họ và tên",
  type: "Loại nhân viên",
  birthday: "Ngày sinh",
  gender: "Giới tính",
  createdAt: `Ngày vào làm`,
  workedAt: `Ngày chính thức`,
  isFlatSalary: `Loại lương`,
  phone: `Số điện thoại`,
  workphone: `Số điện thoại 2`,
  branch: `Đơn vị`,
  position: `Chức vụ`,
  identify: `CMND/CCCD`,
  province: `Tỉnh/Thành phố`,
  district: `Quận/Huyện`,
  ward: `Phường/Xã`,
  address: `Địa chỉ`,
};

export const ExportConstant = {payroll, timesheet, seasonal, overtime, basic, stay, allowance, absent, employee};
