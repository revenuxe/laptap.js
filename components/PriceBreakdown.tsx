"use client";

import { Card } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";

interface PriceBreakdownProps {
  breakdown: {
    basePrice: number;
    afterInitialDep: number;
    afterAgeDep: number;
    afterPhysicalDep: number;
    afterScreenDep: number;
    afterFunctionalDep: number;
    afterSpecAdditions: number;
    deductions: {
      initialDep: number;
      ageDep: number;
      physicalDep: number;
      screenDep: number;
      functionalDep: number;
    };
    additions: {
      specs: number;
      competitiveBonus: number;
    };
  };
}

export function PriceBreakdown({ breakdown }: PriceBreakdownProps) {
  return (
    <Card className="p-6 space-y-4 bg-muted/30">
      <h3 className="font-semibold text-lg mb-4">Price Breakdown</h3>
      
      {/* Base Price */}
      <div className="flex justify-between items-center pb-3 border-b">
        <span className="text-sm">Base Price</span>
        <span className="font-semibold">â‚¹{breakdown.basePrice.toLocaleString()}</span>
      </div>

      {/* Deductions */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase">Deductions</p>
        
        {breakdown.deductions.initialDep > 0 && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Minus className="h-3 w-3 text-destructive" />
              <span>Brand Depreciation</span>
            </div>
            <span className="text-destructive">-â‚¹{breakdown.deductions.initialDep.toLocaleString()}</span>
          </div>
        )}

        {breakdown.deductions.ageDep > 0 && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Minus className="h-3 w-3 text-destructive" />
              <span>Age Depreciation</span>
            </div>
            <span className="text-destructive">-â‚¹{breakdown.deductions.ageDep.toLocaleString()}</span>
          </div>
        )}

        {breakdown.deductions.physicalDep > 0 && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Minus className="h-3 w-3 text-destructive" />
              <span>Physical Condition</span>
            </div>
            <span className="text-destructive">-â‚¹{breakdown.deductions.physicalDep.toLocaleString()}</span>
          </div>
        )}

        {breakdown.deductions.screenDep > 0 && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Minus className="h-3 w-3 text-destructive" />
              <span>Screen Condition</span>
            </div>
            <span className="text-destructive">-â‚¹{breakdown.deductions.screenDep.toLocaleString()}</span>
          </div>
        )}

        {breakdown.deductions.functionalDep > 0 && (
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Minus className="h-3 w-3 text-destructive" />
              <span>Functional Issues</span>
            </div>
            <span className="text-destructive">-â‚¹{breakdown.deductions.functionalDep.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Additions */}
      {(breakdown.additions.specs > 0 || breakdown.additions.competitiveBonus > 0) && (
        <div className="space-y-2 pt-3 border-t">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Bonuses</p>
          
          {breakdown.additions.specs > 0 && (
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Plus className="h-3 w-3 text-green-600" />
                <span>Premium Specs</span>
              </div>
              <span className="text-green-600">+â‚¹{breakdown.additions.specs.toLocaleString()}</span>
            </div>
          )}

          {breakdown.additions.competitiveBonus > 0 && (
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Plus className="h-3 w-3 text-green-600" />
                <span>Competitive Bonus</span>
              </div>
              <span className="text-green-600">+â‚¹{breakdown.additions.competitiveBonus.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
