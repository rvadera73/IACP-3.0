import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Shield, Gavel, ArrowRight, Activity, FilePlus, ArrowUpRight } from 'lucide-react';
import { Button, Card } from './UI';
import { motion } from 'motion/react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center mb-12"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-dol-blue p-4 rounded-2xl shadow-xl">
            <Shield className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          Intelligent Adjudicatory Case Portal
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          A Human-Centered, AI-powered ecosystem for OALJ and Appeals Boards (BRB, ARB, ECAB) 
          featuring the Unified Filing Service and Intelligent Case Management.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card
            className="h-full hover:border-blue-400 transition-all group cursor-pointer"
            onClick={() => navigate('/login', { state: { portal: 'external' } })}
            aria-label="Access the Unified Filing Service"
          >
            <div className="p-8 flex flex-col h-full">
              <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                <FileText className="w-8 h-8 text-dol-blue" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Unified Filing Service (UFS)</h2>
              <p className="text-slate-600 mb-8 flex-grow">
                A simplified, accessible portal for Claimants, Attorneys, and Operators to
                submit new cases, file evidence, and track status with AI-powered guidance.
              </p>
              <Button
                variant="outline"
                className="w-full justify-between group-hover:bg-dol-blue group-hover:text-white"
                aria-label="Enter Unified Filing Service"
              >
                Access UFS Portal <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card
            className="h-full hover:border-dol-red/40 transition-all group cursor-pointer"
            onClick={() => navigate('/login', { state: { portal: 'internal' } })}
            aria-label="Access the Intelligent Adjudicatory Case Portal"
          >
            <div className="p-8 flex flex-col h-full">
              <div className="bg-red-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-100 transition-colors">
                <Gavel className="w-8 h-8 text-dol-red" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Intelligent Adjudicatory Case Portal (IACP)</h2>
              <p className="text-slate-600 mb-8 flex-grow">
                An advanced workspace for OALJ and Board staff to manage docketing,
                adjudication, and appellate review with AI-assisted workload management.
              </p>
              <Button
                variant="outline"
                className="w-full justify-between group-hover:bg-dol-red group-hover:text-white"
                aria-label="Enter Intelligent Adjudicatory Case Portal"
              >
                Access IACP Hub <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 flex flex-wrap justify-center items-center gap-8 text-slate-400 grayscale opacity-60"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest">Authoritative Record Management</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest">Automated Adjudication</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest">Intelligent Case Tracking</span>
        </div>
      </motion.div>
    </div>
  );
}
