/**
 * SUPER_ADMIN: có toàn quyền trong hệ thống
 * ADMIN: xem thống kê báo cáo của các trại con, trại ấp, thêm trại mới
 * CHIEF_ACCOUNTANT (Kế toán trưởng): Mọi đơn hàng thu chi đều phải thông qua
 * kế toán trưởng duyệt
 * SALESMAN (Bán hàng):
 *  - Nhập số lượng trứng vô lò (3 dòng là MD1, MD2, MD3)
 *  - Nhập số lượng trứng soi loại từ các trại con chuyển về, nhập đơn đặt hàng
 *    của khách hàng
 *  - Xuất gà theo đơn đã nhập
 *  - Nhập báo cáo bán gà
 * SALESMAN_EGG (Bán trứng):
 *  - Cập nhật số lượng trứng loại, trong tan
 *  - Lên danh sách đại lý
 *  - Xuất phiếu bán trứng
 *  - Lập báo cáo
 * ACCOUNTANT_CASH_FUND (Kế toán quỹ tiền mặt): sau khi kế toán trưởng duyệt các
 * đơn thu chi từ các trại sẽ chuyển đến kế toán quỹ tiền mặt.
 * ACCOUNTANT_MODERATION (Kế toán kiểm duyệt): Duyệt các phiếu thu/ chi từ các
 * trại con đẩy lên trước khi đưa lên kế toán trưởng
 * IMPORTER_EXPORTER (Xuất nhập khẩu):
 *  -  Đặt mua thiết bị, máy móc chuồng trại
 *     -> Thanh toán và theo dõi tiền chuyển khoản đơn hàng nước ngoài.
 *  -  Nhận đơn đặt hàng từ nước ngoài
 * CONSTRUCTION_DEPARTMENT (Xây dựng): Tổng hợp các hợp đồng
 * HUMAN_RESOURCE (Quản lý nhân sự): Tổng hợp các bảng lương từ các trại con báo cáo lên
 * xác minh và trả lương cho nhân viên
 * CAMP_ACCOUNTING (Kế toán trại):
 *  - Gửi request đơn hàng từ các trại lên kho tổng
 *  - Theo dõi hàng tồn
 *  - Thống kê kho
 *  - ....
 * CAMP_MANAGEMENT (Quản lý trại):
 *  - Duyệt các request kho
 *  - ....
 * CAMP_DIRECTOR (Giám đốc trại):
 *  - Duyệt đơn request kho sau khi quản lý duyệt
 *  - ...
 * HATCHERY_ACCOUNTING (Kế toán trại ấp):
 * HATCHERY_MANAGEMENT (Quản lý trại ấp):
 */

export enum Permission {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  CHIEF_ACCOUNTANT = "CHIEF_ACCOUNTANT",
  ACCOUNTANT_CASH_FUND = "ACCOUNT_CASH_FUND",
  ACCOUNTANT_MODERATION = "ACCOUNTANT_MODERATION",
  SALESMAN = "SALESMAN",
  SALESMAN_EGG = "SALESMAN_EGG",
  IMPORTER_EXPORTER = "IMPORTER_EXPORTER",
  CONSTRUCTION_DEPARTMENT = "CONSTRUCTION_DEPARTMENT",
  HUMAN_RESOURCE = "HUMAN_RESOURCE",
  CAMP_ACCOUNTING = "CAMP_ACCOUNTING",
  CAMP_MANAGEMENT = "CAMP_MANAGEMENT",
  CAMP_DIRECTOR = "CAMP_DIRECTOR",
  HATCHERY_ACCOUNTING = "HATCHERY_ACCOUNTING",
  HATCHERY_MANAGEMENT = "HATCHERY_DIRECTOR",
}
