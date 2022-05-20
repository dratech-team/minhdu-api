const Version = {
  V1: "v1",
  V2: "v2",
};

const V1 = {
  APPLICATION: `${Version.V1}/application`,
  ADMIN: `${Version.V1}/admin`,
  AUTH: `${Version.V1}/auth`,
  BANK: `${Version.V1}/bank`,
  ROLE: `${Version.V1}/role`,
  EXPORT: `${Version.V1}/export`,
  OVERVIEW: `${Version.V1}/overview`,
  LOGGER: `${Version.V1}/logger`,
  BASIC_TEMPLATE: `${Version.V1}/basic-template`,
  BILL: `${Version.V1}/bill`,
  CATEGORY: `${Version.V1}/category`,
  COMMODITY: `${Version.V1}/commodity`,
  COMMODITY_TEMPLATE: `${Version.V1}/commodity-template`,
  CONTRACT: `${Version.V1}/contract`,
  CUSTOMER: `${Version.V1}/customer`,
  DEGREE: `${Version.V1}/degree`,
  EGG: `${Version.V1}/egg`,
  EGG_TYPE: `${Version.V1}/egg-type`,
  EMPLOYEE: `${Version.V1}/employee`,
  FINANCE: `${Version.V1}/finance`,
  HOLIDAY: `${Version.V1}/holiday`,
  INCUBATOR: `${Version.V1}/incubator`,
  LOCATION: `${Version.V1}/location`,
  ORDER: `${Version.V1}/order`,
  ORDER_HISTORY: `${Version.V1}/order-history`,
  ORGCHART: {
    BRANCH: `${Version.V1}/branch`,
    POSITION: `${Version.V1}/position`,
  },
  OVERTIME_TEMPLATE: `${Version.V1}/overtime-template`,
  PAYMENT_HISTORY: `${Version.V1}/payment-history`,
  PAYROLL: `${Version.V1}/payroll`,
  PRODUCT: `${Version.V1}/product`,
  RELATIVE: `${Version.V1}/relative`,
  ROUTE: `${Version.V1}/route`,
  SALARY: {
    SALARY: `${Version.V1}/salary`,
    SALARYV2: `${Version.V1}/salaryv2`,
    BRANCH: `${Version.V1}/salary/branch`,
    ALLOWANCE: `${Version.V1}/salary/allowance`,
    ABSENT: `${Version.V1}/salary/absent`,
    DAYOFF: `${Version.V1}/salary/dayoff`,
    DEDUCTION: `${Version.V1}/salary/deduction`,
    OVERTIME: `${Version.V1}/salary/overtime`,
    REMOTE: `${Version.V1}/salary/remote`,
    HOLIDAY: `${Version.V1}/salary/holiday`,
  },
  SYSTEM: `${Version.V1}/system`,
  SETTINGS: {
    SALARY: `${Version.V1}/settings/salary`,
    BLOCK_SALARY: `${Version.V1}/settings/salary-block`,
  },
  HISTORY: {
    SALARY: `${Version.V1}/history/salary`,
  },
  WAREHOUSE: {
    WAREHOUSE: `${Version.V1}/warehouse`,
    CONSIGNMENT: `${Version.V1}/consignment`,
    WAREHOUSE_HISTORY: `${Version.V1}/warehouse-history`,
    STOCK: `${Version.V1}/stock`,
    SUPPLIER: `${Version.V1}/supplier`,
  },
};


const V2 = {
  PAYROLL: `${Version.V2}/payroll`,
};

export const ApiConstant = {V1, V2};
