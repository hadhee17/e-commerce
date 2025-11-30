class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Build a proper Mongo filter object that supports price[gte]=100 etc.
    const mongoFilter = {};
    Object.entries(queryObj).forEach(([key, val]) => {
      // handle bracketed operators like price[gte]
      const m = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);
      const value = typeof val === "string" && !isNaN(val) ? Number(val) : val;
      if (m) {
        const field = m[1];
        const op = `$${m[2]}`;
        mongoFilter[field] = mongoFilter[field] || {};
        mongoFilter[field][op] = value;
      } else {
        mongoFilter[key] = value;
      }
    });

    if (Object.keys(mongoFilter).length) {
      this.query = this.query.find(mongoFilter);
    }

    // optional logs for debugging
    console.log("REQ QUERY:", this.queryString);
    console.log("MONGO FILTER:", mongoFilter);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
