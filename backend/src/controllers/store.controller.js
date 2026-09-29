import prisma from '../config/db.js';

export const getStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'createdAt', order = 'desc' } = req.query;
    const { userId } = req.user;

    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };

    const stores = await prisma.store.findMany({
      where,
      orderBy: { [sortBy]: order },
      include: {
        ratings: true,
      },
    });

    const storesData = stores.map((store) => {
      const userRatingObj = store.ratings.find(r => r.userId === userId);
      
      const avgRating = store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.ratingValue, 0) / store.ratings.length
        : 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: avgRating,
        myRating: userRatingObj ? userRatingObj.ratingValue : null,
      };
    });

    res.status(200).json(storesData);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const submitRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { ratingValue } = req.body;
    const { userId } = req.user;

    const storeId = parseInt(id);

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    if (existingRating) {
      return res.status(409).json({ message: 'You have already rated this store' });
    }

    const rating = await prisma.rating.create({
      data: {
        userId,
        storeId,
        ratingValue,
      },
    });

    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const modifyRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { ratingValue } = req.body;
    const { userId } = req.user;

    const storeId = parseInt(id);

    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    const rating = await prisma.rating.update({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      data: {
        ratingValue,
      },
    });

    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
