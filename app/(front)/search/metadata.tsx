export async function generateMetadata({
  searchParams: {
    q = "all",
    productCategory = "all",
    price = "all",
    rating = "all",
  },
}: {
  searchParams: {
    q: string;
    productCategory: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  };
}) {
  if (
    (q !== "all" && q !== "") ||
    productCategory !== "all" ||
    rating !== "all" ||
    price !== "all"
  ) {
    return {
      title: `Search ${q !== "all" ? q : ""}
            ${productCategory !== "all" ? ` : ProductCategory ${productCategory}` : ""}
            ${price !== "all" ? ` : Price ${price}` : ""}
            ${rating !== "all" ? ` : Rating ${rating}` : ""}`,
    };
  } else {
    return {
      title: "Search Products",
    };
  }
}
