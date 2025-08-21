"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const tour_const_varriables_1 = require("../modules/tours/tour.const.varriables");
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    filter() {
        const filter = Object.assign({}, this.query);
        for (const field of tour_const_varriables_1.excludFields) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filter[field];
        }
        return this;
    }
    search(SearchableField) {
        const searchItem = this.query.searchIem || "";
        const searchQuery = {
            $or: SearchableField.map((field) => ({
                [field]: { $regex: searchItem, $options: "i" },
            })),
        };
        this.modelQuery = this.modelQuery.find(searchQuery);
        return this;
    }
    sort() {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    select() {
        const fields = this.query.field
            ? this.query.field.split(",").join(" ")
            : "";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    pagginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 5;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    build() {
        return this.modelQuery;
    }
    getMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalDocument = yield this.modelQuery.model.countDocuments();
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 5;
            const totalPages = Math.ceil(totalDocument / limit);
            return { page, limit, total: totalDocument, totalPages };
        });
    }
}
exports.QueryBuilder = QueryBuilder;
