type BuildQueryOptions<T> = {
  searchable?: (keyof T)[];
  filterable?: (keyof T)[];
  defaultSize?: number;
};

export function buildQuery<T>(
  query: any,
  options: BuildQueryOptions<T>
) {
  const page = Math.max(Number(query.page) || 1, 1);
  const size = Math.min(Number(query.size) || options.defaultSize || 10, 100);
  const skip = (page - 1) * size;

  const where: any = {};
  const AND: any[] = [];

  if (query.search && options.searchable?.length) {
    AND.push({
      OR: options.searchable.map((field) => ({
        [field]: {
          contains: query.search,
          mode: "insensitive",
        },
      })),
    });
  }

  options.filterable?.forEach((field) => {
    if (query[field as string] !== undefined) {
      AND.push({
        [field]: query[field as string],
      });
    }
  });

  if (AND.length) {
    where.AND = AND;
  }

  return {
    where,
    skip,
    take: size,
    meta: {
      page,
      size,
    },
  };
}

export function serializeBigInt<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}
