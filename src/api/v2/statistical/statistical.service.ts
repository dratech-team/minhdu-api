import {Injectable} from '@nestjs/common';
import {StatisticalRepository} from "./statistical.repository";
import {NationType} from "./enums/nation-type.enum";
import {CustomerType} from "./enums/customer-type.enum";
import {RouteType} from "./enums/route-type.enum";

@Injectable()
export class StatisticalService {
  constructor(private readonly repository: StatisticalRepository) {
  }

  async statisticalNation(startedAt: Date, endedAt: Date, type: NationType) {
    switch (type) {
      case NationType.ORDER:
        return await this.orders(startedAt, endedAt);
      case NationType.COMMODITY:
        return await this.commodities(false);
      case NationType.COMMODITY_DETAIL:
        return await this.commodities(true);
    }
  }

  async statisticalCustomer(type: CustomerType) {
    switch (type) {
      case CustomerType.POTENTIAL:
        return await this.potentialCustomers();
      case CustomerType.COMMODITY_DETAIL:
        return await this.customers();
      case CustomerType.DEBT:
        return await this.debtCustomers();
      default:
        return;
    }
  }

  async statisticalRoute(type: RouteType) {
    switch (type) {
      case RouteType.CUSTOMER:
        return await this.routeCustomers();
      case RouteType.MONEY:
        return await this.customers();
      case RouteType.TOTAL_COMMODITY:
        return await this.debtCustomers();
      default:
        return;
    }
  }

  async routeCustomers() {

  }
  async orders(startedAt: Date, endedAt: Date) {
    const data = await this.repository.statisticalOrder(startedAt, endedAt);

    return data.provinces.map(province => {
      const order = data.orders.filter(order => order.destination.district.province.id === province.id);
      return {
        name: province.name,
        series:[
          {
            name: "Đơn hàng",
            value: order.length ?? 0
          }
        ],
      };
    });
  }

  async potentialCustomers() {
    const data = await this.repository.statisticalCustomers();

    return data.provinces.map(province => {
      const customerPotential = data.customers.filter(customer => customer.ward.district.province.id === province.id && customer.isPotential);
      return {
        name: province.name,
        series: [
          {
            name: "Tìm năng",
            value: customerPotential.length
          },
          {
            name: "Không tìm năng",
            value: data.customers.length - customerPotential.length
          }
        ]
      };
    });
  }

  async customers() {
    const data = await this.repository.statisticalCustomers();
    return data.customers.map(customer => ({
      name: customer.firstName + customer.lastName,
      series: [
        {
          name: "Gà bán",
          value: customer.orders.map(order => order.commodities.map((commodity) => commodity.amount + commodity.more).reduce((a, b) => a + b, 0)).reduce((x, y) => x + y, 0)
        },
        {
          name: "Gà tặng",
          value: customer.orders.map(order => order.commodities.map((commodity) => commodity.gift).reduce((a, b) => a + b, 0)).reduce((x, y) => x + y, 0)
        },
      ]
    }));
  }

  async debtCustomers() {
    const data = await this.repository.statisticalCustomers();

    return data.customers.map(customer => ({
      name: customer.firstName + ' '+ customer.lastName,
      series: [
        {
          name: 'Khoản nợ',
          /// khách hàng có nợ sẽ trả về số âm,
          // thanh toán dư sẽ trả về số dương
          // để hiển thị chart theo hai hướng nợ và thanh toán dư
          value: customer.orders.reduce((a, b) => {
                 const totalPayment = b.paymentHistories.reduce( (a, b) => { return a + b.total;}, 0);
                 const totalCommodity = b.commodities.reduce((a,b)=>{
                        const totalCommodityBeforeGift = b.amount * b.price;
                        const totalCommodityMore = b.more * Math.ceil((b.price * b.amount) / (b.amount + b.more));
                        return totalCommodityBeforeGift + totalCommodityMore;
                 },0);
                 return totalPayment - totalCommodity;
          }, 0)
        }
      ]
    }));
  }

  async commodities(isDetail: boolean) {
    const data = await this.repository.commodities();
    return data.provinces.map(province => {
      const commodities = data.commodities.filter(e => e.order.destination.district.province.id === province.id);
      if (!isDetail) {
        return {
          name: province.name,
          value: commodities.map(commodity => commodity.amount + commodity.more).reduce((a, b) => a + b, 0)
        };
      }
      return {
        name: province.code,
        series: commodities.map(commodity => ({
          name: commodity.name,
          value: commodity.amount + commodity.more
        }))
      };
    });
  }
}
