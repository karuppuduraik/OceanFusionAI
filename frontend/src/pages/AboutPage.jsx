import React, { useState } from 'react';
import {
  FiInfo,
  FiBookOpen,
  FiTarget,
  FiLayers,
  FiUsers,
  FiAward,
  FiExternalLink,
  FiCheckCircle,
  FiCpu,
  FiGlobe,
  FiFileText
} from 'react-icons/fi';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { projectOverview } from '../data/mockTeamData';

export default function AboutPage() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero / Title Section */}
      <div className="glass-panel-deep p-6 sm:p-8 rounded-3xl border border-ocean-sky/40 dark:border-ocean-borderDark shadow-xl text-center sm:text-left space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="teal" size="md">
            Final Year Engineering Capstone Project • 2025–2026
          </Badge>
          <span className="text-xs font-mono text-ocean-teal font-semibold">
            IEEE Geosciences &amp; Remote Sensing Track
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-ocean-navy dark:text-ocean-surface leading-tight">
          {projectOverview.title}
        </h1>
        <p className="text-sm sm:text-base font-medium text-ocean-teal">
          {projectOverview.subtitle}
        </p>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-ocean-sky/20 dark:border-ocean-borderDark">
          {projectOverview.abstract}
        </p>
      </div>

      {/* Problem Statement & Core Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-500">
            <FiTarget className="w-5 h-5" />
            <h3 className="text-base font-bold font-heading text-ocean-navy dark:text-ocean-surface">
              Problem Statement
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {projectOverview.problemStatement}
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-ocean-teal">
            <FiCheckCircle className="w-5 h-5" />
            <h3 className="text-base font-bold font-heading text-ocean-navy dark:text-ocean-surface">
              Project Objectives
            </h3>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {projectOverview.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ocean-teal mt-1.5 flex-shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* PICO Framework Matrix */}
      <Card className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2">
          <FiBookOpen className="w-5 h-5 text-ocean-teal" />
          <h3 className="text-lg font-bold font-heading text-ocean-navy dark:text-ocean-surface">
            PICO Research Formulation Matrix
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-ocean-sky/15 dark:bg-ocean-deep/80 border border-ocean-sky/30 dark:border-ocean-borderDark space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ocean-teal block">
              P — Population / Sector
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {projectOverview.picoFramework.population}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-ocean-sky/15 dark:bg-ocean-deep/80 border border-ocean-sky/30 dark:border-ocean-borderDark space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ocean-teal block">
              I — Intervention (AI Model)
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {projectOverview.picoFramework.intervention}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-ocean-sky/15 dark:bg-ocean-deep/80 border border-ocean-sky/30 dark:border-ocean-borderDark space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ocean-teal block">
              C — Comparison Baseline
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {projectOverview.picoFramework.comparison}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-ocean-sky/15 dark:bg-ocean-deep/80 border border-ocean-sky/30 dark:border-ocean-borderDark space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              O — Outcome &amp; Impact
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {projectOverview.picoFramework.outcome}
            </p>
          </div>
        </div>
      </Card>

      {/* Research Gaps vs OceanFusion AI Innovations */}
      <Card className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2">
          <FiLayers className="w-5 h-5 text-ocean-teal" />
          <h3 className="text-lg font-bold font-heading text-ocean-navy dark:text-ocean-surface">
            Research Gaps Addressed
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectOverview.researchGaps.map((gap, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white/50 dark:bg-ocean-deep/60 border border-ocean-sky/30 dark:border-ocean-borderDark space-y-2.5"
            >
              <h4 className="text-sm font-bold text-ocean-navy dark:text-ocean-surface">{gap.gap}</h4>
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                <span className="text-rose-400 font-bold block text-[10px] uppercase">Traditional Approach:</span>
                <p className="text-slate-700 dark:text-slate-300">{gap.traditional}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <span className="text-emerald-400 font-bold block text-[10px] uppercase">OceanFusion AI Solution:</span>
                <p className="text-slate-700 dark:text-slate-300">{gap.oceanFusionSolution}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Interactive Architecture Flow Diagram */}
      <Card className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiCpu className="w-5 h-5 text-ocean-teal" />
            <h3 className="text-lg font-bold font-heading text-ocean-navy dark:text-ocean-surface">
              Deep Learning Workflow &amp; Block Diagram
            </h3>
          </div>
          <span className="text-xs text-slate-400">Click any step to inspect</span>
        </div>

        {/* Pipeline Step Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {projectOverview.modelArchitectureSteps.map((s) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-3 rounded-2xl text-left transition-all border ${
                activeStep === s.step
                  ? 'bg-gradient-to-tr from-ocean-navy to-ocean-teal text-white border-ocean-teal shadow-glow-teal'
                  : 'bg-ocean-sky/15 dark:bg-ocean-deep/60 text-slate-700 dark:text-ocean-sky border-ocean-sky/20 hover:bg-ocean-teal/10'
              }`}
            >
              <span className="text-[10px] font-mono font-bold block opacity-75">STAGE 0{s.step}</span>
              <p className="text-xs font-bold mt-1 line-clamp-2 leading-tight">{s.name}</p>
            </button>
          ))}
        </div>

        {/* Selected Step Detail Box */}
        {projectOverview.modelArchitectureSteps.find(s => s.step === activeStep) && (
          <div className="p-4 rounded-2xl bg-ocean-sky/20 dark:bg-ocean-deep border border-ocean-teal/40">
            <span className="text-xs font-bold text-ocean-teal uppercase tracking-wider block mb-1">
              Stage 0{activeStep} Breakdown: {projectOverview.modelArchitectureSteps.find(s => s.step === activeStep)?.name}
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              {projectOverview.modelArchitectureSteps.find(s => s.step === activeStep)?.desc}
            </p>
          </div>
        )}
      </Card>

      {/* Project Team & Supervisor */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <FiUsers className="w-5 h-5 text-ocean-teal" />
          <h3 className="text-lg font-bold font-heading text-ocean-navy dark:text-ocean-surface">
            Project Mentorship &amp; Engineering Team
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectOverview.teamMembers.map((member, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white/40 dark:bg-ocean-deep/60 border border-ocean-sky/30 dark:border-ocean-borderDark flex flex-col items-center text-center space-y-3"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-ocean-teal shadow-md"
              />
              <div>
                <Badge variant={member.badge === 'Faculty Mentor' ? 'purple' : 'teal'} size="sm">
                  {member.badge}
                </Badge>
                <h4 className="text-sm font-bold text-ocean-navy dark:text-ocean-surface mt-1.5">{member.name}</h4>
                <p className="text-xs text-ocean-teal font-semibold">{member.role}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{member.title}</p>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-ocean-sky/80 pt-2 border-t border-ocean-sky/15 dark:border-ocean-borderDark/40">
                {member.contributions}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* References & Citations */}
      <Card className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <FiFileText className="w-5 h-5 text-ocean-teal" />
          <h3 className="text-lg font-bold font-heading text-ocean-navy dark:text-ocean-surface">
            Academic Literature References (IEEE Standards)
          </h3>
        </div>

        <div className="space-y-2.5">
          {projectOverview.references.map((ref, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-ocean-sky/10 dark:bg-ocean-deep/60 border border-ocean-sky/20 dark:border-ocean-borderDark text-xs space-y-1"
            >
              <p className="text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                [{idx + 1}] {ref.citation}
              </p>
              <span className="text-[10px] text-ocean-teal font-mono block">DOI / Ref: {ref.doi}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
