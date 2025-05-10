import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import BanglesProductModel from "@/lib/models/BanglesProductSchema";
import BeadsProductModel from "@/lib/models/BeadsProductModel";
import OrderModel from "@/lib/models/OrderModel";
import ProductModel from "@/lib/models/ProductModel";
import SetsProductModel from "@/lib/models/SetsProductsModel";
import UserModel from "@/lib/models/UserModel";

export const GET = auth(async (...request: any) => {
  const [req, { params }] = request;
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const ordersCount = await OrderModel.countDocuments();
  const [productCount, setsCount, banglesCount, beadsCount] = await Promise.all(
    [
      ProductModel.countDocuments(),
      SetsProductModel.countDocuments(),
      BanglesProductModel.countDocuments(),
      BeadsProductModel.countDocuments(),
    ]
  );

  const productsCount = productCount + setsCount + banglesCount + beadsCount;
  const usersCount = await UserModel.countDocuments();

  const ordersPriceGroup = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: "$totalPrice" },
      },
    },
  ]);

  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 6); // Include today

  const salesData = await OrderModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(sevenDaysAgo.setHours(0, 0, 0, 0)),
          $lte: new Date(now.setHours(23, 59, 59, 999)),
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalOrders: { $sum: 1 },
        totalSales: { $sum: "$totalPrice" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const [
    productCategories,
    setsCategories,
    banglesCategories,
    beadsCategories,
  ] = await Promise.all([
    ProductModel.aggregate([
      {
        $group: {
          _id: "$productCategory",
          totalProducts: { $sum: 1 },
        },
      },
    ]),
    SetsProductModel.aggregate([
      {
        $group: {
          _id: "$productType",
          totalProducts: { $sum: 1 },
        },
      },
    ]),
    BanglesProductModel.aggregate([
      {
        $group: {
          _id: "$productType",
          totalProducts: { $sum: 1 },
        },
      },
    ]),
    BeadsProductModel.aggregate([
      {
        $match: { materialType: "Beads" },
      },
      {
        $group: {
          _id: "Beads",
          totalProducts: { $sum: 1 },
        },
      },
    ]),
  ]);

  // Combine all categories into one object by _id
  const mergedMap = new Map();

  // Helper function to add or increment
  const mergeIntoMap = (arr: any[]) => {
    for (const { _id, totalProducts } of arr) {
      if (mergedMap.has(_id)) {
        mergedMap.set(_id, mergedMap.get(_id) + totalProducts);
      } else {
        mergedMap.set(_id, totalProducts);
      }
    }
  };

  mergeIntoMap(productCategories);
  mergeIntoMap(setsCategories);
  mergeIntoMap(banglesCategories);
  mergeIntoMap(beadsCategories);

  // Convert map back to array
  const productsData = Array.from(mergedMap.entries())
    .map(([key, value]) => ({ _id: key, totalProducts: value }))
    .sort((a, b) => a._id.localeCompare(b._id));

  const usersData = await UserModel.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalUsers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return Response.json({
    ordersCount,
    productsCount,
    usersCount,
    ordersPrice,
    salesData,
    productsData,
    usersData,
  });
});
