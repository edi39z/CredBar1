"use client"

export function SocialProof() {
    const items = [
        "Kos Cempaka Putih",
        "Arisan Ceria Ibu-Ibu Kompleks",
        "Panitia Makrab FIB 2025",
        "Tim Futsal Minggu Pagi",
    ]
    return (
        <section className="px-4">
            <div className="mx-auto max-w-7xl">
                <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 px-4 md:px-6 py-3 md:py-4 shadow-lg">
                    <p className="text-center text-sm md:text-base font-medium">Dipercaya oleh komunitas seperti Anda</p>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-foreground/70 text-xs md:text-sm">
                        {items.map((label) => (
                            <div
                                key={label}
                                className="px-2 py-2 rounded-lg border border-white/10 bg-white/5"
                                aria-label={`Logo ${label}`}
                                role="img"
                            >
                                {label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
