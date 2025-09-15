import { Card, CardContent } from "@/components/ui/card";
import { Clock, Truck, Shield, Package, CheckCircle } from "lucide-react";

export function JumiaInfoSection() {
  return (
    <div className="bg-gradient-jumia py-8 mb-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Delivery Info */}
          <Card className="mb-6 border-none shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Clock className="h-6 w-6 text-jumia-orange mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-jumia-dark">Delivery Timeline</h3>
                  <p className="text-jumia-gray leading-relaxed">
                    Delivery time starts from the day you place your order to when you receive the first SMS to pick up your order from our pickup station. Ensure you pickup your item within 5 business days, otherwise it will be cancelled.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advantages */}
          <Card className="mb-6 border-none shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Truck className="h-6 w-6 text-jumia-orange mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-jumia-dark">Advantages of picking up your items at the pickup stations include</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-jumia-orange mt-0.5 flex-shrink-0" />
                      <p className="text-jumia-gray">Cheaper shipping fee when you order to a pickup station</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-jumia-orange mt-0.5 flex-shrink-0" />
                      <p className="text-jumia-gray">It allows customers adequately schedule your pickup at your convenience within the provided terms and conditions.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-jumia-orange mt-0.5 flex-shrink-0" />
                      <p className="text-jumia-gray">No case of delayed delivery from dispatcher / rider</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-jumia-orange mt-0.5 flex-shrink-0" />
                      <p className="text-jumia-gray">The only limitation on pickup stations is the weight and size limit of the item that can be shipped to the station.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Measures */}
          {/* <Card className="border-none shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-jumia-orange mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-jumia-dark">At Jumia we ensure customer safety at our pickup station as:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-jumia-orange mt-0.5 flex-shrink-0" />
                      <p className="text-jumia-gray">We follow contactless pickup procedures for all order pickups</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-jumia-orange mt-0.5 flex-shrink-0" />
                      <p className="text-jumia-gray">We ensure no direct contact between you and the Jumia team members</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-jumia-orange mt-0.5 flex-shrink-0" />
                      <p className="text-jumia-gray">When you arrive the store, you will receive specific pickup instructions</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}