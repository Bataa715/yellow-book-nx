import { Request, Response } from 'express';
import prisma from '../lib/prisma';

/**
 * GET /api/categories
 * Retrieves all categories
 */
export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await (prisma.category as any).findMany({
      orderBy: [
        { isPrimary: 'desc' }, // Primary categories first
        { order: 'asc' }, // Then by order
        { name: 'asc' }, // Finally by name
      ],
    });

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * GET /api/categories/primary
 * Retrieves only primary categories for home page
 */
export async function getPrimaryCategories(req: Request, res: Response) {
  try {
    const primaryCategories = await (prisma.category as any).findMany({
      where: { isPrimary: true },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    res.json(primaryCategories);
  } catch (error) {
    console.error('Error fetching primary categories:', error);
    res.status(500).json({
      error: 'Failed to fetch primary categories',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * POST /api/categories
 * Creates a new category
 */
export async function createCategory(req: Request, res: Response) {
  try {
    const { name, icon } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'name is required',
      });
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: { name },
    });

    if (existingCategory) {
      return res.status(400).json({
        error: 'Category already exists',
        message: `Category "${name}" already exists`,
      });
    }

    // Create the new category
    const newCategory = await (prisma.category as any).create({
      data: {
        name,
        icon: icon || 'more-horizontal', // Default icon
        isPrimary: req.body.isPrimary || false,
        order: req.body.order || null,
      },
    });

    res.status(201).json({
      data: newCategory,
      message: 'Category created successfully',
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      error: 'Failed to create category',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * PUT /api/categories/:id
 * Updates a category by ID
 */
export async function updateCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, icon } = req.body;

    // Check if the category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({
        error: 'Category not found',
        message: `Category with ID ${id} does not exist`,
      });
    }

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'name is required',
      });
    }

    // Check if another category with the same name exists
    if (name !== existingCategory.name) {
      const duplicateCategory = await prisma.category.findFirst({
        where: {
          name,
          id: { not: id },
        },
      });

      if (duplicateCategory) {
        return res.status(400).json({
          error: 'Category already exists',
          message: `Category "${name}" already exists`,
        });
      }
    }

    // Update the category
    const updatedCategory = await (prisma.category as any).update({
      where: { id },
      data: {
        name,
        icon: icon || existingCategory.icon,
        ...(req.body.isPrimary !== undefined && { isPrimary: req.body.isPrimary }),
        ...(req.body.order !== undefined && { order: req.body.order }),
      },
    });

    res.json({
      data: updatedCategory,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      error: 'Failed to update category',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * GET /api/categories/:id
 * Fetches a single category by ID
 */
export async function getCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({
        error: 'Category not found',
        message: `Category with ID ${id} does not exist`,
      });
    }

    res.json({
      data: category,
      message: 'Category retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      error: 'Failed to fetch category',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * DELETE /api/categories/:id
 * Deletes a category by ID
 */
export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check if the category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({
        error: 'Category not found',
        message: `Category with ID ${id} does not exist`,
      });
    }

    // Delete the category
    await prisma.category.delete({
      where: { id },
    });

    res.json({
      message: 'Category deleted successfully',
      data: { id },
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      error: 'Failed to delete category',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
