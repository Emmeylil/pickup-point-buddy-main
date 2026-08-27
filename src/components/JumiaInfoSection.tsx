import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  ShieldCheck,
  Package,
  CheckCircle2,
  Tag,
  Clock,
  Store,
  Calendar,
  Zap,
  Sparkles
} from "lucide-react";

interface JumiaInfoSectionProps {
  fee?: string;
}

export function JumiaInfoSection({ fee = "₦500" }: JumiaInfoSectionProps) {
  return (
    <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-4 sm:p-6 md:p-8 my-6 shadow-xs">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-gray-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-jumia-orange" />
              <span>Jumia Express Pickup Guide</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Pickup Station Information & Benefits
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Everything you need to know about collecting your Jumia packages quickly and safely.
            </p>
          </div>
        </div>



        {/* TWO-COLUMN GRID: Delivery Timeline & Customer Safety */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* CARD 1: Delivery Timeline */}
          <Card className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200/70 text-jumia-orange flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-gray-900 tracking-tight">
                    Delivery Timeline
                  </h3>
                  <span className="text-xs text-gray-500 font-medium">Order to Pickup Process</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Delivery time starts from the day you place your order to when you receive the first SMS to pick up your order from our pickup station.
              </p>

              {/* HIGHLIGHT BOX FOR 5 BUSINESS DAYS */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-950 leading-snug">
                  Ensure you pick up your item within{" "}
                  <span className="font-black text-orange-700 bg-orange-100/90 px-2 py-0.5 rounded border border-orange-300/80 inline-block my-0.5">
                    5 business days
                  </span>
                  , otherwise it will be cancelled.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CARD 2: Customer Safety */}
          <Card className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200/70 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-gray-900 tracking-tight">
                    Customer Safety
                  </h3>
                  <span className="text-xs text-gray-500 font-medium">Safe & Secure Station Experience</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                At Jumia we ensure customer safety at our pickup station as:
              </p>

              {/* MINI SAFETY BULLET ITEMS */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50/80 border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700 font-medium leading-normal">
                    We follow contactless pickup procedures for all order pickups
                  </p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50/80 border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700 font-medium leading-normal">
                    We ensure no direct contact between you and the Jumia team members
                  </p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50/80 border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700 font-medium leading-normal">
                    When you arrive the store, you will receive specific pickup instructions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* FULL WIDTH CARD: Pickup Station Benefits */}
        <Card className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
          <CardContent className="p-5 sm:p-6 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200/70 text-jumia-orange flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-gray-900 tracking-tight">
                    Pickup Station Benefits
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Advantages of picking up your items at the pickup stations include:
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="w-fit text-[11px] font-bold text-orange-700 bg-orange-50 border-orange-200/80">
                Top Reasons to Choose Pickup
              </Badge>
            </div>

            {/* BENEFITS 2x2 MINI GRID FOR SCANNING */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              
              {/* Benefit 1 */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50/50 to-amber-50/30 border border-orange-100 space-y-1.5 hover:border-orange-200 transition-colors">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-orange-600 shrink-0" />
                  <span className="font-bold text-xs sm:text-sm text-gray-900">
                    <span className="font-black text-orange-600 bg-orange-100/90 px-1.5 py-0.5 rounded border border-orange-200">
                      Cheaper shipping fee
                    </span>{" "}
                    when you order to a pickup station
                  </span>
                </div>
                <p className="text-xs text-gray-600 pl-6 leading-relaxed">
                  Enjoy discounted shipping rates on all your orders compared to standard door-to-door delivery options.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1.5 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-600 shrink-0" />
                  <span className="font-bold text-xs sm:text-sm text-gray-900">
                    Flexible Pickup Schedule
                  </span>
                </div>
                <p className="text-xs text-gray-600 pl-6 leading-relaxed">
                  It allows customers adequately schedule your pickup at your convenience within the provided terms and conditions.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1.5 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-600 shrink-0" />
                  <span className="font-bold text-xs sm:text-sm text-gray-900">
                    No Dispatcher Delays
                  </span>
                </div>
                <p className="text-xs text-gray-600 pl-6 leading-relaxed">
                  No case of delayed delivery from dispatcher / rider. Your package stays safe at the station until you arrive.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1.5 hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-600 shrink-0" />
                  <span className="font-bold text-xs sm:text-sm text-gray-900">
                    Standard Package Limits
                  </span>
                </div>
                <p className="text-xs text-gray-600 pl-6 leading-relaxed">
                  The only limitation on pickup stations is the weight and size limit of the item that can be shipped to the station.
                </p>
              </div>

            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}