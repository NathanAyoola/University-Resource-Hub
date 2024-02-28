import dayjs from 'dayjs';
import Repository from '../repositories/repository';

export default abstract class Service<T> extends Repository<T> {
    // abstract repository: Repository<T>;
    protected repository: Repository<T>;
    abstract events: Record<string, (...args: any[]) => void> | null;
    constructor(repository: Repository<T>) {
      const model = repository.model;
      super(model);
      this.repository = repository;
      
    }
    forEveryDay = async <T>(
      startDate: dayjs.Dayjs,
      endDate: dayjs.Dayjs,
      callback: (_currentDay: dayjs.Dayjs) => Promise<T>
    ) => {
      const result: T[] = [];
      let currentDay = startDate.startOf('day');
      const _endDate = dayjs(endDate).add(1, 'day');
      while (currentDay.isBefore(_endDate, 'day')) {
        const data = await callback(currentDay); //.then((data) => {
        result.push(data);
        currentDay = currentDay.add(1, 'day');
        // });
      }
      return result;
    };   

    async count(param: any): Promise<number> {
      return this.model.countDocuments(param);
    }
  }