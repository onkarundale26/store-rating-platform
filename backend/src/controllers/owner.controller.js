import prisma from '../config/db.js';

export const getDashboard = async (req, res) => {
  try {
    const { userId } = req.user;

    const store = await prisma.store.findUnique({
      where: { ownerId: userId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' }
        },
      },
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found for this owner' });
    }

    const avgRating = store.ratings.length > 0
      ? store.ratings.reduce((sum, r) => sum + r.ratingValue, 0) / store.ratings.length
      : 0;

    const formattedRatings = store.ratings.map(r => ({
      userName: r.user.name,
      userEmail: r.user.email,
      ratingValue: r.ratingValue,
      submittedAt: r.createdAt,
    }));

    res.status(200).json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        createdAt: store.createdAt,
      },
      averageRating: avgRating,
      ratings: formattedRatings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
