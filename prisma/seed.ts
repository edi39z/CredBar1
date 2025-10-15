import {
    PrismaClient,
    InvoiceStatus,
    MemberRole,
    RoomType,
    PaymentMethod,
    DebtStatus,
    NotificationPriority,
    DueFrequency,
} from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    // Users
    const admin = await prisma.user.upsert({
        where: { email: "admin@credbar.local" },
        update: {},
        create: {
            email: "admin@credbar.local",
            name: "Admin CredBar",
            // NOTE: in production, store hashed password (e.g., bcrypt)
            password: "admin123",
        },
    })

    const user = await prisma.user.upsert({
        where: { email: "user@credbar.local" },
        update: {},
        create: {
            email: "user@credbar.local",
            name: "Pengguna CredBar",
            password: "user123",
        },
    })

    // Rooms
    const room1 = await prisma.room.create({
        data: {
            name: "Kos Mawar",
            type: RoomType.BOARDING,
            description: "Iuran kos bulanan dengan reminder otomatis",
            inviteCode: "KOS-MAWR",
            createdById: admin.id,
        },
    })

    const room2 = await prisma.room.create({
        data: {
            name: "Arisan Keluarga",
            type: RoomType.ARISAN,
            description: "Arisan keluarga tiap bulan ke-3",
            inviteCode: "ARIS-FAM",
            createdById: admin.id,
        },
    })

    // Memberships
    await prisma.roomMember.createMany({
        data: [
            { roomId: room1.id, userId: admin.id, role: MemberRole.ADMIN },
            { roomId: room1.id, userId: user.id, role: MemberRole.MEMBER },
            { roomId: room2.id, userId: admin.id, role: MemberRole.ADMIN },
            { roomId: room2.id, userId: user.id, role: MemberRole.MEMBER },
        ],
        skipDuplicates: true,
    })

    // Dues (Iuran)
    const dueKos = await prisma.due.create({
        data: {
            roomId: room1.id,
            name: "Iuran Kos Bulanan",
            description: "Iuran kamar dan listrik",
            amount: 750000,
            isRecurring: true,
            frequency: DueFrequency.MONTHLY,
            interval: 1,
            startDate: new Date(),
            nextDueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 28),
        },
    })

    const dueArisan = await prisma.due.create({
        data: {
            roomId: room2.id,
            name: "Arisan Bulanan",
            description: "Arisan keluarga rutin",
            amount: 150000,
            isRecurring: true,
            frequency: DueFrequency.MONTHLY,
            interval: 1,
            startDate: new Date(),
            nextDueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
        },
    })

    // Invoices
    const inv1 = await prisma.invoice.create({
        data: {
            id: undefined, // cuid auto
            code: "INV-0001",
            roomId: room1.id,
            memberId: user.id,
            dueId: dueKos.id,
            description: "Iuran kos bulan ini",
            amount: 750000,
            status: InvoiceStatus.PENDING,
            dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 28),
            sentAt: new Date(),
        },
    })

    const inv2 = await prisma.invoice.create({
        data: {
            code: "INV-0002",
            roomId: room1.id,
            memberId: user.id,
            dueId: dueKos.id,
            description: "Iuran kos bulan lalu",
            amount: 750000,
            status: InvoiceStatus.OVERDUE,
            dueDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 28),
            sentAt: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 20),
        },
    })

    const inv3 = await prisma.invoice.create({
        data: {
            code: "INV-0003",
            roomId: room2.id,
            memberId: user.id,
            dueId: dueArisan.id,
            description: "Arisan bulan ini",
            amount: 150000,
            status: InvoiceStatus.PAID,
            dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
            sentAt: new Date(),
            paidDate: new Date(),
            paymentMethod: PaymentMethod.TRANSFER,
        },
    })

    // Payments (for paid invoice)
    await prisma.payment.create({
        data: {
            invoiceId: inv3.id,
            amount: 150000,
            method: PaymentMethod.TRANSFER,
            paidAt: new Date(),
            note: "Lunas",
            createdById: admin.id,
        },
    })

    // Debts (hutang/piutang)
    await prisma.debt.createMany({
        data: [
            {
                roomId: room1.id,
                creditorId: admin.id,
                debtorId: user.id,
                amount: 100000,
                description: "Patungan galon",
                dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 30),
                status: DebtStatus.PENDING,
            },
            {
                roomId: room1.id,
                creditorId: user.id,
                debtorId: admin.id,
                amount: 50000,
                description: "Ganti listrik",
                dueDate: null,
                status: DebtStatus.PAID,
            },
        ],
        skipDuplicates: true,
    })

    // Notifications
    await prisma.notification.createMany({
        data: [
            {
                userId: user.id,
                roomId: room1.id,
                type: "PAYMENT_DUE",
                priority: NotificationPriority.NORMAL,
                title: "Jatuh tempo iuran kos",
                message: "Segera bayar iuran kos bulan ini.",
                amount: 750000,
            },
            {
                userId: user.id,
                roomId: room1.id,
                type: "PAYMENT_OVERDUE",
                priority: NotificationPriority.HIGH,
                title: "Iuran kos terlambat",
                message: "Iuran kos bulan lalu belum dibayar.",
                amount: 750000,
            },
            {
                userId: user.id,
                roomId: room2.id,
                type: "INVOICE_SENT",
                priority: NotificationPriority.NORMAL,
                title: "Invoice arisan terkirim",
                message: "Invoice arisan bulan ini telah dikirim.",
                amount: 150000,
            },
        ],
        skipDuplicates: true,
    })

    // Reminder settings (global)
    await prisma.reminderSetting.upsert({
        where: { userId_roomId: { userId: user.id, roomId: 0 } }, // kalau mau pakai dummy ID
        update: {},
        create: {
            userId: user.id,
            roomId: 0, // ganti sesuai roomId yang valid
            paymentReminders: true,
            overdueAlerts: true,
            memberActivity: true,
            emailNotifications: true,
            pushNotifications: false,
        },
    })

    // Invite codes
    await prisma.invite.createMany({
        data: [
            { roomId: room1.id, code: "JOIN-KOS", createdById: admin.id },
            { roomId: room2.id, code: "JOIN-ARIS", createdById: admin.id },
        ],
        skipDuplicates: true,
    })

    console.log("[v0] Seed complete.")
}

main()
    .catch((e) => {
        console.error("[v0] Seed error:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
