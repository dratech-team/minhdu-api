import {DELIVERY_STATUS} from "../entities/filter-sell.entity";

type Status = {
  name: string;
  series: {
    name: string;
    value: number
  }[];
}

export function filterStatusNotNull(data: any[]) {
  return data.filter(e => e.series.map(e => e.value).reduce((a, b) => a + b, 0) !== 0);
}

export async function convertStatusToSeries(func: Promise<any>) {
  return await Promise.all([DELIVERY_STATUS.COMPLETE, DELIVERY_STATUS.DELIVERY, DELIVERY_STATUS.CANCEL].map(async status => {
    return {
      name: status,
      value: await func,
    };
  }));
}
