export function crudManyResponse(count: number, crud: "creation" | "updation" | "deletion") {
  return {
    status: 201,
    message: `Đã ${crud === "creation" ? "tạo" : crud === "updation" ? "cập nhật" : "xóa"} thành công ${count} record`
  };
}
