export function crudManyResponse(count: number, crud: "creation" | "updation" | "deletion") {
  return {
    status: 201,
    message: `${crud === "creation" ? "Tạo" : crud === "updation" ? "Cập nhật" : "Xóa"} thành công ${count} record`
  };
}
