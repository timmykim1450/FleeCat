const prisma = require('../config/database');

/**
 * Category Repository
 * 계층형 카테고리 데이터 접근 계층
 */

/**
 * 전체 카테고리 조회 (계층형 구조)
 * @param {Object} options - 조회 옵션
 * @param {boolean} [options.includeInactive=false] - 비활성 카테고리 포함 여부
 * @returns {Promise<Array>} 카테고리 목록
 */
async function findAll(options = {}) {
  try {
    const { includeInactive = false } = options;

    const where = {};
    if (!includeInactive) {
      where.category_is_active = true;
    }

    return await prisma.category.findMany({
      where,
      include: {
        parent_category: true,
        child_categories: {
          where: includeInactive ? {} : { category_is_active: true }
        }
      },
      orderBy: [
        { category_depth: 'asc' },
        { category_order: 'asc' }
      ]
    });
  } catch (error) {
    throw new Error(`Failed to find all categories: ${error.message}`);
  }
}

/**
 * ID로 카테고리 조회
 * @param {number} categoryId - 카테고리 ID
 * @returns {Promise<Object|null>} 카테고리 정보 또는 null
 */
async function findById(categoryId) {
  try {
    return await prisma.category.findUnique({
      where: { category_id: BigInt(categoryId) },
      include: {
        parent_category: true,
        child_categories: true
      }
    });
  } catch (error) {
    throw new Error(`Failed to find category by ID: ${error.message}`);
  }
}

/**
 * 부모 카테고리로 자식 카테고리 조회
 * @param {number|null} parentId - 부모 카테고리 ID (null이면 최상위 카테고리)
 * @returns {Promise<Array>} 자식 카테고리 목록
 */
async function findByParentId(parentId) {
  try {
    const where = {
      parent_category_id: parentId ? BigInt(parentId) : null,
      category_is_active: true
    };

    return await prisma.category.findMany({
      where,
      orderBy: { category_order: 'asc' }
    });
  } catch (error) {
    throw new Error(`Failed to find categories by parent ID: ${error.message}`);
  }
}

/**
 * 카테고리 생성
 * @param {Object} categoryData - 카테고리 데이터
 * @param {string} categoryData.category_name - 카테고리 이름
 * @param {number} [categoryData.parent_category_id] - 부모 카테고리 ID
 * @param {string} [categoryData.category_description] - 설명
 * @param {number} [categoryData.category_order=0] - 정렬 순서
 * @returns {Promise<Object>} 생성된 카테고리
 */
async function create(categoryData) {
  try {
    const {
      category_name,
      parent_category_id,
      category_description,
      category_order = 0
    } = categoryData;

    // 부모 카테고리가 있으면 depth와 path 계산
    let depth = 1;
    let path = null;

    if (parent_category_id) {
      const parent = await findById(parent_category_id);
      if (!parent) {
        throw new Error('Parent category not found');
      }
      depth = parent.category_depth + 1;
      path = parent.category_path
        ? `${parent.category_path}/${parent_category_id}`
        : `${parent_category_id}`;
    }

    const category = await prisma.category.create({
      data: {
        category_name,
        parent_category_id: parent_category_id ? BigInt(parent_category_id) : null,
        category_description: category_description || null,
        category_depth: depth,
        category_order,
        category_path: path,
        category_is_active: true
      },
      include: {
        parent_category: true
      }
    });

    // 생성 후 path에 자신의 ID 추가
    const updatedPath = path ? `${path}/${category.category_id}` : `${category.category_id}`;

    return await prisma.category.update({
      where: { category_id: category.category_id },
      data: { category_path: updatedPath },
      include: {
        parent_category: true
      }
    });
  } catch (error) {
    throw new Error(`Failed to create category: ${error.message}`);
  }
}

/**
 * 카테고리 수정
 * @param {number} categoryId - 카테고리 ID
 * @param {Object} updateData - 수정할 데이터
 * @param {string} [updateData.category_name] - 카테고리 이름
 * @param {string} [updateData.category_description] - 설명
 * @param {number} [updateData.category_order] - 정렬 순서
 * @param {boolean} [updateData.category_is_active] - 활성 상태
 * @returns {Promise<Object>} 수정된 카테고리
 */
async function update(categoryId, updateData) {
  try {
    return await prisma.category.update({
      where: { category_id: BigInt(categoryId) },
      data: updateData,
      include: {
        parent_category: true,
        child_categories: true
      }
    });
  } catch (error) {
    throw new Error(`Failed to update category: ${error.message}`);
  }
}

/**
 * 카테고리 삭제 (하위 카테고리도 CASCADE 삭제)
 * @param {number} categoryId - 카테고리 ID
 * @returns {Promise<Object>} 삭제된 카테고리
 */
async function deleteById(categoryId) {
  try {
    // Prisma 스키마에서 CASCADE 설정되어 있어 자동으로 하위 카테고리도 삭제됨
    return await prisma.category.delete({
      where: { category_id: BigInt(categoryId) }
    });
  } catch (error) {
    throw new Error(`Failed to delete category: ${error.message}`);
  }
}

/**
 * 하위 카테고리 개수 조회
 * @param {number} categoryId - 카테고리 ID
 * @returns {Promise<number>} 하위 카테고리 개수
 */
async function countChildren(categoryId) {
  try {
    return await prisma.category.count({
      where: { parent_category_id: BigInt(categoryId) }
    });
  } catch (error) {
    throw new Error(`Failed to count child categories: ${error.message}`);
  }
}

/**
 * 카테고리에 속한 상품 개수 조회
 * @param {number} categoryId - 카테고리 ID
 * @returns {Promise<number>} 상품 개수
 */
async function countProducts(categoryId) {
  try {
    return await prisma.product.count({
      where: { category_id: BigInt(categoryId) }
    });
  } catch (error) {
    throw new Error(`Failed to count products in category: ${error.message}`);
  }
}

module.exports = {
  findAll,
  findById,
  findByParentId,
  create,
  update,
  deleteById,
  countChildren,
  countProducts
};
