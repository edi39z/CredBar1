"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { X, Search, CheckCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface RoomMember {
  id: string
  userId: number
  roomId: number
  user: {
    id: number
    name: string
    email: string
  }
  status: string
}

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  groupMembers: RoomMember[]
  existingMemberIds: string[] // IDs of members already in the iuran
  onAddMember: (memberId: string) => Promise<void>
  isLoading?: boolean
}

export function AddMemberModal({
  isOpen,
  onClose,
  groupMembers,
  existingMemberIds,
  onAddMember,
  isLoading = false,
}: AddMemberModalProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter available members (exclude those already added to this iuran)
  const availableMembers = useMemo(() => {
    return groupMembers.filter((member) => !existingMemberIds.includes(String(member.id)))
  }, [groupMembers, existingMemberIds])

  // Filter by search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return availableMembers

    const query = searchQuery.toLowerCase()
    return availableMembers.filter(
      (member) => member.user.name.toLowerCase().includes(query) || member.user.email.toLowerCase().includes(query),
    )
  }, [availableMembers, searchQuery])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMemberId) {
      alert("Pilih anggota terlebih dahulu")
      return
    }

    await onAddMember(selectedMemberId)
    setSelectedMemberId("")
    setSearchQuery("")
  }

  const selectedMember = availableMembers.find((m) => String(m.id) === selectedMemberId)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-0 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Tambah Anggota Iuran</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          {availableMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium">Semua anggota grup sudah ditambahkan ke iuran ini</p>
              <p className="text-xs text-gray-500 mt-2">Tidak ada anggota baru yang tersedia</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Cari Anggota</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari nama atau email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Members List */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Anggota dari Grup</label>
                <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
                  {filteredMembers.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-sm text-gray-500">
                        {searchQuery ? "Tidak ada anggota yang cocok" : "Tidak ada anggota tersedia"}
                      </p>
                    </div>
                  ) : (
                    filteredMembers.map((member) => (
                      <div
                        key={member.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedMemberId === String(member.id)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedMemberId(String(member.id))}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{member.user.name}</p>
                            <p className="text-xs text-gray-600">{member.user.email}</p>
                          </div>
                          {selectedMemberId === String(member.id) && (
                            <CheckCircle size={20} className="text-blue-500 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Selected Member Info */}
              {selectedMember && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-blue-700 mb-1">Anggota Terpilih:</p>
                  <p className="font-semibold text-blue-900">{selectedMember.user.name}</p>
                  <p className="text-xs text-blue-600">{selectedMember.user.email}</p>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Info:</strong> Hanya anggota grup yang belum ditambahkan yang dapat tampil di sini.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
                  disabled={isLoading}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedMemberId || isLoading}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Menambahkan..." : "Tambah Anggota"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  )
}
