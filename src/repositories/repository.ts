import { Model, Types } from 'mongoose';

// single model methods
export default abstract class Repository<T> {
  model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  find(data?: Partial<T>) {
    const doc = data || {};
    return this.model.find(doc);
  }

  findOne(data?: string | Partial<T>) {
    if (typeof data === 'object') return this.model.findOne(data);
    return this.model.findById(data);
  }

  findMany(data: string[]) {
    return this.model.find({
      _id: { $in: data.map((val) => new Types.ObjectId(val)) }
    });
  }

  update(query: string | Partial<T>, data: Partial<T>) {
    if (typeof query === 'object')
      return this.model.findOneAndUpdate(query, data, { new: true });
    return this.model.findByIdAndUpdate(query, data, { new: true });
  }

  upsert(query: string | Partial<T>, data: Partial<T>) {
    if (typeof query === 'object')
      return this.model.findOneAndUpdate(query, data, {
        new: true,
        upsert: true
      });
    return this.model.findByIdAndUpdate(query, data, {
      new: true,
      upsert: true
    });
  }

  updateMany(query: Partial<T>, data: Partial<T>) {
    return this.model.updateMany(query, data);
  }

  create(data: T) {
    return this.model.create(data);
  }

  delete(data: string | Partial<T>) {
    if (typeof data === 'object') return this.model.findOneAndDelete(data);
    return this.model.findByIdAndDelete(data, { new: true });
  }

  load(id: string, data: Partial<T> | Partial<T>[]) {
    if (Array.isArray(data)) {
      return this.model.findByIdAndUpdate(
        id,
        { $push: { $each: data } },
        { new: true }
      );
    }
    return this.model.findByIdAndUpdate(id, { $push: data }, { new: true });
  }

  unload(
    id: string,
    data:
      | Record<string, Record<'_id', string | Record<'$in', string[]>>>
      | Record<string, string>
  ) {
    return this.model.findByIdAndUpdate(id, { $pull: data }, { new: true });
  }

  increment(
    id: string | Types.ObjectId | object,
    data: Record<keyof Partial<T>, number>
  ) {
    if (typeof id === 'object') {
      return this.model.findOneAndUpdate(id, { $inc: data }, { new: true });
    }
    return this.model.findByIdAndUpdate(id, { $inc: data }, { new: true });
  }

}