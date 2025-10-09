/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, CheckCircle, AlertCircle, Download, X } from "lucide-react"

interface ImportResult {
  total: number
  success: number
  failed: number
  errors: string[]
}

export function ImportDataForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setError("")
      setImportResult(null)

      // Validate file type
      if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
        setError("File harus berformat CSV")
        return
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB")
        return
      }

      setFile(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      // Directly use the dropped file
      setError("")
      setImportResult(null)

      // Validate file type
      if (!droppedFile.name.toLowerCase().endsWith(".csv")) {
        setError("File harus berformat CSV")
        return
      }

      // Validate file size (max 5MB)
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB")
        return
      }

      setFile(droppedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setError("")

    try {
      // Simulate file upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Mock import result
      const mockResult: ImportResult = {
        total: 150,
        success: 142,
        failed: 8,
        errors: [
          "Baris 15: Format email tidak valid (john.doe@invalid)",
          "Baris 23: Nomor HP kosong",
          "Baris 45: Alamat terlalu pendek",
          "Baris 67: Penghasilan tidak valid",
          "Baris 89: Email duplikat (existing@email.com)",
          "Baris 102: Nama kosong",
          "Baris 134: Format nomor HP tidak valid",
          "Baris 147: Pekerjaan tidak valid",
        ],
      }

      setImportResult(mockResult)
    } catch (err) {
      setError("Terjadi kesalahan saat mengupload file")
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setImportResult(null)
    setError("")
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const downloadTemplate = () => {
    // In a real app, this would download an actual CSV template
    const csvContent =
      "nama,email,nomor_hp,alamat,pekerjaan,penghasilan\nJohn Doe,john@example.com,081234567890,Jl. Example No. 123,Karyawan Swasta,5000000-8000000"
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "template_nasabah.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (importResult) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-success" />
              Import Selesai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-foreground">{importResult.total}</div>
                <div className="text-sm text-muted-foreground">Total Data</div>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">{importResult.success}</div>
                <div className="text-sm text-muted-foreground">Berhasil</div>
              </div>
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <div className="text-2xl font-bold text-destructive">{importResult.failed}</div>
                <div className="text-sm text-muted-foreground">Gagal</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Tingkat Keberhasilan</span>
              <span className="text-sm text-muted-foreground">
                {Math.round((importResult.success / importResult.total) * 100)}%
              </span>
            </div>
            <Progress value={(importResult.success / importResult.total) * 100} className="mb-6" />

            {importResult.failed > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Error Details:</h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {importResult.errors.map((error, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">{error}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button onClick={resetForm} className="flex-1">
                Import File Lain
              </Button>
              <Button variant="glass-outline" className="flex-1 bg-transparent">
                Lihat Data Imported
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle>Template CSV</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Download template CSV untuk memastikan format data yang benar sebelum mengupload.
          </p>
          <Button variant="glass-outline" onClick={downloadTemplate} className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload File CSV</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />

            {file ? (
              <div className="space-y-4">
                <FileText className="mx-auto h-12 w-12 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary">CSV</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      resetForm()
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium text-foreground">Pilih file CSV atau drag & drop</p>
                  <p className="text-sm text-muted-foreground">Maksimal 5MB</p>
                </div>
              </div>
            )}
          </div>

          {isUploading && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mengupload file...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {file && !isUploading && (
            <div className="mt-6">
              <Button onClick={handleUpload} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload dan Import Data
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Panduan Import</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p>File harus berformat CSV dengan encoding UTF-8</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p>Kolom yang diperlukan: nama, email, nomor_hp, alamat, pekerjaan, penghasilan</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p>Email harus unik dan valid</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p>Nomor HP harus berformat Indonesia (08xxxxxxxxxx)</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p>Data yang berhasil diimport akan berstatus  dan perlu validasi</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
