import { Query } from "mongoose";
import { excludFields } from "../modules/tours/tour.const.varriables";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter = { ...this.query };
    for (const field of excludFields) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }
    return this;
  }

  search(SearchableField: string[]): this {
    const searchItem = this.query.searchIem || "";
    const searchQuery = {
      $or: SearchableField.map((field) => ({
        [field]: { $regex: searchItem, $options: "i" },
      })),
    };
    this.modelQuery = this.modelQuery.find(searchQuery);
    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  select(): this {
    const fields = this.query.field
      ? this.query.field.split(",").join(" ")
      : "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  pagginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 5;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const totalDocument = await this.modelQuery.model.countDocuments();

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 5;
    const totalPages = Math.ceil(totalDocument / limit);

    return { page, limit, total: totalDocument, totalPages };
  }
}