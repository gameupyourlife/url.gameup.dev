'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { QrCode, Download, Copy, Check } from 'lucide-react'
import QRCode from 'qrcode'

interface QRCodeGeneratorProps {
  shortCode: string
}

export function QRCodeGenerator({ shortCode }: QRCodeGeneratorProps) {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateQRCode = async () => {
    setIsGenerating(true)
    try {
      const fullUrl = `${window.location.origin}/${shortCode}`
      const qrCodeDataURL = await QRCode.toDataURL(fullUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCodeDataURL(qrCodeDataURL)
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeDataURL) return
    
    const link = document.createElement('a')
    link.download = `qr-code-${shortCode}.png`
    link.href = qrCodeDataURL
    link.click()
  }

  const copyQRCode = async () => {
    if (!qrCodeDataURL) return
    
    try {
      const response = await fetch(qrCodeDataURL)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying QR code:', error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={generateQRCode}>
          <QrCode className="h-4 w-4 mr-1" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code for /{shortCode}</DialogTitle>
          <DialogDescription>
            Scan this QR code to access your shortened URL
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* QR Code Display */}
          <div className="flex justify-center p-4">
            {isGenerating ? (
              <div className="flex items-center justify-center w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <QrCode className="h-8 w-8 mx-auto text-gray-400 animate-pulse" />
                  <p className="mt-2 text-sm text-gray-500">Generating QR code...</p>
                </div>
              </div>
            ) : qrCodeDataURL ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={qrCodeDataURL} 
                  alt={`QR Code for ${shortCode}`}
                  className="w-64 h-64 border rounded-lg"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <QrCode className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Click to generate QR code</p>
                </div>
              </div>
            )}
          </div>

          {/* URL Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Short URL</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded border">
                {typeof window !== 'undefined' ? `${window.location.origin}/${shortCode}` : `/${shortCode}`}
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {qrCodeDataURL && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={downloadQRCode}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={copyQRCode}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}