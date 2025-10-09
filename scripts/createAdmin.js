/**
 * Admin 계정 생성 스크립트
 */

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdminAccount() {
    try {
        // 1. admin@fleecat.com 계정이 이미 있는지 확인
        const existingMember = await prisma.member.findUnique({
            where: { member_email: 'admin@fleecat.com' }
        });

        if (existingMember) {
            console.log('✅ admin@fleecat.com 계정이 이미 존재합니다.');

            // role이 admin이 아니면 업데이트
            if (existingMember.member_account_role !== 'admin') {
                await prisma.member.update({
                    where: { member_id: existingMember.member_id },
                    data: { member_account_role: 'admin' }
                });
                console.log('✅ 계정 권한을 admin으로 변경했습니다.');
            }

            console.log('\n📧 이메일: admin@fleecat.com');
            console.log('🔑 비밀번호: admin1234');
            return;
        }

        // 2. 새 admin 계정 생성
        const hashedPassword = await bcrypt.hash('admin1234', 10);

        const newAdmin = await prisma.member.create({
            data: {
                member_email: 'admin@fleecat.com',
                member_password: hashedPassword,
                member_name: '관리자',
                member_nickname: 'admin',
                member_phone: '01012345678',
                member_account_role: 'admin',
                member_status: 'active'
            }
        });

        console.log('✅ Admin 계정이 생성되었습니다!');
        console.log('\n📧 이메일: admin@fleecat.com');
        console.log('🔑 비밀번호: admin1234');
        console.log(`\n🆔 Member ID: ${newAdmin.member_id}`);

    } catch (error) {
        console.error('❌ 에러 발생:', error.message);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

createAdminAccount();
