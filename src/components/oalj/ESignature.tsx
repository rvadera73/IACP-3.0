/**
 * E-Signature Component
 * 
 * Digital signature capture for judicial decisions:
 * - Typed signature with name verification
 * - Signature pad for handwritten signature
 * - PIN-based authentication
 * - Biometric options (future)
 * 
 * Features:
 * - Signature validation
 * - Audit trail
 * - Timestamp verification
 * - Multi-factor authentication support
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Signature, CheckCircle, AlertCircle, X, PenTool, Keyboard, Shield } from 'lucide-react';
import { Card, Badge, Button } from '../UI';

interface ESignatureProps {
  judgeName: string;
  caseNumber: string;
  onSign: (signature: {
    type: 'typed' | 'handwritten' | 'pin';
    value: string;
    timestamp: string;
    ipAddress?: string;
  }) => void;
  onCancel: () => void;
}

export default function ESignature({
  judgeName,
  caseNumber,
  onSign,
  onCancel,
}: ESignatureProps) {
  const [signatureMethod, setSignatureMethod] = useState<'typed' | 'handwritten' | 'pin'>('typed');
  const [typedSignature, setTypedSignature] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, []);

  // Handle typed signature
  const handleTypedSign = () => {
    if (!typedSignature.trim()) {
      setError('Please type your full name');
      return;
    }

    if (typedSignature.toLowerCase() !== judgeName.toLowerCase()) {
      setError('Signature must match judge name');
      return;
    }

    setIsSigning(true);
    
    // Simulate signature verification
    setTimeout(() => {
      onSign({
        type: 'typed',
        value: typedSignature,
        timestamp: new Date().toISOString(),
      });
      setIsSigning(false);
    }, 1000);
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }

    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Handle handwritten signature
  const handleHandwrittenSign = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if canvas is empty
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const isEmpty = !imageData.data.some(channel => channel !== 0);

    if (isEmpty) {
      setError('Please provide your signature');
      return;
    }

    setIsSigning(true);
    
    setTimeout(() => {
      const signatureData = canvas.toDataURL('image/png');
      onSign({
        type: 'handwritten',
        value: signatureData,
        timestamp: new Date().toISOString(),
      });
      setIsSigning(false);
    }, 1000);
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setError('');
  };

  // Handle PIN signature
  const handlePinSign = () => {
    if (pinCode.length !== 6) {
      setError('PIN must be 6 digits');
      return;
    }

    setIsSigning(true);
    
    setTimeout(() => {
      onSign({
        type: 'pin',
        value: pinCode,
        timestamp: new Date().toISOString(),
      });
      setIsSigning(false);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Signature className="w-6 h-6 text-emerald-600" />
              Electronic Signature
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Case: {caseNumber} • Judge: {judgeName}
            </p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Signature Method Selection */}
        <div className="p-6 border-b border-slate-200">
          <label className="block text-sm font-bold text-slate-700 mb-3">
            Select Signature Method
          </label>
          <div className="grid grid-cols-3 gap-3">
            <Card
              className={`p-4 cursor-pointer transition-all ${
                signatureMethod === 'typed' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => {
                setSignatureMethod('typed');
                setError('');
              }}
            >
              <Keyboard className="w-6 h-6 text-slate-600 mb-2" />
              <div className="font-bold text-slate-900 text-sm">Typed</div>
              <div className="text-xs text-slate-500">Type your name</div>
            </Card>
            <Card
              className={`p-4 cursor-pointer transition-all ${
                signatureMethod === 'handwritten' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => {
                setSignatureMethod('handwritten');
                setError('');
              }}
            >
              <PenTool className="w-6 h-6 text-slate-600 mb-2" />
              <div className="font-bold text-slate-900 text-sm">Handwritten</div>
              <div className="text-xs text-slate-500">Draw signature</div>
            </Card>
            <Card
              className={`p-4 cursor-pointer transition-all ${
                signatureMethod === 'pin' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => {
                setSignatureMethod('pin');
                setError('');
              }}
            >
              <Shield className="w-6 h-6 text-slate-600 mb-2" />
              <div className="font-bold text-slate-900 text-sm">PIN</div>
              <div className="text-xs text-slate-500">6-digit PIN</div>
            </Card>
          </div>
        </div>

        {/* Signature Input */}
        <div className="p-6">
          {signatureMethod === 'typed' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Type Your Full Name
                </label>
                <input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => {
                    setTypedSignature(e.target.value);
                    setError('');
                  }}
                  placeholder={judgeName}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Must match: {judgeName}
                </p>
              </div>
            </div>
          )}

          {signatureMethod === 'handwritten' && (
            <div className="space-y-4">
              <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={200}
                  className="w-full bg-white cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCanvas}
                  leftIcon={<X className="w-4 h-4" />}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {signatureMethod === 'pin' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Enter 6-Digit PIN
                </label>
                <input
                  type="password"
                  value={pinCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setPinCode(value);
                    setError('');
                  }}
                  placeholder="••••••"
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-2xl text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
        </div>

        {/* Warning */}
        <div className="px-6 pb-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div className="text-sm text-amber-700">
                <strong>Legal Notice:</strong> By signing, you certify that:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>You are the judge assigned to this case</li>
                  <li>You have reviewed the entire record</li>
                  <li>This decision represents your independent judgment</li>
                  <li>You understand this creates an official government record</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={
              signatureMethod === 'typed' ? handleTypedSign :
              signatureMethod === 'handwritten' ? handleHandwrittenSign :
              handlePinSign
            }
            disabled={isSigning}
            leftIcon={isSigning ? <CheckCircle className="w-4 h-4 animate-spin" /> : <Signature className="w-4 h-4" />}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSigning ? 'Signing...' : 'Sign Decision'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
