import { createClient } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";



// Fetch orders for the authenticated user
async function getOrders(user:any) {
  const supabase = createClient();
  // const {
  //   data: { user },
  //   error: authError,
  // } = await supabase.auth.getUser();

  // if (authError || !user) {
  //   console.error("Authentication error:", authError);
  //   return [];
  // }

  const { data: orderData, error } = await supabase
    .from("orders")
    .select(`
      *,
      restaurants (name),
      order_items (
        quantity,
        unit_price,
        menu_items (name)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

    setOrders( orders || [])

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return;
}

export default  function OrdersPage() {
  const [orders, setOrders]= useState<any[]>([]);
  const {user,signOut}= useAuth();
  const Orders = getOrders(user);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {order.restaurants?.name || "Unknown Restaurant"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ordered on {format(new Date(order.created_at), "PPP")}
                </p>
              </div>
              <Badge
                variant={
                  order.status === "delivered" ? "default" : "secondary"
                }
              >
                {order.status}
              </Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.order_items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.menu_items?.name || "Unknown Item"}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      ${(item.quantity * item.unit_price).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="text-right font-semibold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${order.total_amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        ))}
      </div>
    </div>
  );
}
