const prisma = require('../../config/database');

/**
 * Admin Tenant Repository
 * 관리자용 판매사 관리 데이터 접근 계층
 */

/**
 * 판매사 목록 조회 (페이징, 필터링, 검색)
 * @param {Object} options - 조회 옵션
 * @param {number} [options.page=1] - 페이지 번호
 * @param {number} [options.limit=20] - 페이지당 항목 수
 * @param {string} [options.status] - 판매사 상태 필터 (pending/approved/rejected/suspended)
 * @param {string} [options.search] - 검색어 (판매사명, 사업자등록번호)
 * @returns {Promise<Object>} { tenants, total, page, totalPages }
 */
async function findAll(options = {}) {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search
    } = options;

    const skip = (page - 1) * limit;
    const where = {};

    // 상태 필터
    if (status) {
      where.tenant_status = status;
    }

    // 검색어 (판매사명, 사업자등록번호)
    if (search) {
      where.OR = [
        { tenant_name: { contains: search, mode: 'insensitive' } },
        {
          tenant_detail: {
            tenant_detail_business_number: { contains: search }
          }
        }
      ];
    }

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { tenant_created_at: 'desc' },
        select: {
          tenant_id: true,
          tenant_name: true,
          tenant_status: true,
          tenant_created_at: true,
          tenant_updated_at: true,
          tenant_detail: {
            select: {
              tenant_detail_business_number: true,
              tenant_detail_phone: true,
              tenant_detail_approved_at: true
            }
          },
          _count: {
            select: {
              tenant_members: true,
              products: true
            }
          }
        }
      }),
      prisma.tenant.count({ where })
    ]);

    return {
      tenants,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    throw new Error(`Failed to find all tenants: ${error.message}`);
  }
}

/**
 * 판매사 상세 조회 (관리자용 - 모든 정보 포함)
 * @param {number} tenantId - 판매사 ID
 * @returns {Promise<Object|null>} 판매사 정보 또는 null
 */
async function findByIdWithDetails(tenantId) {
  try {
    return await prisma.tenant.findUnique({
      where: { tenant_id: BigInt(tenantId) },
      include: {
        tenant_detail: true,
        tenant_members: {
          include: {
            member: {
              select: {
                member_id: true,
                member_email: true,
                member_name: true,
                member_phone: true,
                member_status: true
              }
            }
          }
        },
        _count: {
          select: {
            products: true,
            tenant_members: true
          }
        }
      }
    });
  } catch (error) {
    throw new Error(`Failed to find tenant by ID: ${error.message}`);
  }
}

/**
 * 판매사 승인
 * @param {number} tenantId - 판매사 ID
 * @param {Object} approvalData - 승인 데이터
 * @param {string} [approvalData.admin_memo] - 관리자 메모
 * @returns {Promise<Object>} 승인된 판매사 정보
 */
async function approve(tenantId, approvalData = {}) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. tenant_status를 'approved'로 변경
      const tenant = await tx.tenant.update({
        where: { tenant_id: BigInt(tenantId) },
        data: { tenant_status: 'approved' },
        select: {
          tenant_id: true,
          tenant_name: true,
          tenant_status: true,
          tenant_updated_at: true
        }
      });

      // 2. tenant_detail 업데이트 (승인 날짜, 메모)
      await tx.tenantDetail.update({
        where: { tenant_id: BigInt(tenantId) },
        data: {
          tenant_detail_approved_at: new Date(),
          tenant_detail_admin_memo: approvalData.admin_memo || null
        }
      });

      // 3. 해당 판매사의 TenantMember들에게 판매 권한 부여
      await tx.tenantMember.updateMany({
        where: { tenant_id: BigInt(tenantId) },
        data: { tenant_member_can_sell: true }
      });

      return tenant;
    });
  } catch (error) {
    throw new Error(`Failed to approve tenant: ${error.message}`);
  }
}

/**
 * 판매사 거절
 * @param {number} tenantId - 판매사 ID
 * @param {string} rejectReason - 거절 사유
 * @returns {Promise<Object>} 거절된 판매사 정보
 */
async function reject(tenantId, rejectReason) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. tenant_status를 'rejected'로 변경
      const tenant = await tx.tenant.update({
        where: { tenant_id: BigInt(tenantId) },
        data: { tenant_status: 'rejected' },
        select: {
          tenant_id: true,
          tenant_name: true,
          tenant_status: true,
          tenant_updated_at: true
        }
      });

      // 2. tenant_detail에 거절 사유 기록
      await tx.tenantDetail.update({
        where: { tenant_id: BigInt(tenantId) },
        data: {
          tenant_detail_reject_reason: rejectReason,
          tenant_detail_rejected_at: new Date()
        }
      });

      // 3. 해당 판매사의 TenantMember들의 판매 권한 제거
      await tx.tenantMember.updateMany({
        where: { tenant_id: BigInt(tenantId) },
        data: { tenant_member_can_sell: false }
      });

      return tenant;
    });
  } catch (error) {
    throw new Error(`Failed to reject tenant: ${error.message}`);
  }
}

/**
 * 판매사 상태 변경
 * @param {number} tenantId - 판매사 ID
 * @param {string} status - 변경할 상태 (pending/approved/rejected/suspended)
 * @returns {Promise<Object>} 수정된 판매사 정보
 */
async function updateStatus(tenantId, status) {
  try {
    return await prisma.tenant.update({
      where: { tenant_id: BigInt(tenantId) },
      data: { tenant_status: status },
      select: {
        tenant_id: true,
        tenant_name: true,
        tenant_status: true,
        tenant_updated_at: true
      }
    });
  } catch (error) {
    throw new Error(`Failed to update tenant status: ${error.message}`);
  }
}

/**
 * 판매사 통계 조회
 * @returns {Promise<Object>} 통계 정보
 */
async function getStatistics() {
  try {
    const [
      totalTenants,
      pendingTenants,
      approvedTenants,
      rejectedTenants,
      suspendedTenants,
      recentTenants
    ] = await Promise.all([
      // 전체 판매사 수
      prisma.tenant.count(),

      // 승인 대기 중인 판매사 수
      prisma.tenant.count({
        where: { tenant_status: 'pending' }
      }),

      // 승인된 판매사 수
      prisma.tenant.count({
        where: { tenant_status: 'approved' }
      }),

      // 거절된 판매사 수
      prisma.tenant.count({
        where: { tenant_status: 'rejected' }
      }),

      // 정지된 판매사 수
      prisma.tenant.count({
        where: { tenant_status: 'suspended' }
      }),

      // 최근 등록 판매사 (7일 이내)
      prisma.tenant.count({
        where: {
          tenant_created_at: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    return {
      totalTenants,
      pendingTenants,
      approvedTenants,
      rejectedTenants,
      suspendedTenants,
      recentTenants
    };
  } catch (error) {
    throw new Error(`Failed to get tenant statistics: ${error.message}`);
  }
}

module.exports = {
  findAll,
  findByIdWithDetails,
  approve,
  reject,
  updateStatus,
  getStatistics
};
