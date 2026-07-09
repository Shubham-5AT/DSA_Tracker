import { dsaPatterns } from '../data/dsaPatterns';
import { roadmapData } from '../data/roadmapData';

export interface ProgressStats {
  totalDsa: number;
  completedDsa: number;
  dsaPercent: number;
  totalRoadmap: number;
  completedRoadmap: number;
  roadmapPercent: number;
  combinedPercent: number;
}

export const calculateProgress = (
  dsaProgress: Record<string, boolean>,
  roadmapProgress: Record<string, boolean>
): ProgressStats => {
  // 1. DSA Calculations
  const totalDsa = dsaPatterns.reduce((sum, pattern) => sum + pattern.problems.length, 0);
  const completedDsa = Object.values(dsaProgress).filter(Boolean).length;
  const dsaPercent = totalDsa > 0 ? (completedDsa / totalDsa) * 100 : 0;

  // 2. Roadmap Calculations
  const totalRoadmap = roadmapData.reduce((sum, phase) => sum + phase.items.length, 0);
  
  let completedRoadmap = 0;
  roadmapData.forEach((phase) => {
    phase.items.forEach((item, index) => {
      if (item.isDsaLinked) {
        // DSA Linked is checked if DSA is 100% complete
        if (completedDsa === totalDsa && totalDsa > 0) {
          completedRoadmap++;
        }
      } else {
        const key = `${phase.id}::${index}`;
        if (roadmapProgress[key]) {
          completedRoadmap++;
        }
      }
    });
  });

  const roadmapPercent = totalRoadmap > 0 ? (completedRoadmap / totalRoadmap) * 100 : 0;

  // 3. Combined Calculations (averaging both progress percentages for equal weight)
  const combinedPercent = Math.round((dsaPercent + roadmapPercent) / 2);

  return {
    totalDsa,
    completedDsa,
    dsaPercent,
    totalRoadmap,
    completedRoadmap,
    roadmapPercent,
    combinedPercent,
  };
};
