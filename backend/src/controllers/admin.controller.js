import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';

export const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    res.status(200).json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, passwordHash, address, role },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'createdAt', order = 'desc' } = req.query;

    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };
    if (role) where.role = role;

    const users = await prisma.user.findMany({
      where,
      orderBy: { [sortBy]: order },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        store: {
          include: {
            ratings: true,
          }
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let response = { ...user };
    
    if (user.role === 'STORE_OWNER' && user.store) {
      const ratings = user.store.ratings;
      const avgRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.ratingValue, 0) / ratings.length 
        : 0;
      
      delete response.store.ratings;
      response.store.averageRating = avgRating;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const existingStore = await prisma.store.findUnique({ where: { email } });
    if (existingStore) {
      return res.status(409).json({ message: 'Store email already exists' });
    }

    if (ownerId) {
      const owner = await prisma.user.findUnique({ where: { id: ownerId } });
      if (!owner || owner.role !== 'STORE_OWNER') {
        return res.status(400).json({ message: 'Invalid owner: User not found or not a STORE_OWNER' });
      }

      const existingOwnerStore = await prisma.store.findUnique({ where: { ownerId } });
      if (existingOwnerStore) {
        return res.status(400).json({ message: 'User is already an owner of another store' });
      }
    }

    const store = await prisma.store.create({
      data: { name, email, address, ownerId },
    });

    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'createdAt', order = 'desc' } = req.query;

    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };

    const stores = await prisma.store.findMany({
      where,
      orderBy: { [sortBy]: order },
      include: {
        ratings: true,
      },
    });

    const storesWithRating = stores.map((store) => {
      const avgRating = store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.ratingValue, 0) / store.ratings.length
        : 0;
      
      const { ratings, ...storeData } = store;
      return { ...storeData, averageRating: avgRating };
    });

    res.status(200).json(storesWithRating);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
